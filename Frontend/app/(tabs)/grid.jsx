// Grid.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const colourMapping = {
  yellow: 'yellow',
  green: 'green',
  red: 'red',
  black: 'black',
  x2: '#ff6347'
};

const Grid = ({ fetchDrXMoveHis, boxesData }) => {
    return (
      <View style={styles.gridContainer}>
        {boxesData.map((box) => (
          <TouchableOpacity
            key={box.round}
            style={[styles.box, { backgroundColor: colourMapping[box.ticketType] || 'gray' }]}
          >
            {box.destination ? <Text style={styles.boxText}>{box.destination}</Text> : null}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',  
    justifyContent: 'space-between',  
  },
  box: {
    width: '30%',  
    height: 100,  
    marginBottom: 10,  
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  boxText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Grid;
