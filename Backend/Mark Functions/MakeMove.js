// Function used to create a lobby for players to join onto.

function MakeMove(playerID, gameID, ticket, destination) {

    // Creating variable for the response body
    var responseData = null

    // Creating Our XMLHttpRequest object 
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    let xhr = new XMLHttpRequest();

    // Create Send Object & convert it to Json
    const sendObj = new Object();
    sendObj.gameID = gameID;
    sendObj.ticket = ticket;
    sendObj.destination = destination;
    const sendJSON = JSON.stringify(sendObj);

    // Making our connection 
    let playerIDString = playerID.toString();
    let url = 'http://trinity-developments.co.uk/players/' + playerIDString + '/moves/';
    xhr.open("POST", url, true);

    // Sending request 
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // xhr.setRequestHeader('Authorization', accessToken);
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
        message: String ("Move Successful")
        gameId: Int 
        playerId: Int
        moveId: Int
        location: Int

        Example Response: 404 Not Found
        {
        "message": “Player with ID 212 not found.”
        }
        Example Response: 404 Not Found
        {
        "message": “Game for Player with ID 212 not found.”
        }
        Example Response: 404 Not Found
        {
        "message": “Map for Game for Player with ID 212 not found.”
        }
        Example Response: 400 Bad Request (should a player who has been removed from the game try to move)
        {
        "message": “Player with ID 212 is not active in the game.”
        }
        Example Response: 400 Bad Request (should a player try to make a move before the game has started)
        {
        "message": “Game for Player with ID 212 has not started.”
        }
        Example Response: 400 Bad Request (Should a player attempt to make a move after the game has ended)
        {
        "message": “Game for Player with ID 212 is over.”
        }
        Example Response: 400 Bad Request (Should a player attempt to move when it is not their turn)
        {
        "message": “It is not the Player with ID 212’s turn.”
        }
        Example Response: 400 Bad Request (should a player attempt to move with a ticket string which does not match any
        of the valid ticket types yellow, green, red, black, x2)
        {
        "message": “string is not a valid type of ticket.”
        }
        Example Response: 400 Bad Request (should a player attempt to move with a ticket they do not possess)
        {
        "message": “The Player with ID 212 does not have a Red ticket.”
        }
        Example Response: 400 Bad Request (should a player attempt to play a second x2 ticket during a turn)
        {
        "message": “The Player with ID 212 cannot play more than one X2 ticket in a
        turn.”
        }
        Example Response: 400 Bad Request (should a player attempt to move to a location which is not connected by the
        chosen means of transport on the map)
        {
        "message": “The Player with ID 212 cannot move to location 69 with a Green
        ticket.”
        }
        Example Response: 400 Bad Request (should a player attempt to move to a location which is already occupied by a
        detective)
        {
        "message": “The Player with ID 212 cannot move to location 69 as it is occupied
        by a
    */
    
}
MakeMove("Demo", 1, "short");