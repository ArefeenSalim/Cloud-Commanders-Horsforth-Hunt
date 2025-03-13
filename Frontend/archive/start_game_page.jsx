import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useRouter, Link } from "expo-router";
import React, { useState, useEffect } from 'react';
import { getItem, setItem } from "../../utils/AsyncStorage";
import { startGame } from "../../utils/API Functions/PatchGameIDStart";
import { GetGameState } from "../../utils/API Functions/CheckGameState";
import { checkAndKickPlayer } from "../../utils/KickPlayer"

export default function StartGamePage() {
    const router = useRouter(); // Get router instance
    const [text, setText] = useState('');
    const [lobbyData, setLobbyData] = useState(null);
    const [status, setStatus] = useState('');
    const [targetPlayerId, setTargetPlayerId] = useState(0);

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

      const handleTestKick = async () => {
        // Store the mock game ID and player ID in AsyncStorage to simulate a real scenario
        await getItem('localGameID');
        await setItem('localPlayerId', 587);

        // Update the status message before executing the function
        setStatus('Checking and attempting to kick the player...');

        // Call the function that checks and potentially kicks the player
        await checkAndKickPlayer(Integer(targetPlayerId));

        // Update the status message after execution
        setStatus('Check completed. See console logs for details.');
    };

    if (lobbyData === null) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        );
    }

    return (

        <View style={{ flex: 1, justifyContent: "center", backgroundColor: 'black', alignItems: "center" }}>
            <Text style={styles.lobbyCodeText}>Lobby Code:</Text>
            <Text style={styles.lobbyCodeDisplay}>{lobbyData.gameId}</Text>
            
            <Link href="/" style={styles.startGame}>
            <Text style={styles.startGameText}>Start Game</Text>
            </Link>
            <View style={{ padding: 20, alignItems: 'center' }}>
            {/* Display a title for the test */}
            <Text style={{ marginBottom: 10 }}>Test Kick Player Function</Text>

            {/* Button to trigger the test function */}
            <TouchableOpacity title="Test Kick Player" style={styles.startGame} onPress={handleTestKick}>
                <Text>KickPlayer</Text>
            </TouchableOpacity>

            {/* Display the status of the operation */}
            <Text style={{ marginTop: 10 }}>{status}</Text>
        </View>
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