import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const BillLayout = ({ scanneditem, index }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.itemContainer}>
                <Text style={styles.serialNumber}>{index + 1})</Text>
                <Text style={styles.itemName}>{scanneditem.name}</Text>
                <Text style={styles.itemPrice}>₹{scanneditem.price.toFixed(2)}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    serialNumber: {
        width: 30,
        textAlign: 'center',
        fontSize: 16,
    },
    itemName: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 16,
    },
});

export default BillLayout;
