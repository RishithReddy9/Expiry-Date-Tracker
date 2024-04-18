import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import { useNavigation } from '@react-navigation/core';

const firebaseConfig = {
    apiKey: "AIzaSyDMY-IvKWMtjZ-RZZ-vuryi5uMNbykERFM",
    authDomain: "fir-auth-tutorial-161e3.firebaseapp.com",
    projectId: "fir-auth-tutorial-161e3",
    storageBucket: "fir-auth-tutorial-161e3.appspot.com",
    messagingSenderId: "3174772332",
    appId: "1:3174772332:web:2bb5d10e4de61c1af9b249",
    measurementId: "G-27MQD5QL5V"
};

const app = initializeApp(firebaseConfig);

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
    return (
        <View style={styles.authContainer}>
            <Image source={require('../../login.jpg')} style={styles.logo} />
            <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                </Text>
            </View>
        </View>
    );
}

const AuthenticatedScreen = ({ user, handleAuthentication }) => {
    const navigation = useNavigation();
    navigation.navigate('Main')
    return (
        <View style={styles.authContainer}>
            {/* <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" /> */}
        </View>
    );
};

export default Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null); // Track user authentication state
    const [isLogin, setIsLogin] = useState(true);

    const auth = getAuth(app);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, [auth]);

    const handleAuthentication = async () => {
        try {
            if (user) {
                // If user is already authenticated, log out
                console.log('User logged out successfully!');
                await signOut(auth);
            } else {
                // Sign in or sign up
                if (isLogin) {
                    // Sign in
                    await signInWithEmailAndPassword(auth, email, password);
                    console.log('User signed in successfully!');
                    console.log(auth.currentUser.uid);
                } else {
                    // Sign up
                    await createUserWithEmailAndPassword(auth, email, password);
                    console.log('User created successfully!');
                }
            }
        } catch (error) {
            console.error('Authentication error:', error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {user ? (
                // Show user's email if user is authenticated
                <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
            ) : (
                // Show sign-in or sign-up form if user is not authenticated
                <AuthScreen
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                    handleAuthentication={handleAuthentication}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 4,
    },
    buttonContainer: {
        marginBottom: 16,
    },
    toggleText: {
        color: '#3498db',
        textAlign: 'center',
    },
    bottomContainer: {
        marginTop: 20,
    },
    emailText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    logo: {
        height: 320,
        width: 270
    }
});
