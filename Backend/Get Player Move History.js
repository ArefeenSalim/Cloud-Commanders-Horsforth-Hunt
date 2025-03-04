// Class representing a move made by a player
class Move {
    constructor(moveId, roundNum, ticket, destination) {
        this.moveId = moveId; // Unique identifier for the move
        this.round = roundNum; // Round number in which the move was made
        this.ticket = ticket; // Type of ticket used for the move (e.g., yellow, red)
        this.destination = destination; // Destination location of the move
    }

    // Returns a string representation of the Move object
    toString() {
        return `Move(moveId=${this.moveId}, round=${this.round}, ticket='${this.ticket}', destination=${this.destination})`;
    }
}

// Class representing a player and their move history
class Player {
    constructor(playerId, startLocation, moves) {
        this.playerId = playerId; // Unique identifier for the player
        this.startLocation = startLocation; // Player's starting location on the board

        // Convert the raw move data into Move objects for better structure
        this.moves = moves.map(move => new Move(move.moveId, move.round, move.ticket, move.destination));
    }

    // Returns a string representation of the Player object
    toString() {
        return `Player(playerId=${this.playerId}, startLocation=${this.startLocation}, moves=${this.moves.map(move => move.toString()).join(', ')})`;
    }
}

/**
 * Fetches player details from an API and returns a Player object.
 * @param {number} playerId - The unique ID of the player.
 * @returns {Promise<Player|null>} - A promise that resolves to a Player object or null if an error occurs.
 */
function getPlayerDetail(playerId) {
    const url = `https://example.com/players/${playerId}`; // Replace with actual API endpoint

    return fetch(url)
        .then(response => {
            // Check if the response is successful (status code 200-299)
            if (!response.ok) {
                throw new Error(`Failed to retrieve player details. Status Code: ${response.status}`);
            }
            return response.json(); // Parse the response JSON data
        })
        .then(data => 
            // Create and return a new Player object using the fetched data
            new Player(data.playerId, data.startLocation, data.moves)
        )
        .catch(error => {
            // Log any errors that occur during the API call
            console.error(error.message);
            return null; // Return null if an error occurs
        });
}

// Example usage:
const playerId = 201; // Example player ID
getPlayerDetail(playerId).then(player => {
    if (player) {
        console.log(player.toString()); // Output player details to the console
    }
});
