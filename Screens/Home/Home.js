import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import Inventory from './Inventory';
import { getItems } from '../../sanity';
import { useAuth } from '../Login/AuthContext';

const Home = () => {
    const [items, setItems] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredItems, setFilteredItems] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const { user } = useAuth();

    const currentUserUID = user?.uid;

    useEffect(() => {
        navigation.navigate('Home');
    }, []);

    useEffect(() => {
        fetchItems();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const fetchItems = async () => {
        try {
            // Fetch items from Sanity
            const fetchedItems = await getItems(currentUserUID);
            setItems(fetchedItems); // Update state with fetched items
            setFilteredItems(fetchedItems); // Initially set filtered items to all items
            setIsLoading(false); // Set loading state to false after data is fetched
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = items.filter(item =>
            item.name.toLowerCase().startsWith(text.toLowerCase())
        );
        setFilteredItems(filtered);
    };

    const onRefresh = async () => {
        setRefreshing(true); // Set refreshing state to true
        try {
            // Fetch items when refreshing
            await fetchItems();
        } catch (error) {
            console.error('Error refreshing items:', error);
        } finally {
            setRefreshing(false); // Set refreshing state back to false after refresh is complete
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <Image source={require('../../logo.png')} style={styles.image} />
                <View style={styles.inputContainer}>
                    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <Path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </Svg>
                    <TextInput
                        style={styles.input}
                        placeholder="Search..."
                        value={searchText}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>
            {isLoading ? ( // Render loading animation if isLoading is true
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="blue" />
                </View>
            ) : (
                // Conditionally render Inventory component only when filteredItems is not null or empty
                filteredItems && filteredItems.length > 0 ? (
                    <ScrollView style={styles.scrollView}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }>
                        <Inventory items={filteredItems} navigation={navigation} />
                    </ScrollView>
                ) : (
                    // Render placeholder or message when filteredItems is null or empty
                    <View style={styles.placeholderContainer}>
                        <Text>No items found</Text>
                    </View>
                )
            )}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('BarcodeScanner')}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        marginHorizontal: 12,
        marginVertical: 8,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#000000',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    scrollView: {
        flex: 1,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        backgroundColor: 'blue',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 30,
        color: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Home;
