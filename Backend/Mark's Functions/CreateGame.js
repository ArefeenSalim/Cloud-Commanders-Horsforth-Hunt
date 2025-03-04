// Function used to create a lobby for players to join onto.

function CreateGame(gameName, mapID, gameLength) {

    // Creating variable for the response body
    var responseData = null

    // Creating Our XMLHttpRequest object 
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    let xhr = new XMLHttpRequest();

    // Create Send Object & convert it to Json
    const sendObj = new Object();
    sendObj.name = gameName;
    sendObj.mapId = mapID;
    sendObj.gameLength = gameLength;
    const sendJSON = JSON.stringify(sendObj);

    // Making our connection 
    let url = 'http://trinity-developments.co.uk/games/';
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
        message: String ("Game Created")
        gameId: Int 
        name: String
        mapId: Int
        state: String (open, fugitive, detective, over)

        Example Response: 404 Not Found
        {
        "message": “Map with ID 123 not found”
        }
    */
    
}
CreateGame("Demo", 1, "short");