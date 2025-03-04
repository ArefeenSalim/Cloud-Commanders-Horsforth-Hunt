// GetMap.js

// Define the function to fetch maps from the API
async function getMaps() {
  try {
    const response = await fetch('http://localhost:3000/maps'); // Replace with your actual API URL if needed
    if (!response.ok) {
      throw new Error('Failed to fetch maps');
    }

    // Parse the JSON response
    const data = await response.json();
    const maps = data.maps;

    // Display the map names and thumbnails
    if (maps && maps.length > 0) {
      maps.forEach(map => {
        console.log(`Map Name: ${map.mapName}`);
        console.log(`Map Thumbnail: ${map.mapThumb}`);
        console.log('---------------------------------');
      });
    } else {
      console.log('No maps available');
    }
  } catch (error) {
    console.error('Error fetching maps:', error);
  }
}

// Call the function to get maps when the script runs
getMaps();
