import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform } from 'react-native'
import { useRouter, Link } from "expo-router";
import React, { useState } from 'react'; 
import { CreateGame } from '../../utils/CreateGame'

// const router = useRouter(); // Get router instance
// const [text, setText] = useState('');


export default function LobbyCodePage() {
  const router = useRouter(); // Get router instance
  const [text, setText] = useState('');

  const createLobby = (lobbyName) => {
    if (lobbyName === "" &&(Platform.OS == 'android' || Platform.OS == 'ios')) {
      Alert.alert('Error', 'Input Lobby Code');
    } else if (lobbyName != null || lobbyName != undefined) {
      console.log("Before CreateGame");
      console.log(CreateGame(lobbyName, 1, 'short'));
      console.log("Made past CreateGame");
      router.navigate('/username_page');
    }
  }

  return (

    <View style={{ flex: 1, justifyContent: "center", backgroundColor: 'black', alignItems: "center" }}>
      <Text style={styles.lobbyText}>Enter Lobby Name Here:</Text>
      <TouchableOpacity onPress={() => createLobby(text)} style={styles.JoinButton}>
        <Text style={styles.joinButtonText}>Create Game</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.textBox}
        placeholder=""
        value={text}
        onChangeText={(newText) => setText(newText)} />
    </View>
  );
}



const styles = StyleSheet.create({
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


