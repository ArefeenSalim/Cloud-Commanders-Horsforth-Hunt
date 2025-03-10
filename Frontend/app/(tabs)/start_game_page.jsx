import { View, Text, Image, StyleSheet, TextInput, ActivityIndicator } from 'react-native'
import { useRouter } from "expo-router";
import React, { useState, useEffect } from 'react';
import { Link } from 'expo-router';
<<<<<<< HEAD
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
=======
import { getItem } from "../../utils/AsyncStorage";
import { startGame } from "../../utils/API Functions/PatchGameIDStart";
import { GetGameState } from "../../utils/API Functions/CheckGameState";

export default function StartGamePage() {
    const router = useRouter(); // Get router instance
    const [text, setText] = useState('');
    const [lobbyCode, setLobbyCode] = useState('Empty');
    const [lobbyData, setLobbyData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
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
        };
    
        fetchData();
      }, []);

    if (lobbyData === null) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        );
    }

>>>>>>> 84a2f2d2d2c166b08955dd300e06b659b969082d
    return (

        <View style={{ flex: 1, justifyContent: "center", backgroundColor: 'black', alignItems: "center" }}>
            <Text style={styles.lobbyCodeText}>Lobby Code:</Text>
<<<<<<< HEAD
            <text style={styles.lobbyCodeDisplay}>{lobbyID}</text>
=======
            <Text style={styles.lobbyCodeDisplay}>{lobbyData.gameId}</Text>
>>>>>>> 84a2f2d2d2c166b08955dd300e06b659b969082d
            
            <Link href="/" style={styles.startGame}>
            <Text style={styles.startGameText}>Start Game</Text>
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