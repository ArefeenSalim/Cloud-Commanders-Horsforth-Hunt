import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState} from 'react'

// JoinButton Component
const JoinButton = () => {
    return (
      <TouchableOpacity style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Join Game</Text>
      </TouchableOpacity>
    );
  };
  
  // CreateButton Component
  const CreateButton = () => {
    return (
      <TouchableOpacity style={styles.createButton} onPress={() => setCurrentPage('lobby_code_page.jsx')}>
        <Text style={styles.createButtonText}>Create Game</Text>
      </TouchableOpacity>
    );
  };
  
  // App Component
  const app = () => {
    return (
      <View style={styles.container}>
        <JoinButton />
        <CreateButton />
      </View>
    );
  };
  const [currentPage, setCurrentPage] = useState('lobby_code_page')

export default app

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    width: '60%',
    margin: 'auto',
  },
  joinButton: {
    backgroundColor: '#DDDD91',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    paddingTop: 30,
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
    marginTop: 120,
    paddingTop: 30,
  },
  createButtonText: {
    color: 'black',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
})