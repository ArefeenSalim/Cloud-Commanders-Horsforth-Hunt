import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform } from 'react-native'
import { useRouter, Link } from "expo-router";
import React, { useState } from 'react'; 
import { CreateGame } from '../../utils/API Functions/CreateGame'
import { setItem, getItem, clear } from '../../utils/AsyncStorage'

// const router = useRouter(); // Get router instance
// const [text, setText] = useState('');


export default function LobbyCodePage() {
  const router = useRouter(); // Get router instance
  const [text, setText] = useState('');
  const [gameDuration, setGameDuration] = useState('short')

  const changeduration = async () => {
    if (gameDuration === 'short') {
      await setGameDuration('long')
    } else {
      await setGameDuration('short')
    }
  }


  const becomeHost = async (lobbyName) => {
    if (lobbyName === "" && (Platform.OS == 'android' || Platform.OS == 'ios')) {
      Alert.alert('Error', 'Input Lobby Code');
    } else if (lobbyName != null || lobbyName != undefined) {
      await setItem('lobbyName', lobbyName)
      await setItem('isHost', true);
      await setItem('localGameDuration', gameDuration);
      console.log(await getItem('localGameDuration'))
      router.navigate('/username_page');
    };
  }
  

  return (

    <View style={{ flex: 1, justifyContent: "center", backgroundColor: 'black', alignItems: "center" }}>
      <Text style={styles.lobbyText}>Enter Lobby Name Here:</Text>
      <TextInput
        style={styles.textBox}
        placeholder=""
        value={text}
        onChangeText={(newText) => setText(newText)} />
      <View style={styles.container}>
        <TouchableOpacity onPress={() => becomeHost(text)} style={styles.JoinButton}>
          <Text style={styles.joinButtonText}>Create Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.JoinButton} onPress={() => changeduration()}>
          <Text style={styles.joinButtonText}>Duration: {String(gameDuration).charAt(0).toUpperCase() + String(gameDuration).slice(1)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
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


