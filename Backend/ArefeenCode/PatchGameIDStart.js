// PatchGameIDStart.js

const express = require('express');
const router = express.Router();

// Example in-memory store for games
let games = [
  {
    gameId: 101,
    state: 'lobby',
    players: [
      { playerID: 1, role: 'fugitive' },
      { playerID: 2, role: 'detective' },
      { playerID: 3, role: 'detective' }
    ]
  },
  // Other game data
];

// Helper function to check if game has enough players
function hasEnoughPlayers(game) {
  const fugitives = game.players.filter(player => player.role === 'fugitive');
  const detectives = game.players.filter(player => player.role === 'detective');
  return fugitives.length >= 1 && detectives.length >= 2;
}

// Route for starting the game
router.patch('/games/:gameId/start/:playerID', (req, res) => {
  const { gameId, playerID } = req.params;
  const game = games.find(game => game.gameId == gameId);
  
  // Check if game exists
  if (!game) {
    return res.status(404).json({
      message: `Game with ID ${gameId} not found`
    });
  }

  // Check if the game is in a valid state to start
  if (game.state !== 'lobby') {
    return res.status(400).json({
      message: `Game with ID ${gameId} does not have an open lobby`
    });
  }

  // Check if there are enough players to start
  if (!hasEnoughPlayers(game)) {
    return res.status(400).json({
      message: `Game with ID ${gameId} does not have enough players to start`
    });
  }

  // Check if player is in the game
  const playerInGame = game.players.some(player => player.playerID == playerID);
  if (!playerInGame) {
    return res.status(403).json({
      message: `You are not authorised to start the Game with ID ${gameId}`
    });
  }

  // Change game state to "fugitive" and start the game
  game.state = 'fugitive';

  res.status(200).json({
    message: "Lobby closed, Game started",
    gameId: game.gameId,
    state: game.state
  });
});

module.exports = router;


