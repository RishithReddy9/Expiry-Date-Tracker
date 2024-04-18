import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Image } from 'react-native';

const ProfileCard = () => {
    const [username, setUsername] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [age, setAge] = useState('');
    const [showSavedMessage, setShowSavedMessage] = useState(false);
    const profileImageUrl = 'https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1711899908~exp=1711903508~hmac=36f47a2b74da57f7456cf692c0c29f1cc797d10820dd1496ce2f2b5daccd53f6&w=740'; // Replace with your image URL

    const saveProfile = () => {
        if (!username || !mobileNumber || !age) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setShowSavedMessage(true);
        Alert.alert('Profile Saved', 'Profile saved successfully!', [
            { text: 'OK', onPress: () => setShowSavedMessage(false) },
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.profilePictureContainer}>
                    <Image
                        source={require('../../profile.jpg')}
                        style={styles.profilePicture}
                        resizeMode="cover"
                    />
                </View>
                <View style={styles.profileHeader}>
                    <Text style={styles.profileHeaderText}>My Profile</Text>
                </View>
                <View style={styles.profileInfo}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputTitle}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter username"
                            value={username}
                            onChangeText={setUsername}
                            editable={!showSavedMessage}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputTitle}>Mobile Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter mobile number"
                            keyboardType="phone-pad"
                            value={mobileNumber}
                            onChangeText={setMobileNumber}
                            editable={!showSavedMessage}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputTitle}>Age</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter age"
                            keyboardType="numeric"
                            value={age}
                            onChangeText={setAge}
                            editable={!showSavedMessage}
                        />
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    {!showSavedMessage && (
                        <Button
                            title="Save"
                            onPress={saveProfile}
                            color="#3498db"
                            disabled={showSavedMessage}
                            style={{ fontSize: 20 }}
                        />
                    )}
                </View>
            </View>
            {showSavedMessage && (
                <View style={styles.savedMessage}>
                    <Text style={styles.savedMessageText}>Profile Saved Successfully!</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FDF5E6', // Cream color background
    },
    profileContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profilePictureContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 80,
    },
    profileHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
        marginBottom: 20,
    },
    profileHeaderText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileInfo: {
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputTitle: {
        fontSize: 16,
        marginBottom: 5,
        color: '#222',
        fontWeight: 'bold', // Make title bold
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    savedMessage: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: 'rgba(52, 152, 219, 0.8)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    savedMessageText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ProfileCard;