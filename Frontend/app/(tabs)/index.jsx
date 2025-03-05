import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useState} from 'react'
import { useRouter } from "expo-router";
import { Link } from 'expo-router'

const router = useRouter(); // Get router instance


export default function index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: 'black', alignItems: "center" }}>
    <><Link href="/lobby_code_page" style={styles.joinButton}>
      <Text style={styles.joinButtonText}>Join Game</Text>
    </Link>
    <Link href="/lobby_create_page" style={styles.createButton}>
        <Text style={styles.createButtonText}>Create Game</Text>
    </Link></>
    </View>
  )
}

  



const styles = StyleSheet.create({
  container: {
    backgroundColor: 'light gray',
    width: '60%',
    margin: 'auto',
  },
  joinButton: {
    backgroundColor: '#DDDD91',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    paddingTop: 30,
    marginBottom: '100px',
  },
  joinButtonText: {
    color: 'black',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    

  },
  createButton: {
    backgroundColor: '#DDDD91',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    paddingTop: 30,
    
  },
  createButtonText: {
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