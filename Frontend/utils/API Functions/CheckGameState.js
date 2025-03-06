function checkGameState(response) {
    /**
     * Parses the JSON response from the server and returns the game state.
     *
     * @param {Response} response - The server response object.
     * @return {Object|null} - The parsed game data or null if parsing fails.
     */
    try {
        const gameData = response.json(); // Convert JSON string to an object

        // Print key information about the game state
        console.log(`Game ID: ${gameData.gameId}`); // Displays the game ID
        console.log(`State: ${gameData.state}`); // Displays the current game state
        console.log(`Winner: ${gameData.winner}`); // Displays the winner (if any)
        console.log(`Round: ${gameData.round} / ${gameData.length}`); // Displays the current round and total rounds

        // Print details about each player in the game
        console.log("\nPlayers:");
        gameData.players.forEach(player => {
            console.log(`- ${player.playerName} (${player.colour}): ${player.Location}`); // Displays player info
        });

        return gameData; // Return the parsed game data
    } catch (error) {
        // Handle JSON parsing errors
        console.error("Failed to parse game state:", error);
        return null;
    }
}

export async function GetGameState(gameID) {
    
        // Construct the URL
        const gameIDString = gameID.toString();
        const url = `http://trinity-developments.co.uk/games/${gameIDString}`;
    
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
    
            // Ensure we return and handle the response properly
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();    
            console.log("Before Return Success");
            return { success: true, data };
        } catch (error) {
            console.error("Error getting game state:", error);
            return { success: false, error: error}
        }
}

// Testing API Function
// const gameState = await GetGameState(51); // Call the function with the mock response

// console.log("\nReturned Game State Object:", gameState); // Log the returned game state object

// console.log(gameState.gameId);
// console.log(gameState.players[0].playerName);