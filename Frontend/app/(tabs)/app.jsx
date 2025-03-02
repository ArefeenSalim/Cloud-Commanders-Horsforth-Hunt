import { View, Text, StyleSheet } from 'react-native'
import React from 'react'


// Title Component
const title = () => {
    return (
        <Text style={styles.title}>ENTER THE LOBBY CODE</Text>
        );
    };


// App Component
const app = () => {
    return (
      <View style={styles.container}>
        <title />
      </View>
    );
  };

export default app

const styles = StyleSheet.create({
    container: {
    backgroundColor: 'black',
    width: '60%',
    margin: 'auto',
    },
    
    title: {
        color: 'black',
        fontSize: 28,
        
    }

})