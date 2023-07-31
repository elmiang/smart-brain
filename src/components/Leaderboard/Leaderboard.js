import React from "react";
import './Leaderboard.css';
import axios from "axios";

const rankingsData = await axios.get(`${process.env.REACT_APP_SERVER_URL}/rankings/entries`);
const rankings = rankingsData.data.map((user, index) => {
  const { name, entries } = user; 
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{name}</td>
      <td>{entries}</td>
    </tr>
  )
});

const Leaderboard = ({ loggedUser }) => {
  let currentRanking;
  if (loggedUser.id) {
    let currentUser = rankingsData.data.filter(user => user.name === loggedUser.name)[0];
    for (let i = 0; i < rankingsData.data.length; i++) {
      if (currentUser.name === rankingsData.data[i].name) {
        currentUser.index = i;
      }
    }

    currentRanking = (
      <tr id="currentuser">
        <td>{currentUser.index + 1}</td>
        <td>{currentUser.name}</td>
        <td>{currentUser.entries}</td>
      </tr>
    )
  }

  return(
    <div className="center">
      <table id="leaderboard">
        <thead>
          <tr>
            <th className="rank">Rank</th>
            <th>User</th>
            <th>Entries</th>
          </tr>
        </thead>
        <tbody>
          {rankings}
          {currentRanking}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;