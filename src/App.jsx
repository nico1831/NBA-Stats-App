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
  const [header, setHeader] = useState(["select", "name", "season", "team", "position", "points", "assists", "steals", "blocks", "rebounds", "fg%", "3-pt%"])
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
                setPlayersShownList(prev =>
                  data2 && data2.PlayerID && data2.Season // Check if player exists and has required properties
                    ? prev.some(player =>
                        player.PlayerID === data2.PlayerID &&
                        player.Season === data2.Season
                      )
                      ? prev
                      : [...prev, data2]
                    : prev // If data2 is invalid, don't add anything
                );
            });

          }
        });
      })
      .catch(error => {
        console.error("Error fetching players:", error);
      });
  };



  const handleRanking = (event) => {
    event.preventDefault() // Prevent the form from submitting and refreshing the page
    setRankIsClicked(true)
    setAttributeChosen(event.target.value)
    setPlayersShownList(prev => [...prev].sort((a, b) => 
      ["Points", "Assists", "Steals", "BlockedShots", "Rebounds"].includes(event.target.value)
        ? (b[event.target.value] / b.Games - a[event.target.value] / a.Games) // Sort by the chosen attribute directly
        : (b[event.target.value] - (a[event.target.value]))
    ))};

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
            <form onSubmit={choosePlayerAndSeason} className="input-row">
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