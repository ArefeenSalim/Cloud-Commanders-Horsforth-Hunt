class PlayerDetail {
    constructor(playerId, playerName, role, colour, location, tickets_black, tickets_yellow, tickets_red, tickets_green, tickets_blue, tickets_2x) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.role = role;
        this.colour = colour;
        this.location = location;
        this.tickets_black = tickets_black;
        this.tickets_yellow = tickets_yellow;
        this.tickets_red = tickets_red;
        this.tickets_green = tickets_green;
        this.tickets_blue = tickets_blue;
        this.tickets_2x = tickets_2x;
    }
}

async function getPlayerDetails(playerId) {
    const url = `https://example.com/players/${playerId}`; // Replace with actual API endpoint
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to retrieve player details. Status Code: ${response.status}`);
        }
        
        const data = await response.json();
        
        return new PlayerDetail(
            data.playerId,
            data.playerName,
            data.role,
            data.colour,
            data.location,
            data.black || 0,
            data.yellow || 0,
            data.red || 0,
            data.green || 0,
            data.blue || 0,
            data["2x"] || 0
        );
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Example usage
(async () => {
    const playerId = 201;
    const playerDetails = await getPlayerDetails(playerId);
    if (playerDetails) {
        console.log(playerDetails);
    }
})();
