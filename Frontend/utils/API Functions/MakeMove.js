export async function MakeMove(playerID, gameID, ticket, destination) {
    const sendObj = { gameID: gameID, ticket: ticket, destination: destination };
    console.log(sendObj);

    const sendJSON = JSON.stringify(sendObj);
    console.log(sendJSON);

    const url = `http://trinity-developments.co.uk/players/${playerID}/moves`;
    console.log(url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: sendJSON
        });

        console.log("Raw response:", response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            return { success: true, data };
        } else {
            throw new Error("Invalid response format");
        }
    } catch (error) {
        console.error("Error making move:", error);
        return { success: false, error };
    }
}