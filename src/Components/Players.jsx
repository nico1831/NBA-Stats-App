export default function Players(props) { {/*syntax: note how props always has to be a parameter of the function when used*/}
    {/*
    - calls props.playerList (again, props just takes value from parent file and uses it in child component)
    - maps through the ingredients array making them all appear as lists like in html
    - for more info on mapping, just search it up*/}
    const playerListItems = props.playersShownList.map(player => (
        <>
            <p>{player.playerName}</p>
            <p>{player.position}</p>
            <p>{player.age}</p>
        </>
    ))
    return (
        <section>
            {playerListItems} {/*placing the list items in the variable ingredientsListItems into this unordered list*/}
        </section>
    )
}

/*
points
assists
steals 
blocks
totalRb
fieldPercent * 100
threePercent * 100
*/