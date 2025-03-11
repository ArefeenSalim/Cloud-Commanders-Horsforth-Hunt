import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useState} from 'react'
import { useRouter } from "expo-router";
import { Link } from 'expo-router'
import { Image } from 'react-native';


export default function index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: 'black', alignItems: "center" }}>
      <Image
       source={require('../../assets/images/logo.jpg')}
       style={{
         width: 300,
         height: 300,
         backgroundColor: 'transparent',
         marginBottom: 20,
       }}
       />
    
    <View style={styles.buttonsContainer}>
    <Link href="/lobby_code_page" style={styles.button}>
      <Text style={styles.buttonText}>Join Game</Text>
    </Link>
    <Link href="/lobby_create_page" style={styles.button}>
        <Text style={styles.buttonText}>Create Game</Text>
    </Link>
    <Link href="/game_page" style={styles.button}>
        <Text style={styles.buttonText}>Load Game (TESTING)</Text>
    </Link>
    <Link href="/map" style={styles.button}>
        <Text style={styles.buttonText}>Map page (TESTING)</Text>
    </Link>
    </View>
    </View>
  )
}

  



const styles = StyleSheet.create({
  buttonsContainer: {
    width: '80%', // Make buttons centered and responsive
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'light gray',
    width: '60%',
    margin: 'auto',
  },
  button: {
    backgroundColor: '#DDDD91',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10, // Add space between buttons
    
  },
  buttonText: {
    color: 'black',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textBox: {
    backgroundColor: 'red',
    length: '500px',
    width: '200px',
  },
  
})