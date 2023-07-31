import React, { useState } from "react";
import './Leaderboard.css';
import axios from "axios";

const entryRankings = await axios.get(`${process.env.REACT_APP_SERVER_URL}/rankings/entries`);
const faceRankings = await axios.get(`${process.env.REACT_APP_SERVER_URL}/rankings/faces`);

let rankingsData = entryRankings;

if (rankingType === "entries") {
  rankingsData = entryRankings;
}
else {
  rankingsData = faceRankings
}

const rankings = rankingsData.data.map((user, index) => {
  const { name, entries, faces } = user; 
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{name}</td>
      <td>{entries}</td>
      <td>{faces}</td>
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
        <td>{currentUser.faces}</td>
      </tr>
    )
  }

  return(
    <div className="flex flex-column items-center">
      <div className="controls">
        <a className="button1">Entries</a>
        <a className="button2">Face Count</a>
      </div>
      <table id="leaderboard">
        <thead>
          <tr>
            <th className="rank">Rank</th>
            <th>User</th>
            <th>Entries</th>
            <th>Face Count</th>
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