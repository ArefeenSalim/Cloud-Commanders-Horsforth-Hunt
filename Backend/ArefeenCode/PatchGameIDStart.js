const fetch = require('node-fetch');  // You may need to install node-fetch if you haven't

const startGame = async (gameId, playerId, token) => {
  const url = `http://trinity-developments.co.uk/games/${gameId}/start/${playerId}`;
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: headers,
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Game Started:', data.message);
      console.log('Game ID:', data.gameId);
      console.log('Game State:', data.state);
    } else {
      throw new Error(data.message || 'Something went wrong');
    }
  } catch (error) {
    console.error('Error starting game:', error);
  }
};

// Example usage:
const gameId = 'yourGameId';  // Replace with actual game ID
const playerId = 'yourPlayerId';  // Replace with the player ID trying to start the game
const token = 'yourAccessToken';  // Replace with actual access token

startGame(gameId, playerId, token);
