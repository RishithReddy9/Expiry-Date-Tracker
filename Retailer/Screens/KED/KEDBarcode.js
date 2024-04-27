import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function KEDBarcode() {
    const navigation = useNavigation();

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [barcodeData, setBarcodeData] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setBarcodeData(data);
        console.log(`Bar code scanned! Type: ${type}, Data: ${data}`);
        navigation.navigate('DisplayKED', { barcodeData: data });
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Requesting camera permission...</Text>
            </View>
        );
    }
    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No access to camera</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Scan the BARCODE of the product</Text>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.camera}
            >
                {scanned && <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />}
            </BarCodeScanner>
            {scanned && (
                <Text style={styles.barcodeText}>Bar code data: {barcodeData}</Text>
            )}
            <Text style={styles.titlebottom}>Point your camera at the product</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20,
    },
    titlebottom: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        marginTop: 20,
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    barcodeText: {
        fontSize: 20,
        marginTop: 20,
    },
});
