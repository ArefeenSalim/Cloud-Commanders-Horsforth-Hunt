// GetGame.js

const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://your-api-url.com'; // Replace with your actual API URL

// Function to fetch the list of games with open lobbies
const fetchGames = async () => {
  try {
    // Make the GET request to the '/games' endpoint
    const response = await axios.get(`${BASE_URL}/games`);
    
    // Extract the games data from the response
    const games = response.data.games;

    // Filter out the open games and display their information
    const openGames = games.filter(game => game.status === 'open');
    
    openGames.forEach(game => {
      console.log(`Game Name: ${game.gameName}`);
      console.log(`Map: ${game.mapName}`);
      console.log(`Map Thumb: ${game.mapThumb}`);
      console.log('Players:');
      game.players.forEach(player => {
        console.log(`- ${player.playerName}`);
      });
      console.log('----------------------------------');
    });

  } catch (error) {
    console.error('Error fetching games:', error);
  }
};

// Call the fetchGames function to display the open lobbies
fetchGames();
