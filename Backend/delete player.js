gclass KickPlayerResponse {
    constructor(message, gameId, playerId) {
        this.message = message;
        this.gameId = gameId;
        this.playerId = playerId;
    }

    toString() {
        return `KickPlayerResponse(message='${this.message}', gameId=${this.gameId}, playerId=${this.playerId})`;
    }
}

async function kickPlayerDetail(playerId, accessToken) {
    const url = `https://example.com/players/${playerId}`; // Replace with actual API URL
    
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return new KickPlayerResponse(
                data.message || '',
                data.gameId || null,
                data.playerId || null
            );
        } else {
            throw new Error(`Error: ${response.status} - ${await response.text()}`);
        }
    } catch (error) {
        return error.message;
    }
}

// Example Usage:
// kickPlayerDetail(201, "your_access_token_here").then(console.log).catch(console.error);
