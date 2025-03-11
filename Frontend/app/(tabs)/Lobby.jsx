import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { getItem } from "../../utils/AsyncStorage";
import { StartGame } from "../../utils/API Functions/PatchGameIDStart";
import { GetGameState } from "../../utils/API Functions/CheckGameState";
import { getOpenGames } from '../../utils/API Functions/GetGame';
import { checkAndKickPlayer } from "../../utils/KickPlayer";



const ComponentContainer = () => {

    const [componentsData, setComponentsData] = useState([]);
    const [lobbyData, setLobbyData] = useState();
    const [lobbyName, setLobbyName] = useState();
    const [targetPlayerId, settargetPlayerId] = useState(null);

  const handleKick = async () => {
    // Update the status message before executing the function
    setStatus('Checking and attempting to kick the player...');

    // Call the function that checks and potentially kicks the player
    await checkAndKickPlayer(targetPlayerId);

    // Update the status message after execution
    setStatus('Check completed. See console logs for details.');
  };

  if (lobbyData === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

    const handleTargetPlayer = (playerId) => {
      settargetPlayerId(playerId)
    }
    const router = useRouter(); // Get router instance

    async function startGameButton() {
      const localPlayerID = await getItem('localPlayerId')
      const localGameID = await getItem('localGameID')
      try {
      if (String(localPlayerID) == String(lobbyData.players[0].playerId)) {
        StartGame(localGameID, localPlayerID)
      } else {
        Alert.alert("Error Starting game")
      }
    } catch(error) {
      Alert.alert("API Error")
    }

    }

    useEffect(() => {
      const intervalId = setInterval(async () => {
          try {
            const localGameID = await getItem('localGameID')
            const result = await GetGameState(localGameID);
            if (result.success) {
                console.log(result.data);
                setLobbyData(result.data);
                if (result.data.status !== "Open" && result.data.status !== undefined) {
                  console.log(result.data.status);
                  router.navigate('/game_page');
                }
                const gameCheck = await getOpenGames();
                if (gameCheck.success) {
                  const gameData = gameCheck.data.games
                for (const element of gameData) {
                  if (String(element.gameId) == String(localGameID)){
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
                console.error('Fetch error:', error);
          }
        }, 5000);

        return () => clearInterval(intervalId)
      }, []);

  useEffect(() => {
    const data = async () => {
      try {
      const playerLobbyData = lobbyData.players;
      if (!(playerLobbyData == null || playerLobbyData == undefined)) {
      console.log('this is the player output', lobbyData.players)
      const settingData = playerLobbyData.map(playerInfo => ({
        title: playerInfo.playerName,
        content: playerInfo.colour,
        playerId: playerInfo.playerId
      }))
      console.log(settingData)
      setComponentsData(settingData);
    } else { 
      console.log('lobby still loading')}
    } catch (error) {
      console.log("Error with player data loading: ", error)
    }
  }
    data()
  }, [lobbyData]);

  if (componentsData.length == 0 && (lobbyData == null || lobbyData == undefined)) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }



    return (
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>Lobby Name: {lobbyName}</Text>
        <Text style={styles.text}>Game ID: {lobbyData.gameId}</Text>
        <View style={styles.view}>
          <View style={styles.h2}>
              {componentsData.map((data) => (
                <View style={[styles.section, {borderColor: data.content.toLowerCase() === "clear" ? "grey" : data.content.toLowerCase()}]} key={data.playerId}>
                  <Text style={styles.titles}>Player</Text>
                  <Text style={styles.text}>{data.title}</Text>
                  <Text style={styles.titles}>Colour</Text>
                  <Text style={styles.text}>{data.content}</Text>
                  <Text style={styles.titles}>Player ID</Text>
                  <Text style={styles.text}>{data.playerId}</Text>
                  <TouchableOpacity style={styles.selectPlayer} onPress={() => handleTargetPlayer(data.playerId)}><Text style={styles.text2}>Select Player</Text></TouchableOpacity>
                </View>
              ))}
              
          </View>
          <View style={styles.flex}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.refresh}>Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={startGameButton}>
              <Text style={styles.refresh}>Start Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    )
}

export default ComponentContainer;

const styles = StyleSheet.create({
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