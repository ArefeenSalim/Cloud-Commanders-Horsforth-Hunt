// Grid.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const colourMapping = {
  yellow: 'yellow',
  green: 'green',
  red: 'red',
  black: 'black',
  x2: '#ff6347',
  null: 'Orange',
};

const Grid = ({ fetchDrXMoveHis, boxesData }) => {
    console.log("Grid received boxesData:", boxesData);
  
    const renderBoxes = () => {
      return boxesData.map((box, index) => {
        console.log(`Rendering Box ${index}:`, box); // Properly logging each item
  
        const backgroundColor = box.ticketType
        ? colourMapping[box.ticket] || "gray"
        : "orange";

        return (
          <TouchableOpacity
            key={box.round}
            style={[styles.box, { backgroundColor }]}
          >
            <Text>{box.round}</Text>
            {box.text ? <Text style={styles.boxText}>{box.text}</Text> : null}
          </TouchableOpacity>
        );
      });
    };
  
    return <View style={styles.gridContainer}>{renderBoxes()}</View>;
}

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
