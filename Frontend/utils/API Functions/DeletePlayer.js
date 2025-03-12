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
    const url = `http://trinity-developments.co.uk/players/${playerId}`;
    
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("Post Fetch");
        if (!response.ok) {
            console.log("Throwing error")
            throw new Error(`Error: ${response.status} - ${await response.text()}`);
        }
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Error kicking player:", error.message);
        return { success: false, error: error.message}
    }
}
// Example Usage:
//kickPlayerDetail(588).then(console.log).catch(console.error);
