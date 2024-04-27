import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Bill from './Bill';

const Billing = ({ route }) => {
    const { scanneditem } = route.params;
    const [total, setTotal] = useState(0);
    const [mobileNumber, setMobileNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const handlePay = () => {
        // Validate mobile number and payment method
        if (mobileNumber.trim() === '') {
            alert('Please enter your mobile number.');
            return;
        }
        if (paymentMethod === '') {
            alert('Please select a payment method.');
            return;
        }
        // Perform payment logic here (e.g., submit payment)
        console.log(`Mobile Number: ${mobileNumber}, Payment Method: ${paymentMethod}`);
        if (paymentMethod === 'cash') {
            navigation.navigate('Cash', { total, scanneditem, mobileNumber });
        }
        if (paymentMethod === 'online') {
            navigation.navigate('Online', { total, scanneditem, mobileNumber });
        }
        // Close the modal
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Bill scanneditem={scanneditem} total={total} setTotal={setTotal} />
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>To Pay: {total}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('BillingScanner', { scanneditem: scanneditem })} style={styles.addButton}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.payButton}>
                    <Text style={styles.buttonText}>Pay</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Mobile Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Mobile Number"
                            onChangeText={text => setMobileNumber(text)}
                            keyboardType="phone-pad"
                        />
                        <View style={styles.paymentOptions}>
                            <TouchableOpacity onPress={() => setPaymentMethod('cash')} style={styles.paymentOption}>
                                <Text style={styles.paymentOptionText}>Cash</Text>
                                {/* Add cash icon */}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setPaymentMethod('online')} style={styles.paymentOption}>
                                <Text style={styles.paymentOptionText}>Online</Text>
                                {/* Add online payment icon */}
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={handlePay} style={styles.payButton}>
                            <Text style={styles.buttonText}>Pay Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    addButton: {
        backgroundColor: 'lightblue',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,

        marginTop: 10,
    },
    payButton: {
        backgroundColor: 'orange',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    paymentOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    paymentOption: {
        alignItems: 'center',
    },
    paymentOptionText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Billing;
