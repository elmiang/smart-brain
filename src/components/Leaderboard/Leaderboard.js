import React, { useState, useEffect } from "react";
import './Leaderboard.css';
import axios from "axios";

const entryRankings = await axios.get(`${process.env.REACT_APP_SERVER_URL}/rankings/entries`);
const faceRankings = await axios.get(`${process.env.REACT_APP_SERVER_URL}/rankings/faces`);

let rankingsData = entryRankings;

const Leaderboard = ({ loggedUser }) => {
  const [entriesSelected, setEntriesSelection] = useState(true);

  //Update rankings data source based on the filter selected
  useEffect(() => {
    //Inverted statement is giving the correct results as opposed to the expected statement
    //Something going on with react async state changes and rendering interaction?
    if (!entriesSelected) {
      rankingsData = entryRankings;
    }
    else {
      rankingsData = faceRankings;
    }
  }, [entriesSelected]);

  let rankings = rankingsData.data.map((user, index) => {
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

  //Ranking data of the currently logged in user
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
        <input type="radio" id="entries" value="Entries" name="sortingType" defaultChecked={true} onClick={() => setEntriesSelection(true)}/>
        <label htmlFor="entries">Entries</label>
        <input type="radio" id="faces" value="Faces" name="sortingType" onClick={() => setEntriesSelection(false)}/>
        <label htmlFor="faces">Faces</label>
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