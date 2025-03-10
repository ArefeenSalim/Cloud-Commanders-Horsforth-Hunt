import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native'
import { useRouter } from "expo-router";
import { Link } from 'expo-router'
import DynamicComponent from "../../utils/DynamicComponent";
import { getItem } from "../../utils/AsyncStorage";
import { startGame } from "../../utils/API Functions/PatchGameIDStart";
import { GetGameState } from "../../utils/API Functions/CheckGameState";



const ComponentContainer = () => {

    const [repeat, setRepeat] = useState(1);

    const componentsData = [];

    for (let i = 0; i < repeat; i++) {
        var player = [{}, {}, {}, {}, {}];
        var gameID = [{}, {}, {}, {}, {}];
        
        componentsData[i] = {title: player[i], content: gameID[i]}
    };


    return (
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>Multiplayer Lobby Page</Text>
        <View style={styles.view}>
          <View style={styles.h2}>
              {componentsData.map((data, index) => (
                <View style={styles.section}>
                  <DynamicComponent key={index} {...data} />
                </View>
              ))}
          </View>
          <View style={styles.flex}>
            <button style={styles.button} onClick={() => setRepeat(repeat + 1)}>
              <Text style={styles.refresh}>Refresh</Text>
            </button>
            <button style={styles.button}>
              <Text style={styles.refresh}>Start Game</Text>
            </button>
          </View>
        </View>
      </View>
      </ScrollView>
    )
}

export default ComponentContainer;

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#000000',
      width: '100%',
      height: '100%',
    },
    text: {
      fontSize: 40,
      textAlign: 'center',
      color: '#dddd91'
    },
    h2: {
        fontSize: 7,
        backgroundColor: '#777777',
    },
    view: {
        backgroundColor: '#444444',
        width: '90%',
        height: 'auto',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: '20px',
        margin: 'auto',
        marginVertical: '50px',
        borderWidth: '5px',
        borderColor: '#dddd91',
    },
    section: {
      backgroundColor: '#444444',
      borderWidth: '3px',
      borderColor: '#dddd91',
      margin: '10px',
    },
    button: {
      backgroundColor: '#dddd91',
      width: '150px',
      height: '60px',
      margin: '20px',
    },
    refresh: {
      color: '#000000',
      margin: 'auto',
      fontSize: 20,
      fontWeight: 'bold',
    },
    flex: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    }
})