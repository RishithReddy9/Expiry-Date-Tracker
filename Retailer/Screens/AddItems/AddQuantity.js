import React, { useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, StyleSheet } from 'react-native';
import { fetchDataAndAddToSanityRetailer } from '../../../sanity';
import { useNavigation } from '@react-navigation/core';

const AddQuantity = ({ route }) => {
    const { barcodeData, date } = route.params;
    const navigation = useNavigation();
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const handleAdd = () => {
        const scanneditem = [];
        const quantityNumber = parseInt(quantity);
        const priceNumber = parseFloat(price);

        // Call function to fetch data and add to Sanity retailer
        fetchDataAndAddToSanityRetailer(barcodeData, date, quantityNumber, priceNumber);
        navigation.navigate('BottomTabRetailer', { scanneditem: scanneditem })
        // Reset input fields
        setQuantity('');
        setPrice('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Add Quantity and Price</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Quantity"
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Price"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />
                <Button title="Add" onPress={handleAdd} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        fontSize: 16,
    },
});

export default AddQuantity;