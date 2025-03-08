import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDecay,
  clamp
} from 'react-native-reanimated';
import { GetMapData } from '../../utils/API Functions/GetMapData';
import { GetGameState } from '../../utils/API Functions/CheckGameState';
import { getItem, setItem } from '../../utils/AsyncStorage';
import { getPlayerDetails } from '../../utils/API Functions/GetPlayerDetail';

const { width, height } = Dimensions.get('window');
const colorMapping = {
  yellow: 'yellow',
  green: 'green',
  red: 'red',
  black: 'black',
  x2: '#ff6347' // or any other color for x2
};

const MapViewer = () => {
  const [mapData, setMapData] = useState(null);
  const [playerLocations, setPlayerLocations] = useState([]);
  const [playerInfo, setPlayerInfo] = useState([]);
  const [tickets, setTickets] = useState([]);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const mapID = 801;

  //Arefeen's Components Start
  const [ticketsModalVisible, setTicketsModalVisible] = useState(false);
  const [drXModalVisible, setDrXModalVisible] = useState(false);
  
  const handlePress1 = () => {
    setDrXModalVisible(true); // Show Dr X modal
  };

  const handlePress2 = () => {
    setTicketsModalVisible(true); // Show Tickets modal at bottom
    filterTickets();
  };

  const handleColorButtonPress = (color) => {
    console.log(`${color} button pressed`);
    setTicketsModalVisible(false); // Close the tickets modal
  };

  //Arefeen Components End
  
  const saveLocation = async(locationID) => {
    alert(`Location ${locationID} Pressed`)
    await setItem('localLocationChoice', locationID)
    console.log(await getItem('localLocationChoice'))
  }

  // const getPlayerDetails = async() => {
  //   const gameId = await getItem('localGameID')
  //   try {
  //     const result = await GetGameState(gameId);
  //     if (result.success) {
  //       gameData(result.data);
  //     } else {
  //       console.error('Error:', result.error);
  //       return
  //     }
  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //     return
  //   }  
  //   if (await getItem('LocalPlayerID') == gameData.players[0])  {

  //   }
  //   for (let i = 1; i < Object.keys(gameData.players); i++) {

  //   }
  // }

  // Example buttons (x, y positions are relative to the map)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetMapData(mapID);
        if (result.success) {
          setMapData(result.data);
        } else {
          console.error('Error:', result.error);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []);

  // Polling function to get and update player location data on map.
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const result = await GetMapData(mapID);
        if (result.success) {
          const gameState = await GetGameState(await getItem('localGameID'))
         // Update first player's location if needed
         if (gameState.data.players[0].playerId === await getItem('localPlayerId')) {
          const externalPlayerLocation = await getPlayerDetails(gameState.data.players[0].playerId);
          gameState.data.players[0].location = externalPlayerLocation.location;
        }

        // Create a new array with updated player positions
        const updatedPlayers = gameState.data.players.map((player, i) => {
          if (i === 0) return player; // Skip player 0
          const locationIndex = player.location - 1;
          return {
            ...player, // Copy existing player data
            xPos: result.data.locations[locationIndex]?.xPos ?? 0,
            yPos: result.data.locations[locationIndex]?.yPos ?? 0,
          };
        });

        console.log("Player Position Fetch Completed");
        console.log("Player Positions:", updatedPlayers);
        setPlayerLocations(updatedPlayers);
        } else {
          console.error('Error:', result.error);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }, 5000);

    return () => clearInterval(intervalId)
  }, []);

  // Function to check user's player data (e.g. tickets, role)
  const getPlayerData = async () => {
    try {
      await setItem('localPlayerId', 155) // Here for testing purposes
      const result = await getPlayerDetails(await getItem('localPlayerId'));
      if (result) {
        return result;
      } else {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  const filterTickets = async () => {
    console.log("Before get Player Data")
    const playerData = await getPlayerData();  // Get player data asynchronously
    console.log("Post PlayerData")
    console.log(playerData);
    const hideTickets = ["Detective"].includes(playerData.role);  // Check if the role is "Detective"
    console.log("Post hideTickets")
    const ticketKeys = ['yellow', 'green', 'red', 'black', 'x2'];

    const filteredData = Object.fromEntries(
      Object.entries(playerData)
        .filter(([key, value]) => ticketKeys.includes(key)) // Only include tickets with a count greater than 0
    );

    if (hideTickets) {
      // Convert playerData to an array, filter out "black" and "x2" keys, and return the new object
      const filtereredTickets = Object.entries(filteredData)
        .filter(([key, value]) => !["black", "x2"].includes(key))
        .reduce((acc, [key, value]) => {
          acc[key] = value;  // Rebuild the object
          return acc;
        }, {});
        console.log("Before filteredData")
      setTickets(filtereredTickets)
    }
    console.log(filteredData);
    setTickets(filteredData);  // Return original playerData if role is not "Detective"
  }

  let mapWidth = 0;
  let mapHeight = 0;
   if (mapData !== null) {
    mapWidth = mapData.mapWidth;
    mapHeight = mapData.mapHeight;
  }

  // Calculate boundaries for panning
  let minX = -mapWidth //+ SCREEN_WIDTH; // Left boundary
  let minY = -mapHeight //+ SCREEN_HEIGHT; // Top boundary
  let maxX = mapWidth; // Right boundary
  let maxY = mapHeight; // Bottom boundary

  // Pinch (Zoom) Gesture
  const pinchGesture = Gesture.Pinch().onUpdate((event) => {
    scale.value = event.scale;

    // Dynamically update the boundaries when zooming in or out
    const newWidth = mapWidth * scale.value;
    const newHeight = mapHeight * scale.value;

    minX = -newWidth;
    minY = -newHeight;
    maxX = newWidth;
    maxY = newHeight;
  });

  // Pan (Drag) Gesture with boundaries
  const panGesture = Gesture.Pan()
    .onStart(() => {
      prevTranslationX.value = translateX.value;
      prevTranslationY.value = translateY.value;
    })
    .onUpdate((event) => {
      // Restrict translation within boundaries
    const newTranslationX = prevTranslationX.value + event.translationX;
    const newTranslationY = prevTranslationY.value + event.translationY;

    // Dynamically update boundaries based on the current map scale
    const newWidth = mapWidth * scale.value;
    const newHeight = mapHeight * scale.value;

    const dynamicMinX = -newWidth;
    const dynamicMinY = -newHeight;
    const dynamicMaxX = newWidth;
    const dynamicMaxY = newHeight;

    // Restrict translation within boundaries
    translateX.value = clamp(newTranslationX, dynamicMinX, dynamicMaxY);
    translateY.value = clamp(newTranslationY, dynamicMinY, dynamicMaxX);
    })
    .onEnd((event) => {
      // Smooth decay for natural movement
      translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: [minX, maxX],
      });
      translateY.value = withDecay({
        velocity: event.velocityY,
        clamp: [minY, maxY],
      });
    });

  // Combine gestures
  const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  // Apply transformations
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

    // Check if mapData is still loading
    if (mapData === null) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    }


  // const buttons = [
  //   { id: 1, x: 100, y: 200, label: 'A' },
  //   { id: 2, x: 250, y: 350, label: 'B' },
  // ];

  return (
    <GestureHandlerRootView>
    <View style={styles.container}>
    { /* Arefeen's Component Code */ }

        <View style={styles.overlayComponent}>
          {/* Dr X Button (Left Side) */}
          <View style={styles.leftButtonContainer}>
            <TouchableOpacity style={styles.drXButton} onPress={handlePress1}>
              <Text style={styles.overlayButtonText}>Dr X</Text>
            </TouchableOpacity>
          </View>
    
          {/* Tickets Button (Bottom Center) */}
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity style={styles.ticketsButton} onPress={handlePress2}>
              <Text style={styles.overlayButtonText}>Tickets</Text>
            </TouchableOpacity>
          </View>
    
          {/* Dr X Modal (Grey Pop-up) */}
          <Modal
            transparent={true}
            visible={drXModalVisible}
            animationType="slide"
            onRequestClose={() => setDrXModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.drXModalContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setDrXModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Dr X Movements</Text>
              </View>
            </View>
          </Modal>
    
          {/* Tickets Modal (Bottom Pop-up with 3 buttons) */}
          <Modal
            transparent={true}
            visible={ticketsModalVisible}
            animationType="slide"
            onRequestClose={() => setTicketsModalVisible(false)}
          >
            <View style={styles.bottomModalContainer}>
              <View style={styles.ticketsModal}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setTicketsModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Choose a ticket</Text>
                <View style={styles.buttonRow}>

                  {Object.entries(tickets).map(([ticketType, count]) => (
                    <TouchableOpacity
                      style={[styles.colorButton, { backgroundColor: colorMapping[ticketType] || 'gray' }]}
                      key={ticketType}  // Ensure each button has a unique key
                      onPress={() => handleColorButtonPress(ticketType)}  // Handle button press
                    >
                      <Text style={styles.overlayButtonText}>{ticketType}</Text>
                      <Text style={styles.overlayButtonText}>{count}</Text>
                    </TouchableOpacity>
                  ))}
                  {/*
                  <TouchableOpacity
                    style={[styles.colorButton, { backgroundColor: '#CDDBE7' }]}
                    onPress={() => handleColorButtonPress('Blue')}
                  >
                    <Text style={styles.overlayButtonText}>Blue</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.colorButton, { backgroundColor: '#FF474C' }]}
                    onPress={() => handleColorButtonPress('Red')}
                  >
                    <Text style={styles.overlayButtonText}>Red</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.colorButton, { backgroundColor: '#ADF802' }]}
                    onPress={() => handleColorButtonPress('Green')}
                  >
                    <Text style={styles.overlayButtonText}>Green</Text>
                  </TouchableOpacity>
                  */}
                  
                </View>
              </View>
            </View>
          </Modal>
        </View>

    {/* Mark's Map Code */}
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={[styles.mapContainer, animatedStyle, {position: 'absolute'}]}>
            {/* Map Locations */}
              <Image
                source={{ uri: mapData.mapImage }}
                style={{
                  width: mapData.mapWidth,
                  height: mapData.mapHeight,
                }}
                resizeMode="contain"
              />

          {/* Map Locations */}
          {mapData.locations.map((loc) => (
            <TouchableOpacity
              key={loc.location}
              style={[
                styles.button,
                {
                  left: loc.xPos,
                  top: loc.yPos,
                },
              ]}
              onPress={() => saveLocation(loc.location)}
            >
              <Text style={styles.buttonText}>{loc.location}</Text>
            </TouchableOpacity>
          ))}

          {/* Player Tokens */}
          <View style={{ position: "absolute", left: 0, top: 0 }}>
            {playerLocations
            .filter((loc) => loc.location !== "Hidden")
            .map((loc) => (
              <View 
              key={loc.location}
              style={[
                styles.circle,
                {
                  left: loc.xPos,
                  top: loc.yPos,        
                },
              ]}
              />
            ))}

          </View>
        </Animated.View>
      </GestureDetector>
    </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    position: 'relative',
  },
  button: {
    position: 'absolute',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    width: 40,
    height: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "blue",
  },
  overlayComponent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between', 
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 10,  // Ensures it stays above other elements
    pointerEvents: 'box-none',  // Allows touch events to pass through where needed
  },
  overlayButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  drXButton: {
    backgroundColor: '#ff7f7f', 
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 100,
    alignItems: 'center',
  },
  ticketsButton: {
    backgroundColor: '#add8e6', 
    borderRadius: 10,
    marginVertical: 10,
    height: 50,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButtonContainer: {
    position: 'absolute',
    left: 10,
    top: height * 0.5,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: width / 2 - 50,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drXModalContainer: {
    backgroundColor: 'grey', 
    padding: 20,
    borderRadius: 10,
    width: 200,
    height: 600,
    alignItems: 'center',
    position: 'relative', 
  },
  bottomModalContainer: {
    flex: 1,
    justifyContent: 'flex-end', 
  },
  ticketsModal: {
    backgroundColor: '#ff7f7f', 
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'black',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    width: '100%',
  },
  colorButton: {
    padding: 15,
    borderRadius: 10,
    width: 80, 
    height: 80, 
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default MapViewer;