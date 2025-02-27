// Function needs a mapID to locate which map to reference to retrieve the details of it, then converts to an object to be used.

function GetMapData(mapID) {

    var mapData = null;

    // Creating Our XMLHttpRequest object 
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    let xhr = new XMLHttpRequest();

    // Making our connection 
    let mapIDString = mapID.toString();
    let url = 'http://trinity-developments.co.uk/games/' + mapIDString;
    //let url = baseUrl.concat("", mapIDString);
    xhr.open("GET", url, true);

    // Sending request 
    xhr.send();

    // function execute after request is successful 
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            mapData = JSON.parse(this.responseText);
            return mapData;
        }
    }

    // If map data was successfully acquired, then it shall return said map data as an object, otherwise it shall return null after a period of time.
    setTimeout(function(){
        mapData
        return mapData;
    }, 5000)
    
    /* 
        Response should have the following Attributes's
        mapID: Int
        mapName: String
        mapImage: String (Formatted like so: "/Horsforth.png")
        mapThumb: String (Formatted like so: "/Horsforth_small.png")
        mapWidth: Int
        mapHeight: Int
        locations: Nested Object - Within is 3 Attributes
            - Location: Int (starts @ 1)
            - xPos: Int
            - yPos: Int
        connections: Nested Object - WIthin is 3 Attributes
            - locationA: Int
            - locationB: Int
            - ticket: String (Yellow, Green, Red, Black)

        Example Response: 404 Not Found
        {
        "message": “Map with ID 123 not found”
        }
        
    */
    
}
GetMapData(0);