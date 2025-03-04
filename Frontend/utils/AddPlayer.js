export async function AddPlayer(playerName, gameID) {
    // Create Send Object & convert it to JSON
    const sendObj = { playerName: playerName };
    const sendJSON = JSON.stringify(sendObj);

    // Construct the URL
    const gameIDString = gameID.toString();
    const url = `http://trinity-developments.co.uk/games/${gameIDString}/players`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: sendJSON,
        });

        // Ensure we return and handle the response properly
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding player:", error);
        throw error; // Re-throw so caller can handle it
    }

    /*
    Response should have the following Attributes's
    message: String ("Player added to game")
    gameId: Int 
    playerId: Int (Needs to be saved Client-side)
    playerName: String
    role: String (fugitive, detective)
    colour: String (clear)
    startLocation: int

    Example Response: 404 Not Found
    {
    "message": “Game with ID 9 not found”
    }
    Example Response: 400 Bad Request
    {
    "message": “The lobby for Game with ID 9 is closed. No new players can join.”
    }
    Example Response: 400 Bad Request
    {
    "message": “The lobby for Game with ID 9 is full. No new players can join.”
    }
    Example Response: 404 Not Found
    {
    "message": “No available starting locations found for Game with ID 9 and role
    Fugitive}”
    }
    */
}

// Example call - For some reason the request body is sent twice, dunno why, but it'll create two players but only get one of the player's data back

AddPlayerPromise("JonathanDoe", 55)
    .then(response => console.log(response))
    .catch(error => console.error(error));
input = input+1
console.log(input)



