import React from "react";
import { View, Text, StyleSheet, TextInput} from 'react-native'

const DynamicComponent = (props) => {
    return(
        <div>
            <h1>Player</h1>
            <textarea>{props.title}</textarea>
            <br></br>
            <h1>Game ID</h1>
            <textarea>{props.content}</textarea>
        </div>
    );
};

export default DynamicComponent;