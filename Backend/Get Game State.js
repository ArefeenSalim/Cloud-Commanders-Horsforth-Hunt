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

// Example usage: Creating a mock response class
class MockResponse {
    /**
     * Mocks a server response containing JSON data about the game state.
     * 
     * @return {Object} - The mock game state data.
     */
    json() {
        return {
            gameId: 101, // Unique identifier for the game
            mapId: 1, // Identifier for the game map
            state: "detective", // Current game state
            winner: "none", // Indicates if there's a winner
            round: 5, // Current round number
            length: 24, // Total number of rounds in the game
            players: [ // Array of players in the game
                {
                    playerId: 201,
                    playerName: "Dr Nick",
                    colour: "Clear",
                    Location: "3"
                },
                {
                    playerId: 204,
                    playerName: "ADSA",
                    colour: "Red",
                    Location: "60"
                }
            ]
        };
    }
}

// Mocking a server response for demonstration:
const mockResponse = new MockResponse(); // Create an instance of the mock response
const gameState = checkGameState(mockResponse); // Call the function with the mock response

console.log("\nReturned Game State Object:", gameState); // Log the returned game state object
