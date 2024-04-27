import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import * as Speech from 'expo-speech';

const SpeechRecognition = () => {
    const speaks = () => {
        const thingToSay = 'Hello';
        console.log('Speaking:', thingToSay);
        const options = {
            voice: { // Define voice options directly under "voice" property
                identifier: "en-US-default", language: "en-US", name: "en-US-default", quality: "Default"
            },
        };
        Speech.speak(thingToSay);
    };

    return (
        <View style={styles.container}>
            <Button title="Press to hear some words" onPress={speaks} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
});

export default SpeechRecognition;
