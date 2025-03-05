import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Link } from 'expo-router'

const router = useRouter(); // Get router instance
const [text, setText] = useState('');

export default function UsernamePage() {
    const [text, setText] = useState('');
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: 'black', alignItems: "center" }}>
            <Text style={styles.userText}>Enter Your username:</Text>
            <Link href="/start_game_page" style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
            </Link>
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