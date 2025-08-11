// !!!!!!!!!!! click this link eahc time before testing !!!!!!!!!!: https://cors-anywhere.herokuapp.com/corsdemo

import { useState } from 'react'
import './App.css'
import Players from "./Components/Players.jsx"

export default function App() {

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  const dropdownAttributesList = ["Points", "Assists", "Steals", "BlockedShots", "Rebounds", "FieldGoalsPercentage", "ThreePointersPercentage"]

  const [playerChosen, setPlayerChosen] = useState("")
  const [seasonChosen, setSeasonChosen] = useState("")
  const [playersShownList, setPlayersShownList] = useState([])
  const [attributes, setAttributes] = useState(["Name", "Season", "Team", "Position", "Points", "Assists", "Steals", "BlockedShots", "Rebounds", "FieldGoalsPercentage", "ThreePointersPercentage"])
  const [header, setHeader] = useState({
    "Select": "Select",
    "Name": "Name",
    "Season": "Season",
    "Team": "Team",
    "Position": "Position",
    "Points": "Points",
    "Assists": "Assists",
    "Steals": "Steals",
    "Blocks": "BlockedShots",
    "Rebounds": "Rebounds",
    "FG %": "FieldGoalsPercentage",
    "3-pt %": "ThreePointersPercentage"
  })
  const [rankIsClicked, setRankIsClicked] = useState(false)
  const [attributeChosen, setAttributeChosen] = useState("")
  const [selectedToDelete, setSelectedToDelete] = useState([]); // State to track selected buttons


  // API used: https://sportsdata.io/developers/api-documentation/nba#teams-players-rosters
  const choosePlayerAndSeason = async (event) => {
    event.preventDefault();
    const apiKey = "b8afd33ef5be49faaf74db4d74ec41fe";

    const arrayOfPlayersURL = `https://cors-anywhere.herokuapp.com/https://api.sportsdata.io/v3/nba/scores/json/Players?key=${apiKey}`;

    fetch(arrayOfPlayersURL)
      .then(response => response.json())
      .then(data => {
        // data is an array/object of players
        // console.log(data);
        data.forEach(player => {
          if( player.FirstName.toLowerCase() + ' ' + player.LastName.toLowerCase() === playerChosen.toLowerCase() ) {
            const playerChosenURL = `https://cors-anywhere.herokuapp.com/https://api.sportsdata.io/v3/nba/stats/json/PlayerSeasonStatsByPlayer/${seasonChosen}/${player.PlayerID}?key=${apiKey}`
            fetch(playerChosenURL)
              .then(response2 => response2.json())
              .then(data2 => {
                console.log("Player Data:", data2);
                if (data2 && data2.PlayerID && data2.Season) {
                  setPlayersShownList(prev => {
                    // If already in list, just return prev
                    if (prev.some(p => p.PlayerID === data2.PlayerID && p.Season === data2.Season)) {
                      return prev;
                    }

                    // Add the new player
                    const updated = [...prev, data2];

                    // Sort if attributeChosen is set
                    if (attributeChosen) {
                      const perGameAttrs = ["Points", "Assists", "Steals", "BlockedShots", "Rebounds"];
                      const isPerGame = perGameAttrs.includes(attributeChosen);

                      return [...updated].sort((a, b) =>
                        isPerGame
                          ? (b[attributeChosen] / b.Games) - (a[attributeChosen] / a.Games)
                          : (b[attributeChosen] - a[attributeChosen])
                      );
                    }

                    return updated; // No sort yet
                  });
                }

            });

          }
        });
      })
      .catch(error => {
        console.error("Error fetching players:", error);
      });
  };



  const handleRanking = (event) => {
    let attribute = attributeChosen;

    if (event?.target?.value) {
      attribute = event.target.value;
    }

    setRankIsClicked(true);
    setAttributeChosen(attribute);
    setPlayersShownList(prev =>
      [...prev].sort((a, b) =>
        ["Points", "Assists", "Steals", "BlockedShots", "Rebounds"].includes(attribute)
          ? (b[attribute] / b.Games - a[attribute] / a.Games)
          : (b[attribute] - a[attribute])
      )
    );
  };

  const handleToggle = (index) => {
    if (selectedToDelete.includes(index)) {
      // If the option is already selected, remove it.
      setSelectedToDelete(selectedToDelete.filter((item) => item !== index));
    } else {
      // If the option is not selected, add it.
      setSelectedToDelete([...selectedToDelete, index]);
    }
  }

  const deletePlayer = (selectedToDelete) => {
    setPlayersShownList((prev) =>
      prev.filter((_, index) => !selectedToDelete.includes(index))
    )
    setSelectedToDelete([])
  }

  return (
    <>
      <main> 
          <header>
            <h1>NBA HEAD-2-HEAD</h1> 
          </header>
          
          <div>
            <h3 className="instructions">choose a player, specify a season, and rank by stat</h3>
            <form   onSubmit={(e) => {
              e.preventDefault(); // keep it from refreshing
              choosePlayerAndSeason(e);
              handleRanking();
            }} className="input-row">
              <input
                type="text"
                value={playerChosen} 
                onChange={(e) => 
                  setPlayerChosen(e.target.value)
                } 
                placeholder="Enter player name"
                name="player"
              />

              <input
                type="text"
                value={seasonChosen}
                onChange={(e) => 
                  setSeasonChosen(e.target.value)
                }
                placeholder="Enter season (2024 or 2025 only)"
                name="season"
              />

              <button type="submit" className="red">CHOOSE</button>
            </form>
            
            <div className="second-row-btns">
              {playersShownList.length > 1 && 
                <div className="rank-button-container"> {/*will only be given option to compare once there are more than 1 players shown*/}
                    <p>rank players by</p>
                    <select value={attributeChosen} onChange={handleRanking} className="red">
                        <option value="" disabled>
                            (choose)
                        </option>
                        {dropdownAttributesList.map((attribute, index) => (
                            <option key={index} value={attribute}>
                              {attribute === "BlockedShots" ? "Blocks" 
                              : attribute === "FieldGoalsPercentage" ? "FG %" 
                              : attribute === "ThreePointersPercentage" ? "3-pt %"
                              : attribute} {/* Display more user-friendly names*/}
                            </option>
                        ))}
                    </select>
                </div>
              }
            </div>

            {playersShownList.length > 0 && 
            <>
              <div className="table-container">
                <Players
                  playersShownList={playersShownList} attributes={attributes} header={header} selectedToDelete={selectedToDelete} handleToggle={handleToggle} attributeChosen={attributeChosen} 
                />
              </div>
            </>
            }
          </div>
          {playersShownList.length > 0 &&
            <button className="delete-btn" onClick={() => deletePlayer(selectedToDelete)}>DELETE</button>
          }
        </main>
    </>
  )
}