import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Touchable, TouchableOpacity } from 'react-native';
import { getProducts } from '../../../sanity';
import imageUrlBuilder from '@sanity/image-url';
import { createClient } from '@sanity/client';
import { useNavigation } from '@react-navigation/core';

const client = createClient({
    projectId: '6snf0jry',
    dataset: 'production',
    token: 'skii7Flc38cgUy5JYSz3hfPNFzIsi8oKitHUGoVNlB94xDREXPWcqrPrknZG79KtD0zfjza9rl6SY1Nyz3yjojhHNOlBn6Q0u40ySXAQt0GwbOxsHYB2qn6jXsH4cGi8faiHmgkfIU8i0WfjKhC89djQjYgw92mBMDcyL1QTGw8NMZLIixuu',
    useCdn: false,
    apiVersion: '2021-10-21',
});

const builder = imageUrlBuilder(client);

function urlFor(source) {
    return builder.image(source);
}

const BarcodeGenerationDisplay = ({ route }) => {
    const Navigation = useNavigation();
    const { barcode } = route.params;
    const [product, setProduct] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getProducts();
            const foundProduct = products.find(product => product.barcode === barcode);
            setProduct(foundProduct);
            if (foundProduct) {
                const url = urlFor(foundProduct.image).url();
                setImgUrl(url);
            }
        };

        fetchProducts();
    }, [barcode]);

    return (
        <View style={styles.container}>

            <Text style={styles.heading}>Know Your Expiry Date</Text>
            {product ? (
                <View style={styles.productContainer}>
                    {imgUrl && <Image source={{ uri: imgUrl }} style={styles.image} />}
                    <Text style={styles.title}>{product.name}</Text>
                    <Text style={styles.description}>Price: ${product.price}</Text>
                    <Text style={styles.description}>Expiry: {product.date}</Text>
                </View>
            ) : (
                <Text style={styles.noProduct}>Product not found</Text>
            )}
            <TouchableOpacity onPress={() => Navigation.navigate('BarcodeGenerator', { product: product })}><Text>Continue</Text></TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 5,
        width: '80%',
        alignItems: 'center',
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
        marginBottom: 5, // Increased bottom margin for spacing
    },
    noProduct: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red',
    },
    image: {
        width: 140,
        height: 140,
        borderRadius: 8,
        marginBottom: 10, // Increased bottom margin for spacing
    },
});

export default BarcodeGenerationDisplay;
