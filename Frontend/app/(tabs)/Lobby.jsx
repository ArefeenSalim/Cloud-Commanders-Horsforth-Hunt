import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { getItem, clear } from "../../utils/AsyncStorage";
import { StartGame } from "../../utils/API Functions/PatchGameIDStart";
import { GetGameState } from "../../utils/API Functions/CheckGameState";
import { getOpenGames } from '../../utils/API Functions/GetGame';


// Page for displaying the lobby, showing off details like the lobby name, lobby id, along with the players and their assigned colours within. 
const ComponentContainer = () => {

  const [componentsData, setComponentsData] = useState([]);
  const [lobbyData, setLobbyData] = useState(null);
  const [lobbyName, setLobbyName] = useState(null);
  const router = useRouter();

  // Return to index/lobby page
  const goBack = async () => {
    await clear()
    router.navigate('/')
  }

  // Function for starting game. Checks to see if the one who pressed it is the actual host, if not, then it will not start the game.
  async function startGameButton() {
    const localPlayerID = await getItem('localPlayerId')
    const localGameID = await getItem('localGameID')
    try {
      if (String(localPlayerID) == String(lobbyData.players[0].playerId)) {
        StartGame(localGameID, localPlayerID)
      } else {
        Alert.alert("Error Starting game")
      }
    } catch (error) {
      Alert.alert("API Error")
    }

  }

  // Polling system to check whether the game has started, to then navigate to the game page. Otherwise  gets data about the players in the game to load on the page
  // Issue with unmounting, still need to investigate
  useEffect(() => {
    let isMounted = true;
    
    const intervalId = setInterval(async () => {
      if (!isMounted) return; // Prevent running after unmount
      try {
        const localGameID = await getItem('localGameID')
        const result = await GetGameState(localGameID);
        if (result.success && isMounted) {
          setLobbyData(result.data);
          if (result.data.state !== "Open" && result.data.state !== undefined) {
            if (Platform.OS !== "web") {
              router.navigate('/game_page');
            } else {
              router.navigate('/spectate_page');
            }
          }
          const gameCheck = await getOpenGames();
          if (gameCheck.success) {
            const gameData = gameCheck.data.games
            for (const element of gameData) {
              if (String(element.gameId) == String(localGameID)) {
                setLobbyName(element.gameName)
              }
            }
          }
          else {
            console.error('Error:', result.error);
          }
        } else {
          console.error('Error:', result.error);
        }
      } catch (error) {
        if (isMounted) console.log('Fetch error:', error);
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId)
    }
  }, [router]);

  useEffect(() => {
    const data = async () => {
      try {
        const playerLobbyData = lobbyData.players;
        if (!(playerLobbyData == null || playerLobbyData == undefined)) {
          const settingData = playerLobbyData.map(playerInfo => ({
            title: playerInfo.playerName,
            content: playerInfo.colour,
            playerId: playerInfo.playerId,
            location: playerInfo.location,
          }))
          setComponentsData(settingData);
        } else {
          console.log('Lobby still loading')
        }
      } catch (error) {
        console.log("Error with player data loading: ", error)
      }
    }
    data()
  }, [lobbyData]);

  // Checks if the lobby data has loaded and the components to display the players has been configured, if not, it will return a loading indicator
  if (componentsData.length == 0 && (lobbyData == null || lobbyData == undefined)) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }



  return (
    <View style={styles.scroll}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.text}>Lobby Name: {lobbyName}</Text>
          <Text style={styles.text}>Game ID: {lobbyData.gameId}</Text>
          <View style={styles.view}>
            <View style={styles.h2}>
              {componentsData.map((data) => (
                <View style={[styles.section, { borderColor: data.content.toLowerCase() === "clear" ? "purple" : data.content.toLowerCase() }]} key={data.playerId}>
                  <Text style={styles.titles}>Player</Text>
                  <Text style={styles.text}>{data.title}</Text>
                  <Text style={styles.titles}>Colour</Text>
                  <Text style={styles.text}>{data.content}</Text>
                  <Text style={styles.titles}>Start Location</Text>
                  <Text style={styles.text}>{data.location}</Text>
                </View>
              ))}

            </View>
            {Platform.OS !== 'web' ? (
              <View style={styles.flex}>
                <TouchableOpacity style={styles.button} onPress={startGameButton}>
                  <Text style={styles.refresh}>Start Game</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.flex}>
                <Text style={[styles.refresh, { fontSize: 26, color: 'yellow', marginTop: 10 }]}>Waiting for Game to Start...</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.backButton} onPress={goBack}><Text style={[{ margin: 'auto', fontWeight: 'bold', }]}>{"<--------"}</Text></TouchableOpacity>
    </View>
  )
}

export default ComponentContainer;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    minHeight: '100%',
    backgroundColor: '#000000',
  },
  scroll: {
    flex: 1,
  },
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
  text2: {
    margin: 'auto',
    fontWeight: 'bold',
  },
  selectPlayer: {
    backgroundColor: '#9977ff',
    marginHorizontal: 'auto',
    marginVertical: 20,
    width: '75%',
    height: 40,
    borderRadius: 5,
  },
  container: {
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 40,
    textAlign: 'center',
    color: '#dddd91'
  },
  h2: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    fontSize: 7,
    backgroundColor: '#777777',
    flexWrap: 'wrap',
  },
  view: {
    backgroundColor: '#444444',
    width: '90%',
    height: 'auto',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: 20,
    margin: 'auto',
    marginVertical: 50,
    borderWidth: 5,
    borderColor: '#dddd91',
  },
  section: {
    backgroundColor: '#444444',
    width: 275,
    borderWidth: 5,
    borderColor: '#dddd91',
    margin: '5%',
  },
  button: {
    backgroundColor: '#dddd91',
    width: '20%',
    height: 60,
    margin: 20,
    borderRadius: 10,
  },
  refresh: {
    color: '#000000',
    margin: 'auto',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titles: {
    backgroundColor: '#dddd91',
    width: '100%',
    color: '#000000',
    margin: 'auto',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  }
})