import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import { getProducts } from '../../../sanity'; // Import the getProducts function
import { useNavigation } from '@react-navigation/core';

const Analytics = () => {
    const navigation = useNavigation();
    const [selectedProduct, setSelectedProduct] = useState('');
    const [productData, setProductData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [products, setProducts] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    // Function to fetch product data based on selected product
    const fetchProductData = async (productName) => {
        try {
            // Fetch product data from the API
            const products = await getProducts();
            // Find the selected product in the list of products
            const selectedProductData = products.find(product => product.name === productName);
            // Update the productData state with the fetched data
            setProductData(selectedProductData);
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };

    // useEffect hook to fetch initial product data when component mounts
    useEffect(() => {
        // Fetch initial product data
        getInitialProductData();
    }, []);

    // Function to fetch initial product data
    const getInitialProductData = async () => {
        try {
            // Fetch product data from the API
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts);
            // Set the first product as the selected product
            if (fetchedProducts.length > 0) {
                setSelectedProduct(fetchedProducts[0].name);
                // Fetch data for the first product
                fetchProductData(fetchedProducts[0].name);
            }
        } catch (error) {
            console.error('Error fetching initial product data:', error);
        }
    };

    // Function to toggle modal visibility
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    // Function to handle product selection change
    const handleProductSelect = (productName) => {
        setSelectedProduct(productName);
        fetchProductData(productName);
        toggleModal();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ marginTop: -230, marginBottom: 70, fontSize: 47, fontWeight: 'bold' }}>Analytics</Text>
            <TouchableOpacity onPress={toggleModal} style={styles.selectButton}>
                <Text style={styles.buttonText}>{selectedProduct === '' ? 'Select Product' : selectedProduct}</Text>
            </TouchableOpacity>

            {/* Modal for product selection */}
            <Modal visible={isModalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* List of products */}
                        {products.map(product => (
                            <TouchableOpacity key={product.name} onPress={() => handleProductSelect(product.name)} style={styles.productItem}>
                                <Text style={styles.productText}>{product.name}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {productData && (
                <View style={styles.progressContainer}>
                    <ProgressCircle
                        style={styles.progressCircle}
                        progress={productData.quantity / productData.price}
                        progressColor={'rgb(134, 65, 244)'}
                        startAngle={-Math.PI * 0.8}
                        endAngle={Math.PI * 0.8}
                    />
                    <View style={styles.progressTextContainer}>
                        <Text style={styles.progressText}>{`Chances of buying ${selectedProduct}: ${(productData.quantity / productData.price) * 100}%`}</Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        padding: 20,
    },
    selectButton: {
        padding: 15,
        backgroundColor: '#5BC236',
        borderRadius: 8,
        marginBottom: 30
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    productItem: {
        padding: 10,
    },
    productText: {
        fontSize: 16,
        color: '#000',
    },
    closeButton: {
        marginTop: 20,
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        color: '#00BFFF',
        fontSize: 16,
    },
    progressContainer: {
        marginTop: 20,
    },
    progressCircle: {
        height: 200,
    },
    progressTextContainer: {
        alignItems: 'center',
    },
    progressText: {
        fontSize: 18,
        marginTop: 10,
    },
});

export default Analytics;