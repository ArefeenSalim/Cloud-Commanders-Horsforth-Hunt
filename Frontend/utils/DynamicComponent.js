import React from "react";
import { View, Text, StyleSheet, TextInput} from 'react-native'

const DynamicComponent = (props) => {
    return(
        <div>
            <h1>Player</h1>
            <textarea>{props.title}</textarea>
            <br></br>
            <h1>Colour</h1>
            <textarea>{props.content}</textarea>
            <br></br>
            <h1>Player ID</h1>
            <textarea>{props.playerId}</textarea>
        </div>
    );
};

export default DynamicComponent;