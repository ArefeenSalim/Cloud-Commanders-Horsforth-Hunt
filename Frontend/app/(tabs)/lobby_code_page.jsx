import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { useRouter } from "expo-router";
import React, { useState } from 'react'; 


const router = useRouter(); // Get router instance


const [text, setText] = useState('');

export default function LobbyCodePage() {
  const router = useRouter(); // Get router instance
  const [text, setText] = useState('');
  
  return (
    
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: 'black', alignItems: "center" }}>
      <Text style={styles.lobbyText}>Enter Your Lobby Code Here:</Text>
      <TouchableOpacity href="/username_page" style={styles.JoinButton}>
      <Text style={styles.joinButtonText}>Join Game</Text>
      </TouchableOpacity>
    <TextInput
      style={styles.textBox}
      placeholder=""
      value={text}
      onChangeText={(newText) => setText(newText)}/>
    </View>
  );
}



const styles = StyleSheet.create({
  JoinButton: {
    backgroundColor: '#DDDD91',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    paddingTop: 30,
    width: '210px',
    height: '150px',
    borderRadius: '50%',
    
  },
  joinButtonText: {
    fontSize: '26px',
    marginTop: '20px',
    marginLeft: '4px',
  },
  lobbyText: {
    marginBottom: '250px',
    fontSize: 30,
    fontStyle: 'bold',
    color: '#DDDD91',
  },
  textBox: {
    position: 'absolute',
    backgroundColor: '#DDDD91',
    marginBottom: '100px',
    width: '300px',
    height: '90px',
    fontSize: '30px',
  }
})


