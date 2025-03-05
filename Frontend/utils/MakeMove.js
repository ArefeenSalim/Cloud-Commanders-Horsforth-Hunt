// Function used to create a lobby for players to join onto.
export async function MakeMove(playerID, gameID, ticket, destination) {

    // Creating variable for the response body
    var responseData = null;

    // Create Send Object & convert it to Json
    const sendObj = { gameID, ticket, destination };
    const sendJSON = JSON.stringify(sendObj);

    // Making our connection 
    const playerIDString = playerID.toString();
    const url = 'http://trinity-developments.co.uk/players/' + playerIDString + '/moves/';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: sendJSON
        });

        // Ensure we return and handle the response properly
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();    
        return { success: true, data };
    } catch (error) {
        console.error("Error adding game:", error);
        return { success: false, error: error}
}
}
