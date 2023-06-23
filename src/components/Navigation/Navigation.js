import React from "react";

const Navigation = ({ onRouteChange, isSignedIn}) => {
  return(
    (isSignedIn 
      ? <nav className="flex flex-column items-end">
          <p onClick={() => onRouteChange('signout')} className="f3 link dim black underline pa3 pointer">Sign Out</p>
        </nav>
      : <nav className="flex flex-row justify-end">
          <p onClick={() => onRouteChange('signin')} className="f3 link dim black underline pa3 pointer">Sign In</p>
          <p onClick={() => onRouteChange('register')} className="f3 link dim black underline pa3 pointer">Register</p>
        </nav>
    )
  );
}

export default Navigation;