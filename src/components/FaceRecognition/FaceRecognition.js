import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ boxes, imageLink }) => {
  const boundingBoxes = boxes.map((box, index) => {
    return <div key={index} className="bounding-box" style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
  });

  return(
    <div className="center ma">
      <div className="absolute mt2 box-container">
        <img id='inputImage' alt='' src={imageLink} width='500px' height='auto' />
        {/* <div className="bounding-box" style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div> */}
        {boundingBoxes}
      </div>
    </div>
  );
}

export default FaceRecognition;