// Class representing the response for kicking a player
class KickPlayerResponse {
    constructor(message, gameId, playerId) {
        this.message = message;  // Message from the server response
        this.gameId = gameId;    // Game ID associated with the player
        this.playerId = playerId; // ID of the player who was kicked
    }

    // Method to convert the object into a readable string format
    toString() {
        return `KickPlayerResponse(message='${this.message}', gameId=${this.gameId}, playerId=${this.playerId})`;
    }
}

// Function to kick a player from the game using a DELETE request
function kickPlayerDetail(playerId, accessToken) {
    const url = `https://example.com/players/${playerId}`; // Replace with actual API URL

    return fetch(url, {
        method: 'DELETE', // HTTP DELETE method to remove the player
        headers: {
            'Authorization': `Bearer ${accessToken}`, // Authorization token
            'Content-Type': 'application/json' // Content type set to JSON
        }
    })
    .then(response => {
        if (!response.ok) { 
            // If the response is not OK (e.g., 404, 500), read error message
            return response.text().then(text => {
                throw new Error(`Error: ${response.status} - ${text}`);
            });
        }
        return response.json(); // Parse JSON response if successful
    })
    .then(data => new KickPlayerResponse(
        data.message || '', // Message from server response (fallback to empty string if missing)
        data.gameId || null, // Game ID from response (fallback to null if missing)
        data.playerId || null // Player ID from response (fallback to null if missing)
    ))
    .catch(error => error.message); // Catch and return any errors as a message string
}

// Example Usage:
kickPlayerDetail(201, "your_access_token_here").then(console.log);
