import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Button, TextInput, ScrollView, Alert } from 'react-native';
import * as Location from 'expo-location';

export default function DonateNow() {
    const [mapRegion, setMapRegion] = useState({
        latitude: 17.725958483909587,
        longitude: 78.25504833115401,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [errorMsg, setErrorMsg] = useState(null);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [foodItem, setFoodItem] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        getUserLocation();
    }, []);

    const getUserLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({
                enableHighAccuracy: true,
            });
            setMapRegion((prevRegion) => ({
                ...prevRegion,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            }));
            console.log(location.coords.latitude, location.coords.longitude);
        } catch (error) {
            console.error('Error getting user location:', error);
            setErrorMsg('Error getting user location');
        }
    };

    const handleDonateNow = () => {
        if (!name || !phoneNumber || !foodItem || !address) {
            setErrorMsg('Please fill in all the fields');
        }
        else {
            Alert.alert('Donation Submitted', 'Thank you for your donation. We will contact you soon.');
            // Clear form fields
            setName('');
            setPhoneNumber('');
            setFoodItem('');
            setAddress('');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>DONATION</Text>
                    <Text style={styles.subtitle}>Give what you can</Text>
                </View>

                <MapView style={styles.map} region={mapRegion}>
                    <Marker coordinate={mapRegion} title='Marker' />
                </MapView>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>User Details</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    {!name && <Text style={styles.errorMsg}>*Name is required</Text>}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                        />
                        {phoneNumber && !/^\d{10}$/.test(phoneNumber) && <Text style={styles.errorMsg}>*Please enter a valid 10-digit phone number</Text>}
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Food Item Title"
                        value={foodItem}
                        onChangeText={setFoodItem}
                    />
                    {!foodItem && <Text style={styles.errorMsg}>*Food Item Title is required</Text>}
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        value={address}
                        onChangeText={setAddress}
                    />
                    {!address && <Text style={styles.errorMsg}>*Address is required</Text>}
                    <Button
                        title="Donate Now"
                        onPress={handleDonateNow}
                        style={styles.donateButton}
                    />

                </View>

                {errorMsg ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    donateButton: {
        backgroundColor: '#007bff',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
    },
    scrollViewContainer: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 5,
    },
    map: {
        width: '100%',
        height: 300,
        marginBottom: 20,
    },
    errorMsg: {
        color: 'red',
        fontSize: 12,
    },
});