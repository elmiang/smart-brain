import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navigation = ({ resetState, id}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logoutUser = () => {
    resetState();
    navigate('login', { replace: true });
  }

  return(
      (id 
        ? <nav className="flex flex-row justify-end">
            {location.pathname === '/leaderboard' && 
              <p onClick={() => navigate('/home', { replace: true })} className="f3 link dim black underline pa3 pointer">Smartbrain</p>
            }
            <p onClick={() => navigate('/leaderboard', { replace: true })} className="f3 link dim black underline pa3 pointer">Leaderboard</p>
            <p onClick={() => logoutUser()} className="f3 link dim black underline pa3 pointer">Sign Out</p>
          </nav>
        : <nav className="flex flex-row justify-end">
            <p onClick={() => navigate('/leaderboard', { replace: true })} className="f3 link dim black underline pa3 pointer">Leaderboard</p>
            <p onClick={() => navigate('/login', { replace: true })} className="f3 link dim black underline pa3 pointer">Sign In</p>
            <p onClick={() => navigate('/register', { replace: true })} className="f3 link dim black underline pa3 pointer">Register</p>
          </nav>
      )
  );
}

export default Navigation;