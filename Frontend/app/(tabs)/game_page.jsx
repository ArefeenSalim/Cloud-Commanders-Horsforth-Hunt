// game_page.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Modal, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { GetMapData } from '../../utils/API Functions/GetMapData';
import { GetGameState } from '../../utils/API Functions/CheckGameState';
import { getItem } from '../../utils/AsyncStorage';
import { getPlayerDetails } from '../../utils/API Functions/GetPlayerDetail';
import { GetPlayerMoveHistory } from '../../utils/API Functions/GetPlayerMoveHistory';
import { MakeMove } from '../../utils/API Functions/MakeMove';
import { checkAndKickPlayer } from '../../utils/KickPlayer';
import Grid from './grid';

const { width, height } = Dimensions.get('window');
const colourMapping = {
  yellow: 'yellow',
  green: 'green',
  red: 'red',
  black: 'black',
  x2: '#ff6347'
};
const textColourMapping = {
  yellow: 'black',
  green: 'black',
  red: 'black',
  black: 'white',
  x2: 'black'
};

const MapViewer = () => {
  const [mapData, setMapData] = useState(null);
  const [playerLocations, setPlayerLocations] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [boxesData, setBoxesData] = useState([]);
  const [chosenTicket, setChosenTicket] = useState(null);
  const [localLocation, setlocalLocation] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [gameLength, setGameLength] = useState(null);
  const [mapID, setMapID] = useState(null);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });

  //Arefeen's Modal Components
  const [ticketsModalVisible, setTicketsModalVisible] = useState(false);
  const [drXModalVisible, setDrXModalVisible] = useState(false);

  // Return to Index Function
  const goBack = async () => {
    await clear()
    router.navigate('/')
  }

  // Function for processing the kick request
  const handleKick = async (targetPlayerId, playerName) => {
    // Confirm wish to kick
    Alert.alert(
      `Kick Player ${playerName}`,
      'Are you sure you want to kick?',
      [
        {
          text: 'Yes',
          onPress: await checkAndKickPlayer(targetPlayerId),
          style: 'destructive'
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    )
  };

  const handlePress1 = () => {
    setDrXModalVisible(true); // Show Dr X modal
    fetchDrXMoveHis();
  };

  const handlePress2 = () => {
    setTicketsModalVisible(true); // Show Tickets modal at bottom
    filterTickets();
  };

  // Saves the ticket pressed on the ticket overlay to the page to be passed as parameters later when making a move.
  const handleTicketButtonPress = (ticket) => {
    console.log(`${ticket} button pressed`);
    setChosenTicket(ticket);
    setTicketsModalVisible(false); // Close the tickets modal
  };

  // This function is used to activate a ticket and travel to the passed location
  const activateTicket = async (locationID) => {
    console.log("Location Pressed: ", locationID)
    if (chosenTicket != null && locationID != null) {
      let playerID;
      let gameID
      try {
        playerID = await getItem('localPlayerId')
        gameID = await getItem('localGameID')
      } catch (error) {
        console.log("Error in retrieving local data");
        return
      }
      try {
        const makeMoveReturnBody = await MakeMove(playerID, gameID, chosenTicket, locationID)
        if (makeMoveReturnBody.success) {
          const makeMoveData = makeMoveReturnBody.data
          setChosenTicket(null);
          setlocalLocation(locationID);
          Alert.alert(makeMoveData.message)
        }
        else {
          console.log("Something has gone wrong with MakeMove ", makeMoveReturnBody.error)
          return;
        }
      } catch (error) {
        console.log("Error has occured: ", error)
      }
    }
  }

  // Function for drawing the locations/nodes on the map
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (mapID) {
        const result = await GetMapData(mapID);
        console.log("Result: ", result);
        if (result.success && Array.isArray(result.data.locations)) {
          const mapOffsets  = {
            600: { x: -40, y: -40 },
            903: { x: -40, y: -40 },
            default: { x: 0, y: 0 },
          };

          const offset = mapOffsets[result.data.mapId] || mapOffsets.default;

          const updatedLocations = {
            ...result,
            data: {
                ...result.data,
                locations: result.data.locations.map((location) => ({
                    ...location,
                    xPos: (location?.xPos ?? 0) + offset.x,
                    yPos: (location?.yPos ?? 0) + offset.y,
                })),
            }
          }
          setMapData(updatedLocations.data);
        } else {
          console.error('Error:', result.error);
        }
      } else {
        console.log("Waiting for mapID to update")
      }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, [mapID]);

  // Polling function to get and update player location data on map.
  // Has been expanded to check the current game state and update that info
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const gameState = await GetGameState(await getItem('localGameID'))
        if (gameState.success) {
          

          const gameLengthString = gameState.data.round + " / " + gameState.data.length
          setGameLength(gameLengthString)

          setMapID(gameState.data.mapId);
          

          const currentTurn = gameState.data.state
          if (currentTurn === "Over") {
            const gameOver = currentTurn + '\n' + 'Winner: ' + gameState.data.winner;
            setCurrentTurn(gameOver);
          } else {
            setCurrentTurn(currentTurn);
          }
          const fugativeID = gameState.data.players[0].playerId
          // Update fugative location if needed
          if (fugativeID === await getItem('localPlayerId')) {
            console.log("Inside Fugative ID check")
            const fugativeMoveHistory = await GetPlayerMoveHistory(fugativeID);
            if (!fugativeMoveHistory.data.moves || fugativeMoveHistory.data.moves.length === 0) {
              gameState.data.players[0].location = fugativeMoveHistory.data.startLocation;
            } else {
              console.log("Local location: ", localLocation);
              gameState.data.players[0].location = localLocation;

            }
          }

          const defaultOffset = {x: 0, y:-40}


          // Maps the offset onto the player object so they can be positioned onto the map relative to the location
          const updatedPlayers = gameState.data.players.map((player, i) => {
            const offset = defaultOffset;

            return {
              ...player, // Copy existing player data
              xPos: offset.x,
              yPos: offset.y,
            };
          });

          setPlayerLocations(updatedPlayers);
        } else {
          console.error('Error:', result.error);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }, 5000);

    return () => clearInterval(intervalId)
  }, [localLocation]);

  // Function to check user's player data (e.g. tickets, role)
  const getPlayerData = async () => {
    try {
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

  // Function for dynamically loading tickets based on whether the player is detective or fugitive
  const filterTickets = async () => {
    const playerData = await getPlayerData();  // Get player data asynchronously
    const hideTickets = ["Detective"].includes(playerData.role);  // Check if the role is "Detective"
    const ticketKeys = ['yellow', 'green', 'red', 'black', 'x2'];

    const filteredData = Object.fromEntries(
      Object.entries(playerData)
        .filter(([key, value]) => ticketKeys.includes(key)) // Only include tickets with a count greater than 0
    );

    if (hideTickets) {
      // Convert playerData to an array, filter out "black" and "x2" keys, and return the new object
      const filteredTickets = Object.entries(filteredData)
        .filter(([key, value]) => !["black", "x2"].includes(key))
        .reduce((acc, [key, value]) => {
          acc[key] = value;  // Rebuild the object
          return acc;
        }, {});
      setTickets(filteredTickets);
    } else {
      setTickets(filteredData);  // Return original playerData if role is not "Detective"
    }
  }

  // Used for filtering out the moveId from an object, this case movement history
  const filterMoveID = (data) => {
    return data.map(item => {
      const { moveId, ...filteredItem } = item;
      return filteredItem;
    });
  };

  // Used to go through the movement history and add the destination of the move, used for the Dr.X move history display
  const filterAndModifyData = (data, targetIds) => {
    return data.map(({ moveId, ...filteredItem }) => ({
      ...filteredItem,
      text: targetIds.includes(filteredItem.round) ? `Dest: ${filteredItem.destination}` : filteredItem.text
    }));
  };

  // Since double tickets activate on the same round, this function makes it so rounds are unique by incrementing any repeat rounds, so they are unique and representative of number of moves done
  function adjustRounds(moves) {
    let roundMap = new Map(); // Stores the next available round for each seen round

    // Process moves to adjust rounds
    let adjustedMoves = moves.map((move) => {
      let { round } = move;

      // If this round was seen before, increase it
      while (roundMap.has(round)) {
        round++; // Move it to the next available round
      }

      // Store the new round so that future moves don't overlap
      roundMap.set(round, true);

      // Return updated move with adjusted round
      return { ...move, round };
    });

    return adjustedMoves;
  }

  // Function for getting the movement history of Dr X to be passed into a component so it can be displayed. 
  const fetchDrXMoveHis = useCallback(async () => {
    try {
      const gameID = await getItem('localGameID');
      const gameData = await GetGameState(gameID);
      const length = gameData.data.length + (Math.floor(gameData.data.length / 10));
      const filteredGameData = gameData.data.players[0];
      console.log("Filtered playerID: ", filteredGameData.playerId)
      const fetchedData = await GetPlayerMoveHistory(filteredGameData.playerId);
      const moveHistory = fetchedData.data.moves;
      const filteredMoveHistory = filterMoveID(moveHistory);

      const revealRounds = [3, 8, 13, 18, 24];
      const reformatDoubleMoves = adjustRounds(filteredMoveHistory);
      const DrXDisplay = filterAndModifyData(reformatDoubleMoves, revealRounds);

      const defaultBoxes = Array.from({ length }, (_, index) => ({
        round: index + 1, // 1-based index
        ticket: null, // No ticket assigned yet
        text: '', // No text by default
      }));

      const mergedBoxes = defaultBoxes.map((defaultBox) => {
        // Find a move that matches the round
        const move = DrXDisplay.find((box) => box.round === defaultBox.round);
        return move || defaultBox;
      });

      setBoxesData(mergedBoxes);

    } catch (error) {
      console.log("Fetch Dr X Error")
      console.log('Error: ', error);
    }
  }, []);

  let mapWidth = 0;
  let mapHeight = 0;
  if (mapData !== null) {
    mapWidth = mapData.mapWidth;
    mapHeight = mapData.mapHeight;
  }

// Allows for dragging the map along
const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      const panSpeedMult = 3
      offset.value = {
        x: e.translationX * panSpeedMult + start.value.x,
        y: e.translationY * panSpeedMult + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    });
// For zooming in and out of the map
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });
// Returning back to original scale/x-y view
  const resetPosition = () => {
    offset.value = {
      x: 0,
      y: 0,
    };
    scale.value = 1;
  }

  // Combine gestures so they can be used 
  const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  // Apply transformations
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: offset.value.x },
      { translateY: offset.value.y },
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

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>

        {/* Text box displaying the current turn */}
        <View style={styles.turnBox}>
          <Text style={styles.turnText}>Round: {gameLength}</Text>
          <Text style={styles.turnText}>Current Turn: {currentTurn}</Text>
        </View>
        { /* Arefeen's Component Code */}

        <View style={[styles.overlayComponent]}>
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
            <View style={styles.modalOverlay} onLayout={(event) => console.log('Modal Overlay height:', event.nativeEvent.layout.height)}>
              <View style={styles.drXModalContainer} onLayout={(event) => console.log('Modal height:', event.nativeEvent.layout.height)}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setDrXModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Dr X Movements</Text>
                <Grid fetchDrXMoveHis={fetchDrXMoveHis} boxesData={boxesData} />
              </View>
            </View>
          </Modal>

          {/* Tickets Modal */}
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
                      style={[styles.colorButton, { backgroundColor: colourMapping[ticketType] || 'gray' }]}
                      key={ticketType}  // Ensure each button has a unique key
                      onPress={() => handleTicketButtonPress(ticketType)}  // Handle button press
                    >
                      <Text style={[styles.overlayButtonText, { color: textColourMapping[ticketType] }]}>{ticketType}</Text>
                      <Text style={[styles.overlayButtonText, { color: textColourMapping[ticketType] }]}>{count}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Modal>
        </View>

        {/* Mark's Map Code */}
        <GestureDetector gesture={combinedGesture}>
          <Animated.View style={[styles.mapContainer, animatedStyle, { position: 'absolute' }]}>
            {/* Map Image */}
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
                  styles.location,
                  {
                    left: loc.xPos,
                    top: loc.yPos,
                  },
                ]}
                onPress={() => activateTicket(loc.location)}
              >
                <Text style={styles.locationText}>{loc.location}</Text>

                {/* Player Icons */}

                {playerLocations
                  .filter((playerLoc) => {
                    return playerLoc.location !== "Hidden" && String(playerLoc.location) === String(loc.location)
                  })
                  .map((playerLoc) => (
                    <TouchableOpacity
                      key={playerLoc.playerId}
                      style={[
                        styles.circle,
                        {
                          left: playerLoc.xPos,
                          top: playerLoc.yPos,
                          backgroundColor: playerLoc.colour.toLowerCase() === "clear" ? "purple" : playerLoc.colour.toLowerCase(),
                        },
                      ]}
                      onPress={() => handleKick(playerLoc.playerId, playerLoc.playerName)}
                      ></TouchableOpacity>
                  ))}
              </TouchableOpacity>
            ))}
          </Animated.View>
        </GestureDetector>
        <TouchableOpacity style={[styles.returnButton, {position: 'absolute', right: 20, bottom: 20}]} onPress={(resetPosition)}>
        <Text>Reset</Text>
        <Text>Position</Text>
      </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.backButton}onPress={goBack}><Text style={[{margin: 'auto',fontWeight: 'bold',}]}>{"<--------"}</Text></TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#9977ff',
    borderRadius: 5,
    marginVertical: 20,
    marginHorizontal: 20,
    width: 100,
    height: 40,
    position: 'absolute',
    top: 30,
    left: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  gridContainer: {
    flexGrow: 1,  // Allows it to expand
    width: '100%',
    minHeight: 100,  // Ensures it always has space
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    position: 'relative',
  },
  location: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    padding: 10,
    borderRadius: 10,
    width: 80,
    height: 80,
  },
  locationText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: 'black',
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
  returnButton: {
    backgroundColor: '#ff7f7f',
    borderRadius: 10,
    padding: 15,
    width: 'auto',
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
    maxHeight: '80%',
    flexGrow: 1,
    alignItems: 'center',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: width,
    flexWrap: 'wrap',
  },
  colorButton: {
    padding: 15,
    borderRadius: 10,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  turnBox: {
    width: '100%',
    padding: 10,
    backgroundColor: '#ddd',
    marginBottom: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  turnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MapViewer;