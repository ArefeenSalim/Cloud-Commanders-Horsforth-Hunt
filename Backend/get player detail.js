// Define a class to store player details
class PlayerDetail {
    constructor(playerId, playerName, role, colour, location, tickets_black, tickets_yellow, tickets_red, tickets_green, tickets_blue, tickets_2x) {
        this.playerId = playerId; // Unique identifier for the player
        this.playerName = playerName; // Name of the player
        this.role = role; // Role of the player in the game (e.g., detective, criminal)
        this.colour = colour; // The colour associated with the player
        this.location = location; // Current location of the player on the game board

        // Ticket counts for different modes of transport
        this.tickets_black = tickets_black; // Black ticket count
        this.tickets_yellow = tickets_yellow; // Yellow ticket count
        this.tickets_red = tickets_red; // Red ticket count
        this.tickets_green = tickets_green; // Green ticket count
        this.tickets_blue = tickets_blue; // Blue ticket count
        this.tickets_2x = tickets_2x; // Double move (2x) ticket count
    }
}

/**
 * Fetches player details from an API and returns a PlayerDetail object.
 * @param {number} playerId - The unique ID of the player.
 * @returns {Promise<PlayerDetail|null>} - A promise that resolves to a PlayerDetail object or null if an error occurs.
 */
function getPlayerDetails(playerId) {
    const url = `https://example.com/players/${playerId}`; // Replace with actual API endpoint

    // Fetch player data from the API
    return fetch(url)
        .then(response => {
            // Check if the response is successful (status code 200-299)
            if (!response.ok) {
                throw new Error(`Failed to retrieve player details. Status Code: ${response.status}`);
            }
            return response.json(); // Parse the response JSON data
        })
        .then(data => 
            // Create and return a new PlayerDetail object with the retrieved data
            new PlayerDetail(
                data.playerId,
                data.playerName,
                data.role,
                data.colour,
                data.location,
                data.black || 0, // Default to 0 if ticket value is undefined
                data.yellow || 0,
                data.red || 0,
                data.green || 0,
                data.blue || 0,
                data["2x"] || 0
            )
        )
        .catch(error => {
            // Handle errors and log them to the console
            console.error(error.message);
            return null; // Return null if an error occurs
        });
}

// Example usage
const playerId = 201;
getPlayerDetails(playerId).then(playerDetails => {
    if (playerDetails) {
        console.log(playerDetails); // Output player details to the console
    }
});
