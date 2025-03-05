// Function needs a mapID to locate which map to reference to retrieve the details of it, then converts to an object to be used.
export async function GetMapData(mapID) {

    // Making our connection 
    const mapIDString = mapID.toString();
    const url = 'http://trinity-developments.co.uk/maps/' + mapIDString;

    // Using fetch API
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        // Ensure we return and handle the response properly
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        //For Testing response body


        return { success: true, data };
    } catch (error) {
        console.error("Error adding game:", error);
        return { success: false, error: error}
    }
}

// Test Call
await GetMapData(1)
.then((result) => {
    if (result.success) {
        console.log('JSON Data:', result.data);
        const returnData = result.data;
        console.log(returnData);
    } else {
        console.error('Error:', result.error)
    }
});