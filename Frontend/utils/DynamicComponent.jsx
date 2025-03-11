import React from "react";
import { View, Text, StyleSheet, TextInput} from 'react-native'

const DynamicComponent = (props) => {
    return(
        <View>
            <Text style={styles.h2}>Player</Text>
            <Text style={styles.text}>{props.title}</Text>
            <Text style={styles.h2}>Colour</Text>
            <Text style={styles.text}>{props.content}</Text>
            <Text style={styles.h2}>Player ID</Text>
            <Text style={styles.text}>{props.playerId}</Text>
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