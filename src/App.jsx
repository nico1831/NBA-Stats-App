// !!!!!!!!!!! click this link eahc time before testing !!!!!!!!!!: https://cors-anywhere.herokuapp.com/corsdemo

import { useState } from 'react'
import './App.css'
import Players from "./Components/Players.jsx"

export default function App() {

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  const dropdownAttributesList = ["Points", "Assists", "Steals", "Blocks", "Rebounds", "FieldGoalsPercentage", "ThreePointersPercentage"]

  const [playerChosen, setPlayerChosen] = useState("")
  const [seasonChosen, setSeasonChosen] = useState("")
  const [playersShownList, setPlayersShownList] = useState([])
  const [attributes, setAttributes] = useState(["Name", "Season", "Team", "Position", "Points", "Assists", "Steals", "BlockedShots", "Rebounds", "FieldGoalsPercentage", "ThreePointersPercentage"])
  const [header, setHeader] = useState(["name", "season", "team", "position", "points", "assists", "steals", "blocks", "rebounds", "fg%", "3-pt%"])
  const [rankIsClicked, setRankIsClicked] = useState(false)
  const [attributeChosen, setAttributeChosen] = useState("")


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
    setPlayersShownList(prev => [...prev].sort((a, b) => (b[event.target.value] / b.Games) - (a[event.target.value] / a.Games))); // ask chatgpt how this works ((1) prev and (2) how the sorting works)    
  };


  const [selectedToDelete, setSelectedToDelete] = useState([]); // State to track selected buttons
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
          
          <div className="not-header">
            <h3 className="instructions">choose a player, specify a season, and rank by stat</h3>
            <div className="input-row">
              <form onSubmit={choosePlayerAndSeason}>
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
                  placeholder="Enter season (e.g. 2020)"
                  name="season"
                />

                <button type="submit" className="red">CHOOSE</button>
              </form>
            </div>
            
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
                            {attribute}
                            </option>
                        ))}
                    </select>
                </div>
              }

              {playersShownList.length > 0 &&
                <button onClick={() => deletePlayer(selectedToDelete)}>DELETE</button>
              }
            </div>

            {playersShownList.length > 0 && 
            <>
              <div className="checkbox-and-grid">
                <div className="checkbox-buttons-container">
                  {playersShownList.map((player, index) => (
                    <button
                      key={index}
                      className={`checkbox-button ${selectedToDelete.includes(index) ? 'checked' : ''}`}
                      onClick={() => handleToggle(index)}
                    ></button>
                  ))}
                </div>
                <Players
                  playersShownList={playersShownList} attributes={attributes} header={header}
                />
              </div>
            </>
            }
          </div>
        </main>
    </>
  )
}

