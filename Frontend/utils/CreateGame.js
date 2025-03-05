// Function used to create a lobby for players to join onto.
export async function CreateGame(gameName, mapID, gameLength) {
        // Create Send Object & convert it to JSON
        const sendObj = {
            name: gameName,
            mapId: mapID,
            gameLength: gameLength
        };
        const sendJSON = JSON.stringify(sendObj);

        // Making our connection using fetch
        const url = 'http://trinity-developments.co.uk/games/';

        try {//throw new Error("This is a dummy error.");
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: sendJSON,
            });
    
            // Ensure we return and handle the response properly
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
    
            //For Testing response body
    
    
            return { success: true, data };
        } catch (error) {
            console.error("Error making game:", error);
            return { success: false, error: error}
        }
    }

    /*
        Response should have the following Attributes:
        message: String ("Game Created")
        gameId: Int 
        name: String
        mapId: Int
        state: String (open, fugitive, detective, over)

        Example Response: 404 Not Found
        {
            "message": "Map with ID 123 not found"
        }
    */

await CreateGame("Cloud Commanders Test Success", 1, "Short")
    .then((result) => {
        if (result.success) {
            console.log('JSON Data:', result.data);
            const returnData = result.data;
            console.log(returnData);
        } else {
            console.error('Error:', result.error)
        }
    });




