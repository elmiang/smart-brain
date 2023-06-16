import React, { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";

const particleParams = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
      },
    },
    color: {
      value: "#ff0000",
      animation: {
        enable: true,
        speed: 20,
        sync: true,
      },
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.5,
    },
    size: {
      value: {
        min: 1,
        max: 3,
      },
    },
    links: {
      enable: true,
      distance: 150,
      color: "random",
      opacity: 0.4,
      width: 1,
      triangles: {
        enable: true,
        color: "#ffffff",
        opacity: 0.1,
      },
    },
    move: {
      enable: true,
      speed: 6,
    },
  },
  background: {
    color: "#000000",
    opacity: 0
  },
}

const ParticleBackground = () => {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    await console.log(container);
  }, []);

  return(
    <div>
      <Particles 
        className="particles"
        id="tsparticles" 
        init={particlesInit} 
        loaded={particlesLoaded}
        options={particleParams}
      />
    </div>
  );
}

export default ParticleBackground;