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
        console.log(`Game ID: ${gameData.gameId}`);
        console.log(`State: ${gameData.state}`);
        console.log(`Winner: ${gameData.winner}`);
        console.log(`Round: ${gameData.round} / ${gameData.length}`);

        // Print details about each player in the game
        console.log("\nPlayers:");
        gameData.players.forEach(player => {
            console.log(`- ${player.playerName} (${player.colour}): ${player.Location}`);
        });

        return gameData;
    } catch (error) {
        console.error("Failed to parse game state:", error);
        return null;
    }
}

// Example usage
class MockResponse {
    json() {
        return {
            gameId: 101,
            mapId: 1,
            state: "detective",
            winner: "none",
            round: 5,
            length: 24,
            players: [
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
const mockResponse = new MockResponse();
const gameState = checkGameState(mockResponse);

console.log("\nReturned Game State Object:", gameState);
