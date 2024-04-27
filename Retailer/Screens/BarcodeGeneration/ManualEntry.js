import { View, Text, TouchableOpacity, StyleSheet, Platform, TextInput, Image } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/core';

const ManualEntry = () => {
    const Navigation = useNavigation();
    const [name, setName] = useState('');
    const [expiryDate, setExpiryDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [quantity, setQuantity] = useState('');

    // Function to handle date change
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || expiryDate;
        setShowDatePicker(true);
        setExpiryDate(currentDate);
    };

    // Function to show date picker
    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Manual Entry</Text>
            <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={name}
                onChangeText={text => setName(text)}
            />
            <TouchableOpacity style={styles.datePickerButton} onPress={showDatePickerModal}>
                <Text style={styles.datePickerText}>Select Expiry Date</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={expiryDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="Quantity"
                value={quantity}
                onChangeText={text => setQuantity(text)}
            />
            <View style={styles.previewContainer}>
                <TouchableOpacity onPress={() => Navigation.navigate('ManualEntryGenerator', { name: name, expiryDate: expiryDate, quantity: quantity })}>
                    <Text >Next</Text>
                </TouchableOpacity>
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
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    datePickerButton: {
        width: '100%',
        height: 50,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    datePickerText: {
        color: 'white',
        fontSize: 16,
    },
    previewImage: {
        height: 200,
        width: 200
    }
});

export default ManualEntry;
