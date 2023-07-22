import React from "react";
import Logo from "../components/Logo/Logo";
import Rank from "../components/Rank/Rank";
import ImageLinkForm from "../components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "../components/FaceRecognition/FaceRecognition";

const Home = ({ user, box, imageUrl, onInputChange, onButtonSubmit }) => {
  return(
    <div>
      <Logo />
      <Rank userName={user.name} userEntries={user.entries}/>
      <ImageLinkForm 
        onInputChange={onInputChange} 
        onButtonSubmit={onButtonSubmit}
      />
      <FaceRecognition boxes={box} imageLink={imageUrl} />
    </div>
  );
}

export default Home;