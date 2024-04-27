import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, Keyboard, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TickAnimation from './TickAnimation';
import checkMobileNumberInDB from '../../../sanity';
import { fetchDataAndAddToSanityFromRetailer, updateProductQuantity } from '../../../sanity';

const CashPayment = ({ route }) => {
    let { total, scanneditem, mobileNumber } = route.params;
    const [amountGiven, setAmountGiven] = useState('');
    const [amountToGiveBack, setAmountToGiveBack] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation();

    const calculateAmountToGiveBack = () => {
        const amountGivenNumeric = parseFloat(amountGiven);
        if (!isNaN(amountGivenNumeric)) {
            const toGiveBack = (amountGivenNumeric - total).toFixed(2);
            setAmountToGiveBack(toGiveBack > 0 ? toGiveBack : '0.00');
        } else {
            setAmountToGiveBack('');
        }
        Keyboard.dismiss();
    };

    const handleDone = async () => {
        setShowModal(true);
        setTimeout(async () => {
            setShowModal(false);
            const uid = await checkMobileNumberInDB(mobileNumber)
            await Promise.all(scanneditem.map(async (item, index) => {
                await fetchDataAndAddToSanityFromRetailer(item, uid);
                await updateProductQuantity(item._id, item.quantity - index - 1);
            }));
            scanneditem = [];
            navigation.navigate('BottomTabRetailer', { screen: 'Billing', params: { scanneditem: scanneditem } });
        }, 3000);
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.heading}>Total Amount</Text>
                <Text style={styles.amountText}>{total}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Amount Given"
                    keyboardType="numeric"
                    value={amountGiven}
                    onChangeText={text => setAmountGiven(text)}
                />
                <TouchableOpacity onPress={calculateAmountToGiveBack} style={styles.button}>
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
                {amountToGiveBack !== '' && (
                    <View>
                        <Text style={styles.subheading}>Amount to Give Back</Text>
                        <Text style={styles.amountText}>{amountToGiveBack}</Text>
                    </View>
                )}
                <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
                    <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <TickAnimation showModal={showModal} />
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    content: {
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subheading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    amountText: {
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'orange',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    doneButton: {
        backgroundColor: 'green',
        paddingVertical: 20,
        paddingHorizontal: 50,
        borderRadius: 10,
        marginTop: 20,
    },
    doneButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default CashPayment;
