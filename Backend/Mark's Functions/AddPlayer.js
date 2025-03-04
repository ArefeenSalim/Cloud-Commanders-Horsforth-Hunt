// Function for adding a player to a game

function AddPlayer(playerName, gameID) {

    // Creating variable for the response body
    var responseData = null

    // Creating Our XMLHttpRequest object 
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    let xhr = new XMLHttpRequest();

    // Create Send Object, convert it to Json & Prep Reuqest
    const sendObj = new Object();
    sendObj.playerName = playerName;
    const sendJSON = JSON.stringify(sendObj);

    // Making our connection 
    gameIDString = gameID.toString();
    let url = 'http://trinity-developments.co.uk/games/' + gameIDString + '/players';
    xhr.open("POST", url, true);

    // Sending request 
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(sendJSON);

    // function execute after request is successful 
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            responseData = JSON.parse(this.responseText);
            return responseData;
        }
        else {
            console.log("Loading");
        }
    }

    // If map data was successfully acquired, then it shall return said map data as an object, otherwise it shall return null after a period of time.
    setTimeout(function(){
        return responseData;
    }, 5000)

    /*
        Response should have the following Attributes's
        message: String ("Player added to game")
        gameId: Int 
        playerId: Int (Needs to be saved Client-side)
        playerName: String
        role: String (fugitive, detective)
        colour: String (clear)
        startLocation: int

        Example Response: 404 Not Found
        {
        "message": “Game with ID 9 not found”
        }
        Example Response: 400 Bad Request
        {
        "message": “The lobby for Game with ID 9 is closed. No new players can join.”
        }
        Example Response: 400 Bad Request
        {
        "message": “The lobby for Game with ID 9 is full. No new players can join.”
        }
        Example Response: 404 Not Found
        {
        "message": “No available starting locations found for Game with ID 9 and role
        Fugitive}”
        }
    */
    
}
AddPlayer("Mark", 0);