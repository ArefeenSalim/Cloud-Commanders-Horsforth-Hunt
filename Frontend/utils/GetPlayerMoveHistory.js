

/**
 * Fetches player details from an API and returns a Player object.
 * @param {number} playerId - The unique ID of the player.
 * @returns {Promise<Player|null>} - A promise that resolves to a Player object or null if an error occurs.
 */
export async function getPlayerDetail(playerId) {
    const url = `http://trinity-developments.co.uk/players/${playerId}/moves`; // Replace with actual API endpoint

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
        console.error("Error getting Game State:", error);
        throw error; // Re-throw so caller can handle it
    }
}

// Example usage:
const playerId = 107; // Example player ID
// getPlayerDetail(playerId).then(player => {
//     if (player) {
//         console.log(player.toString()); // Output player details to the console
//     }
// });
const moveHistoryData = await getPlayerDetail(playerId);
console.log(moveHistoryData);
console.log(moveHistoryData.startLocation);
console.log(moveHistoryData.moves);