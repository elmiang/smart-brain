import React, { Component } from 'react';
import ParticleBackground from './components/ParticleBackground';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';
import axios from 'axios';

const MODEL_ID = 'face-detection';   
const returnClarifaiRequestOptions = (inputLink) => {
  const PAT = '15be52e14b484b9db71bda8b6f070bee';
  const USER_ID = 'elmiang';       
  const APP_ID = 'smartbrain';
  const IMAGE_URL = inputLink;

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return requestOptions;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
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
  }

  //Returns a copy of the initial state for resetting purposes
  getInitialState = () => ({
    input: '',
    imageUrl: '',
    box: {},
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
  });

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
    const facePos = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: facePos.left_col * width,
      topRow: facePos.top_row * height,
      rightCol: width - (facePos.right_col * width),
      bottomRow: height - (facePos.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", returnClarifaiRequestOptions(this.state.input))
      .then(response => {
        if (response) {
          axios.put('http://localhost:3000/image', {id: this.state.user.id}, {
            headers: {'Content-Type': 'application/json'}
          })
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count.data }));
          });
        }
        return response.json();
      })
      .then(result => this.displayFaceBox(this.calculateFaceLocation(result)))
      .catch(error => console.log('error', error));
  }

  
  render() {
    const { isSignedIn, route, box, imageUrl, user } = this.state;
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
              <FaceRecognition box={box} imageLink={imageUrl} />
            </div>
          : (
              route === 'signin' 
              ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> 
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
      </div>
    );
  }
}

export default App;
