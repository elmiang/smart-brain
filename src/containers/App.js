import React, { Component } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import Navigation from '../components/Navigation/Navigation';
import Logo from '../components/Logo/Logo';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import Rank from '../components/Rank/Rank';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';
import UserForm from '../components/UserForm';
import './App.css';
import axios from 'axios';

const initialState = {
  input: '',
  imageUrl: '',
  box: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  getInitialState = () => {
    return initialState;
  };

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      entries: data.entries,
      joined: data.joined
    }});
  }

  resetState = () => {
    this.setState(this.getInitialState());
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.resetState();
      return;
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  calculateFaceLocation = (data) => {
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    const facePositions = [];
    
    data.outputs[0].data.regions.forEach(region => {
      const { left_col, top_row, right_col, bottom_row } = region.region_info.bounding_box;
      facePositions.push({
        leftCol: left_col * width,
        topRow: top_row * height,
        rightCol: width - (right_col * width),
        bottomRow: height - (bottom_row * height),
      })
    });
    return facePositions;
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    axios.post(`${process.env.REACT_APP_SERVER_URL}/imageurl`, {input: this.state.input}, {
      headers: {'Content-Type': 'application/json'}
    })
    .then(response => {
      if (response) {
        axios.put(`${process.env.REACT_APP_SERVER_URL}/image`, {id: this.state.user.id}, {
          headers: {'Content-Type': 'application/json'}
        })
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count.data }));
        })
        .catch(error => console.log('error', error));
      }
      return response.data;
    })
    .then(data => this.displayFaceBox(this.calculateFaceLocation(data)))
    .catch(error => console.log('error', error));
  }

  
  render() {
    const { isSignedIn, route, box, imageUrl, user } = this.state;

    //Test backend connection
    axios.get(`${process.env.REACT_APP_SERVER_URL}/`)
      .then(response => console.log(response.data));

    //Test GET Request
    axios.get("swapi.dev/api/vehicles")
      .then(response => console.log(response.data));
    return (
      <div className="App">
        <ParticleBackground />
        <Navigation 
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />
        {route === 'home' 
          ? <div>
              <Logo />
              <Rank userName={user.name} userEntries={user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition boxes={box} imageLink={imageUrl} />
            </div>
          : (
              <UserForm type={route} onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
      </div>
    );
  }
}

export default App;