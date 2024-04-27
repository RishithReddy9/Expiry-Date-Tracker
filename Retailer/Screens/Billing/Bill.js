import { View, StyleSheet, Text } from 'react-native';
import React, { useEffect } from 'react';
import BillLayout from './BillLayout';

const Bill = ({ scanneditem, total, setTotal }) => {
    let change = false;
    let newTotal = 0;
    if (scanneditem && scanneditem.length > 0) {
        newTotal = scanneditem.reduce((accumulator, currentItem) => accumulator + currentItem.price, 0);
    }
    if (newTotal > total || newTotal < total) {
        change = true;
    }
    useEffect(() => {
        setTotal(newTotal);
    }, [change]);

    return (
        <View>
            <View>
                {scanneditem && scanneditem.map((item, index) => (
                    <BillLayout key={item._id} scanneditem={item} index={index} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fabStyle: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default Bill;
