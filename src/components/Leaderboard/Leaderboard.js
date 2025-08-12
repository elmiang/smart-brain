import { useState, useEffect } from "react";
import './Leaderboard.css';
import axios from "axios";

const Leaderboard = ({ loggedUser }) => {
  const [entriesSelected, setEntriesSelection] = useState(true);
  const [rankingsData, setRankingsData] = useState([]);

  //Update rankings data source based on the filter selected
  useEffect(() => {
    const setupRankingsData = async (isEntriesSelected) => {
      let response = "";
      try {
        if (isEntriesSelected) {
          response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/rankings/entries`);
        }
        else {
          response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/rankings/faces`);
        }
        setRankingsData(response);
      }
      catch (error) {
        console.error(error);
      }
   }

   setupRankingsData(entriesSelected);
  }, [entriesSelected]);

  let rankings = rankingsData?.data?.map((user, index) => {
    const { name, entries, faces } = user; 
    return (
      <tr key={index}>
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
    let currentUser = rankingsData?.data?.filter(user => user.name === loggedUser.name)[0];
    for (let i = 0; i < rankingsData?.data?.length; i++) {
      if (currentUser?.name === rankingsData?.data[i]?.name) {
        currentUser.index = i;
      }
    }

    currentRanking = (
      <tr id="currentuser" key={currentUser?.index}>
        <td>{currentUser?.index + 1}</td>
        <td>{currentUser?.name}</td>
        <td>{currentUser?.entries}</td>
        <td>{currentUser?.faces}</td>
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
      <table className="leaderboard">
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