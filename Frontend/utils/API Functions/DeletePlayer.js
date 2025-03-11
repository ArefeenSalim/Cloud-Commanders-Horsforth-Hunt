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
    const url = `http://trinity-developments.co.uk/players/${playerId}`; // Replace with actual API URL
    
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
        console.error("Error kicking player:", error);
        return { success: false, error: error}
}
}
// Example Usage:
//kickPlayerDetail(588).then(console.log).catch(console.error);
