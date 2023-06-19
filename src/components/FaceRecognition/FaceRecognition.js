import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ box, imageLink }) => {
  // console.log(box);
  // const boundingBoxes = box.map(box => {
  //   return <div className="bounding-box" style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
  // });

  return(
    <div className="center ma">
      <div className="absolute mt2 box-container">
        <img id='inputImage' alt='' src={imageLink} width='500px' height='auto' />
        <div className="bounding-box" style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
      </div>
    </div>
  );
}

export default FaceRecognition;