// [
//   {
//     "id": 4884, <--------- this unique ID is different for every player and every season
//     "playerName": "Kobe Bryant*",
//     "position": "SF",
//     "age": 37,
//     "games": 66,
//     "gamesStarted": 66,
//     "minutesPg": 1863,
//     "fieldGoals": 398,
//     "fieldAttempts": 1113,
//     "fieldPercent": 0.358,
//     "threeFg": 133,
//     "threeAttempts": 467,
//     "threePercent": 0.285,
//     "twoFg": 265,
//     "twoAttempts": 646,
//     "twoPercent": 0.41,
//     "effectFgPercent": 0.417,
//     "ft": 232,
//     "ftAttempts": 281,
//     "ftPercent": 0.826,
//     "offensiveRb": 41,
//     "defensiveRb": 206,
//     "totalRb": 247,
//     "assists": 184,
//     "steals": 62,
//     "blocks": 13,
//     "turnovers": 129,
//     "personalFouls": 115,
//     "points": 1161,
//     "team": "LAL",
//     "season": 2016,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 5472,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 36,
//     "games": 35,
//     "gamesStarted": 35,
//     "minutesPg": 1207,
//     "fieldGoals": 266,
//     "fieldAttempts": 713,
//     "fieldPercent": 0.373,
//     "threeFg": 54,
//     "threeAttempts": 184,
//     "threePercent": 0.293,
//     "twoFg": 212,
//     "twoAttempts": 529,
//     "twoPercent": 0.401,
//     "effectFgPercent": 0.411,
//     "ft": 196,
//     "ftAttempts": 241,
//     "ftPercent": 0.813,
//     "offensiveRb": 26,
//     "defensiveRb": 173,
//     "totalRb": 199,
//     "assists": 197,
//     "steals": 47,
//     "blocks": 7,
//     "turnovers": 128,
//     "personalFouls": 65,
//     "points": 782,
//     "team": "LAL",
//     "season": 2015,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 6139,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 35,
//     "games": 6,
//     "gamesStarted": 6,
//     "minutesPg": 177,
//     "fieldGoals": 31,
//     "fieldAttempts": 73,
//     "fieldPercent": 0.425,
//     "threeFg": 3,
//     "threeAttempts": 16,
//     "threePercent": 0.188,
//     "twoFg": 28,
//     "twoAttempts": 57,
//     "twoPercent": 0.491,
//     "effectFgPercent": 0.445,
//     "ft": 18,
//     "ftAttempts": 21,
//     "ftPercent": 0.857,
//     "offensiveRb": 2,
//     "defensiveRb": 24,
//     "totalRb": 26,
//     "assists": 38,
//     "steals": 7,
//     "blocks": 1,
//     "turnovers": 34,
//     "personalFouls": 9,
//     "points": 83,
//     "team": "LAL",
//     "season": 2014,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 6733,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 34,
//     "games": 78,
//     "gamesStarted": 78,
//     "minutesPg": 3013,
//     "fieldGoals": 738,
//     "fieldAttempts": 1595,
//     "fieldPercent": 0.463,
//     "threeFg": 132,
//     "threeAttempts": 407,
//     "threePercent": 0.324,
//     "twoFg": 606,
//     "twoAttempts": 1188,
//     "twoPercent": 0.51,
//     "effectFgPercent": 0.504,
//     "ft": 525,
//     "ftAttempts": 626,
//     "ftPercent": 0.839,
//     "offensiveRb": 66,
//     "defensiveRb": 367,
//     "totalRb": 433,
//     "assists": 469,
//     "steals": 106,
//     "blocks": 25,
//     "turnovers": 287,
//     "personalFouls": 173,
//     "points": 2133,
//     "team": "LAL",
//     "season": 2013,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 7297,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 33,
//     "games": 58,
//     "gamesStarted": 58,
//     "minutesPg": 2232,
//     "fieldGoals": 574,
//     "fieldAttempts": 1336,
//     "fieldPercent": 0.43,
//     "threeFg": 87,
//     "threeAttempts": 287,
//     "threePercent": 0.303,
//     "twoFg": 487,
//     "twoAttempts": 1049,
//     "twoPercent": 0.464,
//     "effectFgPercent": 0.462,
//     "ft": 381,
//     "ftAttempts": 451,
//     "ftPercent": 0.845,
//     "offensiveRb": 66,
//     "defensiveRb": 247,
//     "totalRb": 313,
//     "assists": 264,
//     "steals": 69,
//     "blocks": 18,
//     "turnovers": 204,
//     "personalFouls": 105,
//     "points": 1616,
//     "team": "LAL",
//     "season": 2012,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 7878,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 32,
//     "games": 82,
//     "gamesStarted": 82,
//     "minutesPg": 2779,
//     "fieldGoals": 740,
//     "fieldAttempts": 1639,
//     "fieldPercent": 0.451,
//     "threeFg": 115,
//     "threeAttempts": 356,
//     "threePercent": 0.323,
//     "twoFg": 625,
//     "twoAttempts": 1283,
//     "twoPercent": 0.487,
//     "effectFgPercent": 0.487,
//     "ft": 483,
//     "ftAttempts": 583,
//     "ftPercent": 0.828,
//     "offensiveRb": 83,
//     "defensiveRb": 336,
//     "totalRb": 419,
//     "assists": 388,
//     "steals": 99,
//     "blocks": 12,
//     "turnovers": 243,
//     "personalFouls": 172,
//     "points": 2078,
//     "team": "LAL",
//     "season": 2011,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 8488,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 31,
//     "games": 73,
//     "gamesStarted": 73,
//     "minutesPg": 2835,
//     "fieldGoals": 716,
//     "fieldAttempts": 1569,
//     "fieldPercent": 0.456,
//     "threeFg": 99,
//     "threeAttempts": 301,
//     "threePercent": 0.329,
//     "twoFg": 617,
//     "twoAttempts": 1268,
//     "twoPercent": 0.487,
//     "effectFgPercent": 0.488,
//     "ft": 439,
//     "ftAttempts": 541,
//     "ftPercent": 0.811,
//     "offensiveRb": 78,
//     "defensiveRb": 313,
//     "totalRb": 391,
//     "assists": 365,
//     "steals": 113,
//     "blocks": 20,
//     "turnovers": 233,
//     "personalFouls": 187,
//     "points": 1970,
//     "team": "LAL",
//     "season": 2010,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 9071,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 30,
//     "games": 82,
//     "gamesStarted": 82,
//     "minutesPg": 2960,
//     "fieldGoals": 800,
//     "fieldAttempts": 1712,
//     "fieldPercent": 0.467,
//     "threeFg": 118,
//     "threeAttempts": 336,
//     "threePercent": 0.351,
//     "twoFg": 682,
//     "twoAttempts": 1376,
//     "twoPercent": 0.496,
//     "effectFgPercent": 0.502,
//     "ft": 483,
//     "ftAttempts": 564,
//     "ftPercent": 0.856,
//     "offensiveRb": 90,
//     "defensiveRb": 339,
//     "totalRb": 429,
//     "assists": 399,
//     "steals": 120,
//     "blocks": 37,
//     "turnovers": 210,
//     "personalFouls": 189,
//     "points": 2201,
//     "team": "LAL",
//     "season": 2009,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 9646,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 29,
//     "games": 82,
//     "gamesStarted": 82,
//     "minutesPg": 3192,
//     "fieldGoals": 775,
//     "fieldAttempts": 1690,
//     "fieldPercent": 0.459,
//     "threeFg": 150,
//     "threeAttempts": 415,
//     "threePercent": 0.361,
//     "twoFg": 625,
//     "twoAttempts": 1275,
//     "twoPercent": 0.49,
//     "effectFgPercent": 0.503,
//     "ft": 623,
//     "ftAttempts": 742,
//     "ftPercent": 0.84,
//     "offensiveRb": 94,
//     "defensiveRb": 423,
//     "totalRb": 517,
//     "assists": 441,
//     "steals": 151,
//     "blocks": 40,
//     "turnovers": 257,
//     "personalFouls": 227,
//     "points": 2323,
//     "team": "LAL",
//     "season": 2008,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 10228,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 28,
//     "games": 77,
//     "gamesStarted": 77,
//     "minutesPg": 3140,
//     "fieldGoals": 813,
//     "fieldAttempts": 1757,
//     "fieldPercent": 0.463,
//     "threeFg": 137,
//     "threeAttempts": 398,
//     "threePercent": 0.344,
//     "twoFg": 676,
//     "twoAttempts": 1359,
//     "twoPercent": 0.497,
//     "effectFgPercent": 0.502,
//     "ft": 667,
//     "ftAttempts": 768,
//     "ftPercent": 0.868,
//     "offensiveRb": 75,
//     "defensiveRb": 364,
//     "totalRb": 439,
//     "assists": 413,
//     "steals": 111,
//     "blocks": 36,
//     "turnovers": 255,
//     "personalFouls": 205,
//     "points": 2430,
//     "team": "LAL",
//     "season": 2007,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 10755,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 27,
//     "games": 80,
//     "gamesStarted": 80,
//     "minutesPg": 3277,
//     "fieldGoals": 978,
//     "fieldAttempts": 2173,
//     "fieldPercent": 0.45,
//     "threeFg": 180,
//     "threeAttempts": 518,
//     "threePercent": 0.347,
//     "twoFg": 798,
//     "twoAttempts": 1655,
//     "twoPercent": 0.482,
//     "effectFgPercent": 0.491,
//     "ft": 696,
//     "ftAttempts": 819,
//     "ftPercent": 0.85,
//     "offensiveRb": 71,
//     "defensiveRb": 354,
//     "totalRb": 425,
//     "assists": 360,
//     "steals": 147,
//     "blocks": 30,
//     "turnovers": 250,
//     "personalFouls": 233,
//     "points": 2832,
//     "team": "LAL",
//     "season": 2006,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 11321,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 26,
//     "games": 66,
//     "gamesStarted": 66,
//     "minutesPg": 2689,
//     "fieldGoals": 573,
//     "fieldAttempts": 1324,
//     "fieldPercent": 0.433,
//     "threeFg": 131,
//     "threeAttempts": 387,
//     "threePercent": 0.339,
//     "twoFg": 442,
//     "twoAttempts": 937,
//     "twoPercent": 0.472,
//     "effectFgPercent": 0.482,
//     "ft": 542,
//     "ftAttempts": 664,
//     "ftPercent": 0.816,
//     "offensiveRb": 95,
//     "defensiveRb": 297,
//     "totalRb": 392,
//     "assists": 398,
//     "steals": 86,
//     "blocks": 53,
//     "turnovers": 270,
//     "personalFouls": 174,
//     "points": 1819,
//     "team": "LAL",
//     "season": 2005,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 11909,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 25,
//     "games": 65,
//     "gamesStarted": 64,
//     "minutesPg": 2447,
//     "fieldGoals": 516,
//     "fieldAttempts": 1178,
//     "fieldPercent": 0.438,
//     "threeFg": 71,
//     "threeAttempts": 217,
//     "threePercent": 0.327,
//     "twoFg": 445,
//     "twoAttempts": 961,
//     "twoPercent": 0.463,
//     "effectFgPercent": 0.468,
//     "ft": 454,
//     "ftAttempts": 533,
//     "ftPercent": 0.852,
//     "offensiveRb": 103,
//     "defensiveRb": 256,
//     "totalRb": 359,
//     "assists": 330,
//     "steals": 112,
//     "blocks": 28,
//     "turnovers": 171,
//     "personalFouls": 176,
//     "points": 1557,
//     "team": "LAL",
//     "season": 2004,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 12472,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 24,
//     "games": 82,
//     "gamesStarted": 82,
//     "minutesPg": 3401,
//     "fieldGoals": 868,
//     "fieldAttempts": 1924,
//     "fieldPercent": 0.451,
//     "threeFg": 124,
//     "threeAttempts": 324,
//     "threePercent": 0.383,
//     "twoFg": 744,
//     "twoAttempts": 1600,
//     "twoPercent": 0.465,
//     "effectFgPercent": 0.483,
//     "ft": 601,
//     "ftAttempts": 713,
//     "ftPercent": 0.843,
//     "offensiveRb": 106,
//     "defensiveRb": 458,
//     "totalRb": 564,
//     "assists": 481,
//     "steals": 181,
//     "blocks": 67,
//     "turnovers": 288,
//     "personalFouls": 218,
//     "points": 2461,
//     "team": "LAL",
//     "season": 2003,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 12964,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 23,
//     "games": 80,
//     "gamesStarted": 80,
//     "minutesPg": 3063,
//     "fieldGoals": 749,
//     "fieldAttempts": 1597,
//     "fieldPercent": 0.469,
//     "threeFg": 33,
//     "threeAttempts": 132,
//     "threePercent": 0.25,
//     "twoFg": 716,
//     "twoAttempts": 1465,
//     "twoPercent": 0.489,
//     "effectFgPercent": 0.479,
//     "ft": 488,
//     "ftAttempts": 589,
//     "ftPercent": 0.829,
//     "offensiveRb": 112,
//     "defensiveRb": 329,
//     "totalRb": 441,
//     "assists": 438,
//     "steals": 118,
//     "blocks": 35,
//     "turnovers": 223,
//     "personalFouls": 228,
//     "points": 2019,
//     "team": "LAL",
//     "season": 2002,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 13452,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 22,
//     "games": 68,
//     "gamesStarted": 68,
//     "minutesPg": 2783,
//     "fieldGoals": 701,
//     "fieldAttempts": 1510,
//     "fieldPercent": 0.464,
//     "threeFg": 61,
//     "threeAttempts": 200,
//     "threePercent": 0.305,
//     "twoFg": 640,
//     "twoAttempts": 1310,
//     "twoPercent": 0.489,
//     "effectFgPercent": 0.484,
//     "ft": 475,
//     "ftAttempts": 557,
//     "ftPercent": 0.853,
//     "offensiveRb": 104,
//     "defensiveRb": 295,
//     "totalRb": 399,
//     "assists": 338,
//     "steals": 114,
//     "blocks": 43,
//     "turnovers": 220,
//     "personalFouls": 222,
//     "points": 1938,
//     "team": "LAL",
//     "season": 2001,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 13995,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 21,
//     "games": 66,
//     "gamesStarted": 62,
//     "minutesPg": 2524,
//     "fieldGoals": 554,
//     "fieldAttempts": 1183,
//     "fieldPercent": 0.468,
//     "threeFg": 46,
//     "threeAttempts": 144,
//     "threePercent": 0.319,
//     "twoFg": 508,
//     "twoAttempts": 1039,
//     "twoPercent": 0.489,
//     "effectFgPercent": 0.488,
//     "ft": 331,
//     "ftAttempts": 403,
//     "ftPercent": 0.821,
//     "offensiveRb": 108,
//     "defensiveRb": 308,
//     "totalRb": 416,
//     "assists": 323,
//     "steals": 106,
//     "blocks": 62,
//     "turnovers": 182,
//     "personalFouls": 220,
//     "points": 1485,
//     "team": "LAL",
//     "season": 2000,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 14483,
//     "playerName": "Kobe Bryant*",
//     "position": "SG",
//     "age": 20,
//     "games": 50,
//     "gamesStarted": 50,
//     "minutesPg": 1896,
//     "fieldGoals": 362,
//     "fieldAttempts": 779,
//     "fieldPercent": 0.465,
//     "threeFg": 27,
//     "threeAttempts": 101,
//     "threePercent": 0.267,
//     "twoFg": 335,
//     "twoAttempts": 678,
//     "twoPercent": 0.494,
//     "effectFgPercent": 0.482,
//     "ft": 245,
//     "ftAttempts": 292,
//     "ftPercent": 0.839,
//     "offensiveRb": 53,
//     "defensiveRb": 211,
//     "totalRb": 264,
//     "assists": 190,
//     "steals": 72,
//     "blocks": 50,
//     "turnovers": 157,
//     "personalFouls": 153,
//     "points": 996,
//     "team": "LAL",
//     "season": 1999,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 14996,
//     "playerName": "Kobe Bryant*",
//     "position": "SF",
//     "age": 19,
//     "games": 79,
//     "gamesStarted": 1,
//     "minutesPg": 2056,
//     "fieldGoals": 391,
//     "fieldAttempts": 913,
//     "fieldPercent": 0.428,
//     "threeFg": 75,
//     "threeAttempts": 220,
//     "threePercent": 0.341,
//     "twoFg": 316,
//     "twoAttempts": 693,
//     "twoPercent": 0.456,
//     "effectFgPercent": 0.469,
//     "ft": 363,
//     "ftAttempts": 457,
//     "ftPercent": 0.794,
//     "offensiveRb": 79,
//     "defensiveRb": 163,
//     "totalRb": 242,
//     "assists": 199,
//     "steals": 74,
//     "blocks": 40,
//     "turnovers": 157,
//     "personalFouls": 180,
//     "points": 1220,
//     "team": "LAL",
//     "season": 1998,
//     "playerId": "bryanko01"
//   },
//   {
//     "id": 15539,
//     "playerName": "Kobe Bryant*",
//     "position": "SF",
//     "age": 18,
//     "games": 71,
//     "gamesStarted": 6,
//     "minutesPg": 1103,
//     "fieldGoals": 176,
//     "fieldAttempts": 422,
//     "fieldPercent": 0.417,
//     "threeFg": 51,
//     "threeAttempts": 136,
//     "threePercent": 0.375,
//     "twoFg": 125,
//     "twoAttempts": 286,
//     "twoPercent": 0.437,
//     "effectFgPercent": 0.477,
//     "ft": 136,
//     "ftAttempts": 166,
//     "ftPercent": 0.819,
//     "offensiveRb": 47,
//     "defensiveRb": 85,
//     "totalRb": 132,
//     "assists": 91,
//     "steals": 49,
//     "blocks": 23,
//     "turnovers": 112,
//     "personalFouls": 102,
//     "points": 539,
//     "team": "LAL",
//     "season": 1997,
//     "playerId": "bryanko01"
//   }
// ]