export default function Players(props) { {/*syntax: note how props always has to be a parameter of the function when used*/}
    {/*
    - calls props.ingredients (again, props just takes value from parent file and uses it in child component)
    - maps through the ingredients array making them all appear as lists like in html
    - for more info on mapping, jsut search it up*/}
    const playerListItems = props.playerList.map(player => (
        <li key={player.season}>{player.season}</li>
    ))
    return (
        <section>
            <ul>{playerListItems}</ul> {/*placing the list items in the variable ingredientsListItems into this unordered list*/}
        </section>
    )
}