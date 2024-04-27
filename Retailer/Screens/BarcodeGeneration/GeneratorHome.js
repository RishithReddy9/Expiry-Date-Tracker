import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/core';

const GeneratorHome = () => {
    const Navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => Navigation.navigate('BarcodeGenerationScanner')}><Text style={styles.buttonText}>Scan the code</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => Navigation.navigate('ManualEntry')}><Text style={styles.buttonText}>Enter details manually</Text></TouchableOpacity>
            <Text style={styles.note}>(When there is no barcode available use this feature)</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    button: {
        width: '100%',
        backgroundColor: '#ccc',
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    note: {
        marginTop: 20,
        fontSize: 14,
        textAlign: 'center',
    },
});

export default GeneratorHome;
