import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useRouter } from "expo-router";
import { Link } from 'expo-router'
import DynamicComponent from "../../utils/DynamicComponent";
import { getItem } from "../../utils/AsyncStorage";
import { startGame } from "../../utils/API Functions/PatchGameIDStart";
import { GetGameState } from "../../utils/API Functions/CheckGameState";



const ComponentContainer = () => {

    const [repeat, setRepeat] = useState(2);
    const [componentsData, setComponentsData] = useState([]);
    const [lobbyData, setLobbyData] = useState()

    useEffect(() => {
      const intervalId = setInterval(async () => {
          try {
            const localGameID = await getItem('localGameID')
            const result = await GetGameState(localGameID);
            if (result.success) {
                console.log(result.data);
                setLobbyData(result.data);
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
        <Text style={styles.text}>Multiplayer Lobby Page</Text>
        <Text style={styles.text}>{setLobbyData.gameId}</Text>
        <View style={styles.view}>
          <View style={styles.h2}>
              {componentsData.map((data, index) => (
                <View style={styles.section}>
                  <DynamicComponent key={index} {...data} />
                </View>
              ))}
          </View>
          <View style={styles.flex}>
            <TouchableOpacity style={styles.button} onClick={() => setRepeat(repeat + 1)}>
              <Text style={styles.refresh}>Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
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
        fontSize: 7,
        backgroundColor: '#777777',
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
      borderWidth: 3,
      borderColor: '#dddd91',
      margin: 10,
    },
    button: {
      backgroundColor: '#dddd91',
      width: 150,
      height: 60,
      margin: 20,
    },
    refresh: {
      color: '#000000',
      margin: 'auto',
      fontSize: 20,
      fontWeight: 'bold',
    },
    flex: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    }
})