// Grid.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import PropTypes from 'prop-types';

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

    // const withinList = () => {
    //   return (
    //     <FlatList
    //     numColumns={3}
    //     />
    //   )
    // }
  
    return (
    <View style={styles.gridContainer}>
      {renderBoxes()}
    </View>
    )}

Grid.propTypes = {
  fetchDrXMoveHis: PropTypes.func,
  boxesData: PropTypes.object,
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',  
    justifyContent: 'space-between',  
    flex: 1,  // Allow it to resize properly
    width: '100%',
    height: '100%',
  },
  box: {
    width: '30%',  
    flexGrow: 1,
    height: 'fill',
    marginBottom: 10,
    marginRight: 5,
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
