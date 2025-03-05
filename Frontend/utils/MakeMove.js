// Function used to create a lobby for players to join onto.
export function MakeMove(playerID, gameID, ticket, destination) {

    // Creating variable for the response body
    var responseData = null;

    // Create Send Object & convert it to Json
    const sendObj = { gameID, ticket, destination };
    const sendJSON = JSON.stringify(sendObj);

    // Making our connection 
    const playerIDString = playerID.toString();
    const url = 'http://trinity-developments.co.uk/players/' + playerIDString + '/moves/';

    // Using fetch API
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: sendJSON
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(err => Promise.reject(err));
        }
    })
    .then(data => {
        console.log(data);
        responseData = data;
        return responseData;
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
