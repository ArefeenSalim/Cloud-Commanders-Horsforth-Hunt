import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native'

const DynamicComponent = (props) => {

    const [targetPlayerId, settargetPlayerId] = useState(null);

    const handleTargetPlayer = (playerId) => {
        settargetPlayerId(playerId)
      }

    return(
        <View>
            <Text style={styles.h2}>Player</Text>
            <Text style={styles.text}>{props.title}</Text>
            <Text style={styles.h2}>Colour</Text>
            <Text style={styles.text}>{props.content}</Text>
            <Text style={styles.h2}>Player ID</Text>
            <Text style={styles.text}>{props.playerId}</Text>
            <TouchableOpacity onPress={handleTargetPlayer(props.playerId)}><Text>Select Player</Text></TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
text: {
    fontSize: 8,
    textAlign: 'center',
    color: '#dddd91'
  },
  h2: {
      fontSize: 8,
      backgroundColor: '#777777',
  },
})

export default DynamicComponent;