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
export async function getPlayerDetails(playerId) {
        
        // Construct the URL
        const playerIDString = playerId.toString();
        const url = `http://trinity-developments.co.uk/players/${playerIDString}`;
    
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
            return data;
        } catch (error) {
            console.error("Error getting Player Dtails:", error);
            throw error; // Re-throw so caller can handle it
        }

}

// Example usage
const playerId = 107;
const playerDetails = await getPlayerDetails(playerId);

console.log(playerDetails,  '\n' + playerDetails.role);

