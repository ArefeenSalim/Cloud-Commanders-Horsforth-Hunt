import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { AddPlayer } from '../../utils/API Functions/AddPlayer';
import { CreateGame } from '../../utils/API Functions/CreateGame';
import { setItem, getItem, clear } from '../../utils/AsyncStorage'

// Page for handling the username input from users, and then handle the functions to create and/or join a lobby.
export default function UsernamePage() {
    const router = useRouter(); // Get router instance
    const [text, setText] = useState('');
    let returnData;

    // Function to return back to the index/home page
    const goBack = async () => {
        await clear()
        router.navigate('/')
    };

    // Main function, checks to see whether the user is trying to join or create a game, then calls upon the necessary API calls to create the game (if player is host) and join a game
    const InitLobby = async (username) => {
        console.log(await getItem('targetMap'))
        if (username === "" && (Platform.OS == 'android' || Platform.OS == 'ios')) {
            Alert.alert('Error', 'Input Username');
            return;
        } else if ((username != null || username != undefined) && await getItem('isHost')) {

            try {
                const gameDuration = await getItem('localGameDuration');
                console.log("This is targetMap: ", await getItem('targetMap'))

                const result = await CreateGame(await getItem('lobbyName'), await getItem('targetMap'), gameDuration)

                if (result.success) {
                    console.log('Create Game JSON Data:', result.data);
                    returnData = result.data;

                    await setItem('localGameID', returnData.gameId);
                } else {
                    console.error('Error:', result.error)
                    Alert.alert('Error', result.error)
                    return;
                }
            } catch (error) {
                console.error("Error in create Lobby:", error);
                return;
            }
        }
        try {
            const addResult = await AddPlayer(username, await getItem('localGameID'))

            if (addResult.success) {
                console.log('JSON Data:', addResult.data);
                returnData = addResult.data;
                console.log(returnData.gameId);

                await setItem('localPlayerId', returnData.playerId);

                router.navigate('/Lobby');
            } else {
                console.error('Error:', addResult.error)
                Alert.alert('Error', addResult.error)
                return;
            }
        } catch (error) {
            console.error("Error in join lobby:", error);
            return;
        }

    }


    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: 'black', alignItems: "center" }}>
            <Text style={styles.userText}>Enter Your username:</Text>
            <TouchableOpacity onPress={() => InitLobby(text)} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.textBox}
                placeholder=""
                value={text}
                onChangeText={(newText) => setText(newText)} />
            <TouchableOpacity style={styles.backButton} onPress={goBack}><Text style={styles.text2}>{"<--------"}</Text></TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    scroll: { flex: 1 },
    text2: {
        margin: 'auto',
        fontWeight: 'bold',
    },
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
    container: {
        backgroundColor: 'black',
    },

    textBox: {
        position: 'absolute',
        backgroundColor: '#DDDD91',
        marginBottom: 100,
        width: 300,
        height: 90,
        fontSize: 30,
    },

    userText: {
        marginTop: 230,
        fontSize: 36,
        fontStyle: 'bold',
        color: '#DDDD91',
    },

    submitButton: {
        backgroundColor: '#DDDD91',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        paddingTop: 30,
        width: 210,
        height: 150,
        borderRadius: '50%',
        marginBottom: 150,
        marginTop: 290,
    },

    submitButtonText: {
        fontSize: 30,
        marginTop: 20,
        marginLeft: 16,
    }
})