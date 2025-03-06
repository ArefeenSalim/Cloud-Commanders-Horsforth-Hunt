import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MapPage = () => {
  const handlePress1 = () => {
    console.log('Button 1 Pressed');
  };

  const handlePress2 = () => {
    console.log('Button 2 Pressed');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress1}>
        <Text style={styles.buttonText}>Dr X movements</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handlePress2}>
        <Text style={styles.buttonText}>Tickets</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#DDDD91',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapPage;