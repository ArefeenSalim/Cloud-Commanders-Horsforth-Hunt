import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform } from 'react-native'
import { useRouter, Link } from "expo-router";
import React, { useState } from 'react';
import { setItem, clear } from '../../utils/AsyncStorage'; 

export default function LobbyCodePage() {
  const router = useRouter(); // Get router instance
  const [text, setText] = useState('');

  const goBack = async () => {
    await close()
    router.navigate('/')
    clear()
  }

  const saveLobbyID = async (lobbyID) => {
      if (lobbyID === "" && (Platform.OS == 'android' || Platform.OS == 'ios')) {
        Alert.alert('Error', 'Input Lobby Code');
      } else if (lobbyID != null || lobbyID != undefined) {        
        try {
          let parsedLobbyID = parseInt(lobbyID)
          if (!isNaN(parsedLobbyID) && lobbyID === '' + parsedLobbyID) {
            await setItem('localGameID', parseInt(lobbyID))
            router.navigate('/Lobby');
          } else {
            if (Platform.OS == 'android' || Platform.OS == 'ios') {
              Alert.alert('Error', 'Input Integer');
            } else {
              console.log("Error, input Integer");
            }
          }
        } catch (error) {
          if (lobbyID === "" && (Platform.OS == 'android' || Platform.OS == 'ios')) {
            Alert.alert('Error', 'Input Integer');
          } else {
            console.log("Error, input Integer");
          }
        }
      };
    }
  
  return (
    
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: 'black', alignItems: "center" }}>
      <Text style={styles.lobbyText}>Enter Lobby ID Here:</Text>
      <Link onPress={() => saveLobbyID(text)} style={styles.JoinButton}>
      <Text style={styles.joinButtonText}>Join Game</Text>
      </Link>
    <TextInput
      style={styles.textBox}
      placeholder=""
      value={text}
      onChangeText={(newText) => setText(newText)}/>
      <TouchableOpacity style={styles.backButton}onPress={goBack}><Text style={styles.text2}>{"<--------"}</Text></TouchableOpacity>
    </View>
  );
}



const styles = StyleSheet.create({
  scroll: { flex: 1 },
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
  JoinButton: {
    backgroundColor: '#DDDD91',
    paddingVertical: 15,
    paddingHorizontal: 40,
    paddingTop: 30,
    width: 210,
    height: 150,
    borderRadius: 50,
    
  },
  joinButtonText: {
    fontSize: 26,
    marginTop: 20,
    marginLeft: 4,
  },
  lobbyText: {
    marginBottom: 250,
    fontSize: 30,
    fontStyle: 'bold',
    color: '#DDDD91',
  },
  textBox: {
    position: 'absolute',
    backgroundColor: '#DDDD91',
    marginBottom: 100,
    width: 300,
    height: 90,
    fontSize: 30,
  }
})


