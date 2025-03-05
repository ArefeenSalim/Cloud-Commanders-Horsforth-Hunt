// GetGame.js

// Define the Base URL for your API
const BASE_URL = 'http://trinity-developments.co.uk'; // Your actual API URL

// Function to fetch the list of open games
export const getOpenGames = async () => {
  try {
    // Make the GET request to the '/games' endpoint using fetch
    const response = await fetch(`${BASE_URL}/games`);
    
    // Check if the response was successful (status code 200)
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Parse the JSON data from the response
    const data = await response.json();

    // Log the full response data to the console
    console.log('Full response data:', data);

    // Extract the games data from the response
    const games = data.games;

    // Filter the games to only include those with 'open' status
    const openGames = games.filter(game => game.status === 'open');

    // If there are open games, display them
    if (openGames.length > 0) {
      openGames.forEach(game => {
        console.log(`Game Name: ${game.gameName}`);
        console.log(`Map: ${game.mapName}`);
        console.log(`Map Thumbnail: ${game.mapThumb}`);
        console.log('Players:');
        game.players.forEach(player => {
          console.log(`- ${player.playerName}`);
        });
        console.log('----------------------------');
      });
      return JSON.parse(data);
    } else {
      console.log('No open games found.');
    }

  } catch (error) {
    console.error('Error fetching open games:', error);
  }
};

// Call the function to get and display open games
getOpenGames();
