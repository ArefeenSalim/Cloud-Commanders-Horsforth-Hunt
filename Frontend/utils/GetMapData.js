// Function needs a mapID to locate which map to reference to retrieve the details of it, then converts to an object to be used.
export function GetMapData(mapID) {

    var mapData = null;

    // Making our connection 
    const mapIDString = mapID.toString();
    const url = 'http://trinity-developments.co.uk/maps/' + mapIDString;

    // Using fetch API
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }
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
        mapData = data;
        // You can return the mapData here if you need to use it
        return mapData;
    })
    .catch(error => {
        console.error("Error:", error);
    });

    // If map data was successfully acquired, then it shall return said map data as an object, otherwise it shall return null after a period of time.
    setTimeout(function(){
        return mapData;
    }, 5000);
}
GetMapData(1);