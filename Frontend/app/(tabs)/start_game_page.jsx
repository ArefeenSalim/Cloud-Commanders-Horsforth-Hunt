import { View, Text, Image, StyleSheet, TextInput } from 'react-native'
import { useRouter } from "expo-router";
import React, { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { setItem, getItem } from '../../utils/AsyncStorage'

const router = useRouter(); // Get router instance
const [text, setText] = useState('');

export default function StartGamePage() {
    const [lobbyID, setLobbyID] = useState('');
    useEffect(() => {
        const fetchLobbyID = async () => {
          const storedID = await getItem('localGameID'); // Get the value from AsyncStorage
          if (storedID) {
            setLobbyID(storedID); // Set it to state
          }
        };
        fetchLobbyID();
    }, []);
    return (

        <View style={{ flex: 1, justifyContent: "center", backgroundColor: 'black', alignItems: "center" }}>
            <Text style={styles.lobbyCodeText}>Lobby Code:</Text>
            <text style={styles.lobbyCodeDisplay}>{lobbyID}</text>
            
            <Link href="/" style={styles.startGame}>
            <text style={styles.startGameText}>Start Game</text>
            </Link>
        </View>
    )
}

const styles = StyleSheet.create ({
    lobbyCodeText: {
        marginBottom: 600,
        marginRight: 160,
        fontSize: 36,
        fontStyle: 'bold',
        color: '#DDDD91',
    },
    
    lobbyCodeDisplay: {
        position: 'absolute',
        backgroundColor: '#DDDD91',
        marginBottom: 770,
        marginLeft: 220,
        width: 150,
        height: 50,
        fontSize: 24,
        color: 'black'
    },

    startGame: {
        backgroundColor: '#DDDD91',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        paddingTop: 30,
        marginBottom: '100px',
    },

    startGameText: {
        color: 'black',
        fontSize: 28,
        textAlign: 'center',
        fontWeight: 'bold',
    },
})