class KickPlayerResponse {
    constructor(message, gameId, playerId) {
        this.message = message;
        this.gameId = gameId;
        this.playerId = playerId;
    }

    toString() {
        return `KickPlayerResponse(message='${this.message}', gameId=${this.gameId}, playerId=${this.playerId})`;
    }
}

export async function kickPlayerDetail(playerId) {
    const url = `https://example.com/players/${playerId}`; // Replace with actual API URL
    
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            throw new Error(`Error: ${response.status} - ${await response.text()}`);
        }
    } catch (error) {
        console.error("Error making game:", error);
        return { success: false, error: error}
}
}
// Example Usage:
// kickPlayerDetail(201, "your_access_token_here").then(console.log).catch(console.error);
