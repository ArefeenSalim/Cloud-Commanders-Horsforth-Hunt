export const StartGame = async (gameId, playerId) => {
  const url = `http://trinity-developments.co.uk/games/${gameId}/start/${playerId}`;
  
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
        method: 'PATCH',
        headers: headers
    });

    // Ensure we return and handle the response properly
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();    
    return { success: true, data };
} catch (error) {
    console.error("Error adding game:", error);
    return { success: false, error: error}
}
};

// Example usage:
const gameId = '181';  // Replace with actual game ID
const playerId = '466';  // Replace with the player ID trying to start the game
// const token = 'yourAccessToken';  // Replace with actual access token

StartGame(gameId, playerId);
