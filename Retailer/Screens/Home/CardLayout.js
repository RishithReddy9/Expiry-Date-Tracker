import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import imageUrlBuilder from '@sanity/image-url'
import { createClient } from '@sanity/client';
import { getProducts } from '../../../sanity';

const client = createClient({
    projectId: '6snf0jry',
    dataset: 'production',
    token: 'skii7Flc38cgUy5JYSz3hfPNFzIsi8oKitHUGoVNlB94xDREXPWcqrPrknZG79KtD0zfjza9rl6SY1Nyz3yjojhHNOlBn6Q0u40ySXAQt0GwbOxsHYB2qn6jXsH4cGi8faiHmgkfIU8i0WfjKhC89djQjYgw92mBMDcyL1QTGw8NMZLIixuu',
    useCdn: false,
    apiVersion: '2021-10-21',
});

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client)

// Then we like to make a simple function like this that gives the
// builder an image and returns the builder for you to specify additional
// parameters:
function urlFor(source) {
    return builder.image(source)
}

const CardLayout = ({ items }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [discountPopupVisible, setDiscountPopupVisible] = useState(false);
    const [discountPercentage, setDiscountPercentage] = useState(0);

    const currentDate = new Date();
    const expiryDate = new Date(items.date);
    const differenceInDays = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
    const daysLeft = differenceInDays >= 0 ? differenceInDays : 0;

    let badgeBackgroundColor;
    let icon;
    let statusText;
    let tooltipText;
    if (currentDate > expiryDate) {
        badgeBackgroundColor = '#C62828';
        icon = 'error';
        statusText = 'Expired';
        tooltipText = 'This item has expired.';
    } else if (differenceInDays <= 1) {
        badgeBackgroundColor = '#FF8F00';
        icon = 'warning';
        statusText = 'Warning';
        tooltipText = 'This item is expiring soon.';
    } else if (differenceInDays <= 7) {
        badgeBackgroundColor = '#FFD600';
        icon = 'warning';
        statusText = 'Warning';
        tooltipText = 'This item is expiring within a week.';
    } else {
        badgeBackgroundColor = '#388E3C';
        icon = 'check-circle';
        statusText = 'Safe';
        tooltipText = 'This item is safe to use.';
    }

    const fetchItems = async () => {
        try {
            const itemsData = await getProducts();
            return itemsData
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const imgUrl = urlFor(items.image).url();

    const applyDiscount = () => {
        setDiscountPopupVisible(true);
    };

    const confirmDiscount = () => {
        // Calculate the discounted price
        const discountedPrice = items.price - (items.price * discountPercentage) / 100;
        // Close the discount popup
        setDiscountPopupVisible(false);
        // Update the price in the UI
        // This can be done by updating the items object or fetching the updated data
        // from the database again
    };


    return (
        <View style={styles.cardContainer}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Image source={{ uri: imgUrl }} style={styles.image} />
                    <View style={styles.cardInfo}>
                        <Text style={[styles.cardText, styles.boldText]}>Name:</Text>
                        <Text style={styles.cardText}>{items.name}</Text>
                        <Text style={[styles.cardText, styles.boldText]}>Quantity:</Text>
                        <Text style={styles.cardText}>{items.quantity}</Text>
                        <Text style={[styles.cardText, styles.boldText]}>Expiry:</Text>
                        <Text style={styles.cardText}>{items.date}</Text>
                        <Text style={[styles.cardText, styles.boldText]}>Days Left:</Text>
                        <Text style={styles.cardText}>{daysLeft}</Text>
                        <Text style={[styles.cardText, styles.boldText]}>Price:</Text>
                        {discountPercentage > 0 ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.cardText, styles.strikeThrough]}>
                                    ₹{items.price}
                                </Text>
                                <Text style={styles.cardText}>
                                    ₹{((items.price - (items.price * discountPercentage) / 100))}
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.cardText}>
                                ₹{items.price}
                            </Text>
                        )}
                    </View>
                </View>
                {expanded && (
                    <View style={styles.cardContent}>
                        <Text style={[styles.cardText, styles.boldText]}>Nutritional Information:</Text>
                        {items.nutritionalInfo.map((info, index) => (
                            <Text key={index} style={styles.cardText}>{info}</Text>
                        ))}
                    </View>
                )}
            </View>
            <View style={styles.actionRow1}>
                <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.expandButton}>
                    <MaterialIcons name={expanded ? 'expand-less' : 'expand-more'} size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={[styles.badge, { backgroundColor: badgeBackgroundColor }]}
                    onPress={() => setShowTooltip(!showTooltip)}
                >
                    <MaterialIcons name={icon} size={24} color="#FFFFFF" />
                    <Text style={[styles.iconLabel, styles.badgeLabel]}>{statusText}</Text>
                </TouchableOpacity>
            </View>
            {daysLeft <= 15 && (
                <TouchableOpacity onPress={applyDiscount} style={styles.discountButton}>
                    <Text style={styles.discountButtonText}>Apply Discount</Text>
                </TouchableOpacity>
            )}

            {/* Discount Popup/Modal */}
            {discountPopupVisible && (
                <View style={styles.discountPopup}>
                    <Text>Enter Discount Percentage:</Text>
                    <TextInput
                        style={styles.discountInput}
                        placeholder="Enter percentage"
                        value={discountPercentage.toString()}
                        onChangeText={(text) => setDiscountPercentage(parseInt(text))}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={confirmDiscount} style={styles.confirmButton}>
                        <Text style={styles.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'column',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'flex-start',
        position: 'relative',
        backgroundColor: '#CCD3CA'
    },
    card: {
        width: '100%',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#F7A6AB',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3,
        marginBottom: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    cardContent: {
        backgroundColor: '#F7F6FB',
        padding: 20,
        marginTop: 20,
        textAlign: 'center',
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    cardText: {
        fontSize: 16,
        color: '#333333',
    },
    boldText: {
        fontWeight: 'bold',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        marginRight: 10,
    },
    iconLabel: {
        marginLeft: 5,
        fontSize: 16,
        color: '#FFFFFF',
    },
    deleteButton: {
        flexDirection: 'row',
        backgroundColor: '#FF0000',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tooltip: {
        position: 'absolute',
        backgroundColor: '#333333',
        padding: 10,
        borderRadius: 8,
    },
    tooltipText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    actionRow: {
        flexDirection: 'row',
        marginBottom: 5,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    actionRow1: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    expandButton: {
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: [{ translateX: -12 }],
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 5,
    },
    badgeLabel: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 5,
        fontSize: 16,
        color: '#FFFFFF',
    },
    cardHeader: {
        backgroundColor: '#F7A6AB',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    cardInfo: {
        // Adjust spacing as needed
    },
    image: {
        width: 140, // Adjust width as needed
        height: 140, // Adjust height as needed
        borderRadius: 8,
        marginBottom: 5, // Adjust spacing as needed
    },
    discountButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    discountButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    discountPopup: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 8,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    discountInput: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 10,
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    strikeThrough: {
        textDecorationLine: 'line-through'
    }
});

export default CardLayout;
