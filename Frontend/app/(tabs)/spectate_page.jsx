// specate_page.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Dimensions } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useRouter } from "expo-router";
import { GetMapData } from '../../utils/API Functions/GetMapData';
import { GetGameState } from '../../utils/API Functions/CheckGameState';
import { getItem, clear } from '../../utils/AsyncStorage';
import { GetPlayerMoveHistory } from '../../utils/API Functions/GetPlayerMoveHistory';
import Grid from './grid';

const { width, height } = Dimensions.get('window');

// Function for viewing the game from the website, to spectate and see the game be played.
const MapViewer = () => {
  const [mapData, setMapData] = useState(null);
  const [playerLocations, setPlayerLocations] = useState([]);
  const [boxesData, setBoxesData] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [gameLength, setGameLength] = useState(null);
  const [mapID, setMapID] = useState(null);
  const router = useRouter(); // Get router instance
  const scale = useSharedValue(2);
  const savedScale = useSharedValue(1);
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });

  // Function for returning to index/home
  const goBack = async () => {
    await clear()
    router.navigate('/')
  }

  // Hook for generating a listener for when wheel is used, to scroll in and out of the map to change the scale.
  useEffect(() => {
    const handleWheel = (event) => {
      const zoomSpeed = 0.1;
      if (event.deltaY < 0) {
        scale.value = Math.min(scale.value + zoomSpeed, 5);
      } else {
        scale.value = Math.max(scale.value - zoomSpeed, 0.1);
      }
    };

    window.addEventListener('wheel', handleWheel);

    // Cleanup the listener when component unmounts
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Function for drawing the locations/nodes on the map
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (mapID) {
          const result = await GetMapData(mapID);
          console.log("Result: ", result);
          if (result.success && Array.isArray(result.data.locations)) {
            const mapOffsets = {
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
        fetchDrXMoveHis(); // Needed so that the Dr.X Move History can update as it is no longer being called when opened like in the game_page
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

          const defaultOffset = { x: 0, y: -100 }


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
          console.log("Player Position Fetch Completed", updatedPlayers)
        } else {
          console.error('Error:', result.error);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }, 5000);

    return () => clearInterval(intervalId)
  }, []);

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
    start.value = {
      x: 0,
      y: 0,
    };
    offset.value = {
      x: 0,
      y: 0,
    };
    scale.value = 1;
    savedScale.value = 1;
  }




  // Combine gestures
  const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  // Apply transformations
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: offset.value.x },
      { translateY: offset.value.y },
    ],
  }));

  // Check if mapData is still loading, if it is, then a loading icon will appear
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

        {/* Dr X Move History Container, fixed to the leftside */}
        <View style={styles.modalOverlay} onLayout={(event) => console.log('Modal Overlay height:', event.nativeEvent.layout.height)}>
          <View style={styles.drXModalContainer} onLayout={(event) => console.log('Modal height:', event.nativeEvent.layout.height)}>
            <Text style={styles.modalTitle}>Dr X Movements</Text>
            <Grid fetchDrXMoveHis={fetchDrXMoveHis} boxesData={boxesData} />
          </View>
        </View>

        {/* Mark's Map Code */}
        <GestureDetector gesture={combinedGesture}>
          <Animated.View style={[styles.mapContainer, animatedStyle, { position: 'absolute' }]}>
            {/* Map Locations */}
            <Image
              source={{ uri: mapData.mapImage }}
              style={{
                width: mapData.mapWidth,
                height: mapData.mapHeight,
              }}
              resizeMode="cover"
            />

            {/* Map Locations */}
            {mapData.locations.map((loc) => (
              <View
                key={loc.location}
                style={[
                  styles.location,
                  {
                    left: loc.xPos,
                    top: loc.yPos,
                  },
                ]}
              >

                {/* Player Icons */}

                <Text style={styles.locationText}>{loc.location}</Text>
                {playerLocations
                  .filter((playerLoc) => {
                    return playerLoc.location !== "Hidden" && String(playerLoc.location) === String(loc.location)
                  })
                  .map((playerLoc) => (
                    <View
                      key={playerLoc.playerId}
                      style={[
                        styles.circle,
                        {
                          left: playerLoc.xPos,
                          top: playerLoc.yPos,
                          backgroundColor: playerLoc.colour.toLowerCase() === "clear" ? "purple" : playerLoc.colour.toLowerCase(),
                        },
                      ]}
                    ></View>
                  ))}
              </View>
            ))}
          </Animated.View>
        </GestureDetector>
        <TouchableOpacity style={[styles.returnButton, { position: 'absolute', right: 20, bottom: 20 }]} onPress={(resetPosition)}>
          <Text>Reset</Text>
          <Text>Position</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={goBack}><Text style={[{ margin: 'auto', fontWeight: 'bold', }]}>{"<--------"}</Text></TouchableOpacity>
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
  returnButton: {
    backgroundColor: '#ff7f7f',
    borderRadius: 10,
    padding: 15,
    width: 'auto',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: 'black',
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
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center', // Centers the content vertically
    alignItems: 'flex-start', // Aligns content to the left
    padding: 10,
    zIndex: 10,
  },
  drXModalContainer: {
    width: '50%',
    height: '80%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start', // Ensures it's aligned to the left
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