import React, { Component } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import ParticleBackground from '../components/ParticleBackground';
import Navigation from '../components/Navigation/Navigation';
import Home from '../pages/Home';
import UserForm from '../components/UserForm';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  box: [],
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
        console.log(response);
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
    const { box, imageUrl, user } = this.state;
    return (
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
    );
  }
}

export default App;