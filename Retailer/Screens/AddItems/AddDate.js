import React, { useState } from 'react';
import { Button, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';


export default function AddDate({ route }) {
    const { barcodeData } = route.params;
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(true);
        if (currentDate > new Date()) {
            const dateString = currentDate.toISOString().split('T')[0];
            setDate(new Date(dateString));
            setErrorMessage('');
        } else {
            setShowPicker(false);
            setErrorMessage('Please select a date in the future.');
        }
    };


    const showDatePicker = () => {
        setShowPicker(true);
    };

    const saveDate = () => {
        if (!errorMessage) {
            console.log('Barcode Data:', barcodeData);
            console.log('Selected Date:', date);
            navigation.navigate('RetailerAddQuantity', { barcodeData: barcodeData, date: date });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Scan Successful!</Text>
            <Text style={styles.subtitle}>Barcode: {barcodeData}</Text>
            <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
                <Text style={styles.buttonText}>Select Date</Text>
            </TouchableOpacity>
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
            {showPicker && (
                <View style={styles.datePickerContainer}>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                        style={styles.dateTimePicker}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={saveDate}>
                        <Text style={styles.buttonText}>Add Product</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    dateButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    datePickerContainer: {
        borderRadius: 8,
        padding: 10,
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 8,
        marginTop: 40,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
    },
    errorMessage: {
        color: 'red',
        marginBottom: 10,
    },
    dateTimePicker: {
        borderRadius: 8,
        right: 6
    },
});
