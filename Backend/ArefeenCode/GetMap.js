// Define the base URL for the API. You can change this URL as needed.
const baseUrl = "http://trinity-developments.co.uk"; // Change this if needed

// Asynchronous function to fetch map data
async function getMaps() {
  try {
    // Send a GET request to the /maps endpoint
    const response = await fetch(`${baseUrl}/maps`);
    
    // Check if the response is successful (status code 200-299)
    if (!response.ok) {
      throw new Error('Failed to fetch maps');
    }

    // Parse the JSON response and store it in 'data'
    const data = await response.json();

    // Log the fetched data to the console (can be replaced with logic to display it on the UI)
    console.log("Maps Data:", data);

  } catch (error) {
    // If any error occurs during the fetch, log the error message
    console.error('Error fetching maps:', error);
  }
}

// Call the getMaps function to fetch and display the map data
getMaps();
