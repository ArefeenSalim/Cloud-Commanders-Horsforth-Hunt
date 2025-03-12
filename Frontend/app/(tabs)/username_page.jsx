import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { AddPlayer } from '../../utils/API Functions/AddPlayer';
import { CreateGame } from '../../utils/API Functions/CreateGame';
import { setItem, getItem } from '../../utils/AsyncStorage'

const router = useRouter(); // Get router instance
const [text, setText] = useState('');

export default function UsernamePage() {
    const [text, setText] = useState('');
    const mapNumb = 600;
    let returnData;

    const InitLobby = async (username) => {
        console.log("InitLobby Triggered")
        if (username === "" && (Platform.OS == 'android' || Platform.OS == 'ios')) {
            Alert.alert('Error', 'Input Username');
            return;
        } else if ((username != null || username != undefined) && await getItem('isHost')) {
                  try {
                  const gameDuration = await getItem('localGameDuration');

                  const result = await CreateGame(await getItem('lobbyName'), mapNumb, gameDuration)
        
                  if (result.success) {
                      console.log('JSON Data:', result.data);
                      returnData = result.data;
                      console.log(returnData.gameId);
            
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
            onChangeText={(newText) => setText(newText)}/>
        </View>
    )
}

const styles = StyleSheet.create({
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