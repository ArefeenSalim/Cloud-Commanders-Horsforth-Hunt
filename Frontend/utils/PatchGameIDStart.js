const startGame = async (gameId, playerId) => {
  const url = `http://trinity-developments.co.uk/games/${gameId}/start/${playerId}`;
  
  const headers = {
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
      return data.json;
    } else {
      throw new Error(data.message || 'Something went wrong');
    }
  } catch (error) {
    console.error('Error starting game:', error);
  }
};

// Example usage:
const gameId = '40';  // Replace with actual game ID
const playerId = '82';  // Replace with the player ID trying to start the game
// const token = 'yourAccessToken';  // Replace with actual access token

startGame(gameId, playerId);
