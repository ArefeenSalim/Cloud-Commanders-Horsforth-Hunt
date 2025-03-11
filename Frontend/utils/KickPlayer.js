import AsyncStorage from '@react-native-async-storage/async-storage';
import { kickPlayerDetail } from './API Functions/DeletePlayer'
import { GetGameState } from './API Functions/CheckGameState';

// Function to check if the player should be kicked
export async function checkAndKickPlayer(targetPlayerId) {
    try {
        // Retrieve locally stored game and player IDs
        const localGameID = await AsyncStorage.getItem('localGameID');
        const localPlayerId = await AsyncStorage.getItem('localPlayerId');

        // If either value is missing, exit the function
        if (!localGameID || !localPlayerId) {
            console.log('No local game or player ID found.');
            return;
        }

        // Fetch the current game state from the server
        let gameState = await GetGameState(localGameID, localPlayerId);

        // Validate the game state response
        if (!gameState || !gameState.data.players || gameState.data.players.length === 0) {
            console.log('Invalid game state received.');
            return;
        }
        gameState = gameState.data;

        // Get the first player from the player list
        const firstPlayer = gameState.players[0];

        // Check if the local player ID matches the first player in the list
        if (String(firstPlayer.playerId) === localPlayerId) {
            console.log(`Kicking player: ${targetPlayerId}`);
            
            // Call the function to kick the player
            const response = await kickPlayerDetail(targetPlayerId);
            console.log(response);

            // Start polling to check if the player has been kicked
            pollForKick(localGameID, targetPlayerId);
        } else {
            console.log('You are not the first player. No kick executed.');
        }
    } catch (error) {
        console.error('Error in checkAndKickPlayer:', error);
    }
}

// Polling function to check if the player has been removed
async function pollForKick(gameId, playerId, retries = 10, interval = 3000) {
    let attempts = 0; // Track the number of attempts

    const poll = async () => {
        if (attempts >= retries) {
            console.log('Max polling attempts reached. Stopping.');
            return;
        }

        attempts++; // Increment the attempt count

        // Fetch the latest game state
        const gameState = await GetGameState(gameId);

        // Validate the game state response
        if (!gameState || !gameState.players) {
            console.log('Error retrieving game state during polling.');
            return;
        }

        // Check if the kicked player is still in the game
        const playerStillInGame = gameState.players.some(player => player.playerId === playerId);

        if (!playerStillInGame) {
            console.log('Player successfully kicked. Redirecting...');
            // Redirect to the index page (Replace with actual navigation logic)
            window.location.href = '/';
        } else {
            console.log('Player still in game. Retrying...');
            setTimeout(poll, interval); // Retry polling after the interval
        }
    };

    poll(); // Start polling
}

// Example Usage: Call the function to check and kick the player if applicable
// checkAndKickPlayer();

