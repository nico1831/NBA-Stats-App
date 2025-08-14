import '.././App.css'

export default function Players(props) { 

    return (
        <div className="scrollable-container">
            <table>

                {/* Table Header */}
                <tr>
                    {Object.entries(props.header).map(([display, attribute], index) => (
                        <th
                        key={index}
                        className={props.attributeChosen.toLowerCase() === attribute.toLowerCase() ? 'highlighted' : ''}
                        >
                        {display}
                        </th>
                    ))}
                </tr>

        
                {/* Table Rows */}
                {props.playersShownList.map((item, rowIndex) => (
                <tr key={rowIndex} className="grid-row">
                    <td>
                        <button
                            key={rowIndex}
                            className={`checkbox-button ${props.selectedToDelete.includes(rowIndex) ? 'checked' : ''}`}
                            onClick={() => props.handleToggle(rowIndex)}
                        ></button>
                    </td>
                    {props.attributes.map((attribute, colIndex) => (
                    <td 
                        key={colIndex} 
                        className={`grid-cell ${attribute=="playerName" ? 'player-name' : ''} ${props.attributeChosen === attribute ? 'highlighted' : ''}`}
                    >
                        {attribute === "Points" || attribute === "Assists" || attribute === "Steals" || attribute === "BlockedShots" || attribute === "Rebounds" 
                            ? (item[attribute] / item.Games).toFixed(2)
                            : item[attribute]} {/* Dynamically show the specified attribute */}

                    </td>
                    ))}
                </tr>
                ))}
            </table>
        </div>
    )
}