import React, { Component } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import ParticleBackground from '../components/ParticleBackground';
import Navigation from '../components/Navigation/Navigation';
import Home from '../pages/Home';
import UserForm from '../components/UserForm';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import Footer from '../components/Footer/Footer';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  box: [],
  buttonActivated: false,
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
      joined: data.joined,
      faces: data.faces
    }});
  }

  componentDidMount() {
    const userData = JSON.parse(sessionStorage.getItem('auth'));
    if (userData) {
      this.loadUser(userData);
    }
  }

  resetState = () => {
    this.setState(this.getInitialState());
  }

  calculateFaceLocation = (data) => {
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    const facePositions = [];
    
    data.regionsList.forEach(region => {
      const { leftCol, topRow, rightCol, bottomRow } = region.regionInfo.boundingBox;
      facePositions.push({
        leftCol: leftCol * width,
        topRow: topRow * height,
        rightCol: width - (rightCol * width),
        bottomRow: height - (bottomRow * height),
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
    this.setState({ buttonActivated: true });
    axios.post(`${process.env.REACT_APP_SERVER_URL}/imageurl`, {input: this.state.input}, {
      headers: {'Content-Type': 'application/json'}
    })
    .then(response => {
      if (response) {
        //Increment user image entries
        axios.put(`${process.env.REACT_APP_SERVER_URL}/imageEntries`, {id: this.state.user.id}, {
          headers: {'Content-Type': 'application/json'}
        })
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count.data }));
        })
        .catch(error => console.log('error', error));

        //Increment user image face count
        const faceCount = response.data.regionsList.length;
        axios.put(`${process.env.REACT_APP_SERVER_URL}/imageFaces`, {id: this.state.user.id, faces: faceCount}, {
          headers: {'Content-Type': 'application/json'}
        })
        .then(count => {
          this.setState(Object.assign(this.state.user, { faces: count.data }));
          this.setState({ buttonActivated: false });
        })
        .catch(error => console.log('error', error));
      }
      return response.data;
    })
    .then(data => this.displayFaceBox(this.calculateFaceLocation(data)))
    .catch(error => console.log('error', error));
  }

  render() {
    const { box, imageUrl, user } = this.state;
    return (
      <div>
        <div className="App">
          <ParticleBackground />
          <BrowserRouter>
            <Navigation 
              resetState={this.resetState}
              id={user.id}
            />
            <Routes>
              <Route path="/" element={<Navigate to="login"/>}/>
              <Route path="/home" 
                element={
                  <Home 
                    user={user} 
                    box={box}  
                    imageUrl={imageUrl}
                    onInputChange={this.onInputChange}
                    onButtonSubmit={this.onButtonSubmit} 
                    buttonActivated={this.state.buttonActivated}
                  />
                }
              />
              <Route path="/login" 
                element={
                  <UserForm
                    type='login'
                    loadUser={this.loadUser}
                  />
                }
              />
              <Route path="/register" 
                element={
                  <UserForm
                    type='register'
                    loadUser={this.loadUser}
                  />
                }
              />
              <Route path="/leaderboard"
                element={
                  <Leaderboard loggedUser={user}/>
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;