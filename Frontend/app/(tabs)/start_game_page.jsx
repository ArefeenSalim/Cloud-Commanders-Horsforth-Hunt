import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { useRouter } from "expo-router";
import React, { useState } from 'react';

const router = useRouter(); // Get router instance
const [text, setText] = useState('');

export default function StartGamePage() {
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: 'black', alignItems: "center" }}>
            <Text style={styles.lobbyCodeText}>Enter Your username:</Text>
        </View>
    )
}

const styles = StyleSheet.create ({
    lobbyCodeText: {
        
    }
})