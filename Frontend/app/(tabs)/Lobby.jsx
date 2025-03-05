import React from "react";
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native'
import { useRouter } from "expo-router";
import { Link } from 'expo-router'
import DynamicComponent from "../../utils/DynamicComponent";

const ComponentContainer = () => {
    const componentsData = [];

    for (let i = 0; i < 5; i++) {
        var player = ['apple', 'banana', 'orange', 'grapes', 'guava'];
        var gameID = ['cake', 'chocolate', 'cookies', 'ice cream', 'cup cakes'];
        componentsData[i] = {title: player[i], content: gameID[i], text: ""}
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
          <View style={styles.button}>
            <Text style={styles.refresh}>Refresh</Text>
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
      width: '100px',
      height: '40px',
    },
    refresh: {
      color: '#000000',
      margin: 'auto',
    }
})