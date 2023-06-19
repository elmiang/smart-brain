import React, { Component } from 'react';
import ParticleBackground from './components/ParticleBackground';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import './App.css';

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
      box: [],
      route: 'signin',
    }
  }

  onRouteChange = (route) => {
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
      .then(response => response.json())
      .then(result => this.displayFaceBox(this.calculateFaceLocation(result)))
      .catch(error => console.log('error', error));
  }

  render() {
    return (
      <div className="App">
        <ParticleBackground />
        <Navigation onRouteChange={this.onRouteChange}/>
        {this.state.route === 'signin' 
          ? <SignIn onRouteChange={this.onRouteChange}/> 
          : <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={this.state.box} imageLink={this.state.imageUrl} />
            </div>
        }
      </div>
    );
  }
}

export default App;
