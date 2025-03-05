import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { useRouter } from "expo-router";
import React, { useState } from 'react';

const router = useRouter(); // Get router instance
const [text, setText] = useState('');

export default function UsernamePage() {
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: 'black', alignItems: "center" }}>
            <Text style={styles.userText}>Enter Your username:</Text>
            <TouchableOpacity href="/lobby_code_page" style={styles.submitButton}>
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
        marginBottom: '100px',
        width: '300px',
        height: '90px',
        fontSize: '30px',
    },

    userText: {
        marginTop: '230px',
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
        width: '210px',
        height: '150px',
        borderRadius: '50%',
        marginBottom: '150px',
        marginTop: '290px',
    },
    
    submitButtonText: {
        fontSize: '30px',
        marginTop: '20px',
        marginLeft: '16px',
    }
})