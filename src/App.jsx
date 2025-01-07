import { useState } from 'react'
import './App.css'
import Players from "./Components/Players.jsx"

export default function App() {
  const [inputValue, setInputValue] = useState("Stephen Curry")
  const [year, setYear] = useState("2013")
  const [playerPicked, setPlayerPicked] = useState("")
  const [playerList, setPlayerList] = useState([])
  const [index, setIndex] = useState()

  // aPI used: https://documenter.getpostman.com/view/24232555/2s93shzpR3#view-the-new-and-updated-rest-api-here
  // under "GET NEW Player Search"
  const handleShow = (event) => { 
    event.preventDefault() // Prevent the form from submitting and refreshing the page
    fetch(`http://b8c40s8.143.198.70.30.sslip.io/api/PlayerDataAdvanced/name/${inputValue}`)
      // ^ this is the API call copy-pasted... the $ and {} indicate that these values change depending on the player inputted
      .then((res) => res.json()) // get the results under the variable name "res" and turn it into a json object
      .then((result) => { // the actual object that we can work with
        for(let i=0; i<result.length; i++){
          if(result[i].season == year){ // using == only checks the value, with type coercion... unlike Strict Equality (===): Ensures both the value and type are the same.
            setPlayerPicked(result[i])
            setPlayerList(prev => [...prev, result[i]])
            break
          }
        }
      })
  }

  return (
    <>
      <main>
        <form onSubmit={handleShow}> 
          <input
            type="text"
            value={inputValue} // Controlled input (React state controls the value...This means that the value of the input field is controlled by React state, rather than the DOM.... always just include this ... no need to really know what it does)
            onChange={(e) => 
              setInputValue(e.target.value)
            } // Update state of inputValue whenever input changes (note difference of onSubmit (when button is submitted) and onChange (if anything changes in input box))
            placeholder="Enter player"
            name="player"
          />
          <input
            type="text"
            value={year} // Controlled input (React state controls the value...This means that the value of the input field is controlled by React state, rather than the DOM.... always just include this ... no need to really know what it does)
            onChange={(e) => 
              setYear(e.target.value)
            } // Update state of inputValue whenever input changes (note difference of onSubmit (when button is submitted) and onChange (if anything changes in input box))
            placeholder="Enter year"
            name="year"
          />
          <button type="submit">Submit</button>
        </form>

        {playerList.length > 0 && 
            <Players
              playerList={playerList} 
            />
        }
        </main>
    </>
  )
}