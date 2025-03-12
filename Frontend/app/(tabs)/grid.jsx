// Grid.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import PropTypes from 'prop-types';

const colourMapping = {
  Yellow: 'yellow',
  Green: 'green',
  Red: 'red',
  Black: 'black',
  x2: '#ff6347',
  null: 'gray',
};
const textColourMapping = {
  Yellow: 'black',
  Green: 'white',
  Red: 'black',
  Black: 'white',
  x2: 'black',
  null: 'black',
};

const Grid = ({ fetchDrXMoveHis, boxesData }) => {
    console.log("Grid received boxesData:", boxesData);
  
    const renderBoxes = () => {
      return boxesData.map((box, index) => {
        console.log(`Rendering Box ${index}:`, box); // Properly logging each item
  
        const backgroundColor = box.ticket
        ? colourMapping[box.ticket] || "orange"
        : "gray";

        const textColour = box.ticket
        ? textColourMapping[box.ticket] || "black"
        : "black";

        return (
          <TouchableOpacity
            key={box.moveId}
            style={[styles.box, { backgroundColor }]}
          >
            <Text style={[styles.boxText, {color: textColour}]}>{box.round}</Text>
            {box.text ? <Text style={[styles.boxText, {color: textColour}]}>{box.text}</Text> : null}
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
    aspectRatio: 1,
    height: 'fill',
    marginBottom: 10,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  boxText: {
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Grid;
