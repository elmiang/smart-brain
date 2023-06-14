import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
  return(
    <Tilt className="tilt logo ml3 br2 shadow-2" tiltMaxAngleX={25} tiltMaxAngleY={25}>
      <div className="ma4 mt">
        <img className="pt4" src={brain} alt='logo'/>
      </div>
    </Tilt>
  );
}

export default Logo;