import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Barcode } from 'expo-barcode-generator';
import * as Print from 'expo-print';
import { fetchDataAndAddToSanityNewBarcode, fetchDataAndAddToSanityNewBarcodeManual, uploadImageToSanityDirect } from '../../../sanity';
import { TextInput } from 'react-native-paper';

const ManualEntryGenerator = ({ route }) => {
    const { name, expiryDate, nutritionalInfo, quantity } = route.params;
    const [barcodeData, setBarcodeData] = useState(generateRandomUPC());
    let [price, setPrice] = useState('');
    price = parseInt(price)

    function generateRandomUPC() {
        let randomUPC = '';
        for (let i = 0; i < 11; i++) {
            randomUPC += Math.floor(Math.random() * 10);
        }

        // Calculate the check digit
        let oddSum = 0;
        let evenSum = 0;
        for (let i = 0; i < randomUPC.length; i++) {
            if (i % 2 === 0) {
                oddSum += parseInt(randomUPC[i], 10);
            } else {
                evenSum += parseInt(randomUPC[i], 10);
            }
        }
        let totalSum = oddSum * 3 + evenSum;
        let checkDigit = (10 - (totalSum % 10)) % 10;

        return randomUPC + checkDigit;
    }

    // Function to generate a new barcode with details
    const generateBarcode = async () => {
        const newBarcodeData = generateRandomUPC();
        setBarcodeData(newBarcodeData);
        const imgURL = await uploadImageToSanity('https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg')
        console.log(imgURL);
        await fetchDataAndAddToSanityNewBarcodeManual(name, newBarcodeData, price, expiryDate, imgURL, quantity); // Pass price to the database
    };

    const printBarcode = async () => {
        try {
            const options = {
                html: `<img src="data:image/png;base64,${barcodeData}" />`,
            };
            await Print.printAsync(options);
        } catch (error) {
            console.error('Error printing barcode:', error);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Barcode Generator</Text>
            <TextInput
                label="Price"
                value={price}
                onChangeText={text => setPrice(text)} // Update price state
                style={styles.input}
            />
            <View style={styles.buttonContainer}>
                <Button title="Generate Barcode" onPress={generateBarcode} />
            </View>
            <View style={styles.barcodeContainer}>
                <Barcode value={barcodeData} format="CODE_128" options={{ format: 'UPC', background: 'lightblue' }} width={300} height={100} />
            </View>
            <TouchableOpacity><Text></Text></TouchableOpacity>
            <View style={styles.buttonContainer}>
                <Button title="Print Barcode" onPress={printBarcode} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    buttonContainer: {
        marginBottom: 20,
    },
    barcodeContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    productDetails: {
        marginTop: 20,
    },
    input: {
        width: '100%', // Set input width to full width
        marginBottom: 20, // Add margin bottom for spacing
    },
});

export default ManualEntryGenerator;
