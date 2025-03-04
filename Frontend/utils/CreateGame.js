// Function used to create a lobby for players to join onto.
export function CreateGame(gameName, mapID, gameLength) {
    return new Promise((resolve, reject) => {
        // Create Send Object & convert it to JSON
        const sendObj = {
            name: gameName,
            mapId: mapID,
            gameLength: gameLength
        };
        const sendJSON = JSON.stringify(sendObj);

        // Making our connection using fetch
        const url = 'http://trinity-developments.co.uk/games/';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: sendJSON,
        })
        .then((response) => response.json())
        .then((responseData) => {
            console.log(responseData);
            resolve(responseData);
        })
        .catch((error) => {
            console.error('Error:', error);
            reject(error);
        });
    });

    /*
        Response should have the following Attributes:
        message: String ("Game Created")
        gameId: Int 
        name: String
        mapId: Int
        state: String (open, fugitive, detective, over)

        Example Response: 404 Not Found
        {
            "message": "Map with ID 123 not found"
        }
    */
}
//CreateGame("Cloud Commanders Test AddPlayer 3", 1, "Short");





