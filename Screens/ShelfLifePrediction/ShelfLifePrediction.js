import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Modal, TextInput } from 'react-native';

const ShelfLifePredictor = () => {
    const [ratings, setRatings] = useState({
        color: 0,
        texture: 0,
        odor: 0,
        storage: 0
    });
    let explanations3 = [];

    const [selectedCategory, setSelectedCategory] = useState('leafy');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const selectStar = (question, value) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [question]: value
        }));
    };

    const explanations = [
        "Poor (Significant discoloration, wilting, or browning)",
        "Fair (Some discoloration or wilting)",
        "Average (Normal coloration with minimal wilting)",
        "Good (Fresh appearance with no noticeable browning or wilting)",
        "Excellent (Vibrant green color and crisp texture)"
    ];

    const explanations2 = [
        "Strong Off-Odor (Strong unpleasant odor)",
        "Mild Off-Odor (Slight off-putting smell)",
        "Neutral (No distinct odor)",
        "Mild Fresh Odor (Slight fresh aroma)",
        "Strong Fresh Odor (Strong fresh aroma)"
    ];

    const explanations1 = [
        "Very Soft (Extremely wilted, limp)",
        "Soft (Wilted with some crispness remaining)",
        "Average (Moderate crispness and firmness)",
        "Firm (Crisp with minimal wilting)",
        "Very Firm (Extremely crisp and firm)"
    ];

    if (selectedCategory == 'leafy') {
        explanations3 = [
            "Poor (Improperly stored, exposed to heat or moisture)",
            "Fair (Somewhat controlled storage conditions)",
            "Average (Stored in a refrigerator or cool environment)",
            "Good (Stored in optimal conditions with controlled temperature and humidity)",
            "Excellent (Stored in vacuum-sealed or controlled atmosphere packaging)"
        ]
    } else if (selectedCategory == 'citrus') {
        explanations3 = [
            "Poor (Rough or damaged skin, indicating poor quality or decay)",
            "Fair (Some minor blemishes or spots on the skin, suggesting moderate quality)",
            "Average (Mostly smooth skin with a few minor blemishes, indicating typical quality)",
            "Good (Smooth skin with minimal blemishes, suggesting good quality)",
            "Excellent (Perfectly smooth and flawless skin, indicating excellent quality)"
        ]
    } else if (selectedCategory == 'potato') {
        explanations3 = [
            "Significant sprouting or new growth, indicating potential overripeness or poor storage conditions",
            "Some minor sprouting, suggesting moderate ripeness",
            "No sprouting, indicating typical ripeness",
            "No sprouting, but slight indications of new growth, suggesting good freshness",
            "No sprouting or signs of new growth, indicating excellent freshness"
        ]
    }

    const weights = {
        leafy: {
            color: 0.4,
            texture: 0.3,
            odor: 0.2,
            storage: 0.1
        },
        citrus: {
            color: 0.25,
            texture: 0.25,
            odor: 0.25,
            storage: 0.25
        },
        potato: {
            color: 0.3,
            texture: 0.25,
            odor: 0.2,
            storage: 0.25
        },
    };

    const predictShelfLife = () => {
        let overallScore = 0;
        Object.keys(ratings).forEach(question => {
            overallScore += ratings[question] * weights[selectedCategory][question];
        });
        let maxShelfLife = 0;
        if (selectedCategory == 'leafy') {
            maxShelfLife = 7;
        } else if (selectedCategory == 'citrus') {
            maxShelfLife = 14;
        }
        const remainingShelfLife = Math.round(maxShelfLife * (overallScore / 5));
        return remainingShelfLife;
    };

    const renderDropdown = () => {
        return (
            <Modal visible={isModalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => toggleModal('')}>
                            <Text style={styles.categoryText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectCategory('leafy')}>
                            <Text style={styles.categoryText}>Leafy Vegetables</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectCategory('citrus')}>
                            <Text style={styles.categoryText}>Citrus Fruits</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectCategory('potato')}>
                            <Text style={styles.categoryText}>Root</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const selectCategory = (category) => {
        setSelectedCategory(category);
        setIsModalVisible(false);
    };

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity style={styles.dropdownButton} onPress={toggleModal}>
                    <Text style={styles.dropdownButtonText}>{selectedCategory === '' ? 'Select Category' : selectedCategory}</Text>
                </TouchableOpacity>
                {selectedCategory !== 'potato' && (
                    <View>
                        <Text style={{ fontSize: 20 }}>Enter {selectedCategory} {selectedCategory === 'citrus' ? 'Fruit' : 'Vegetable'}:</Text>
                        <TextInput
                            style={{ height: 40, width: '100%', borderWidth: 1, borderRadius: 14, padding: 10, marginBottom: 20, marginTop: 7 }}
                        />
                    </View>
                )}<View style={styles.question}>
                    <Text style={styles.questionText}>Color and Appearance:</Text>
                    <View style={styles.stars}>
                        {[1, 2, 3, 4, 5].map((value, index) => (
                            <TouchableOpacity key={index} onPress={() => selectStar('color', value)}>
                                <Text style={[styles.star, value <= ratings.color && styles.activeStar]}>★</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.explanation}>{explanations[ratings.color - 1]}</Text>
                </View>
                <View style={styles.question}>
                    <Text style={styles.questionText}>Texture and Firmness:</Text>
                    <View style={styles.stars}>
                        {[1, 2, 3, 4, 5].map((value, index) => (
                            <TouchableOpacity key={index} onPress={() => selectStar('texture', value)}>
                                <Text style={[styles.star, value <= ratings.texture && styles.activeStar]}>★</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.explanation}>{explanations1[ratings.texture - 1]}</Text>
                </View>

                <View style={styles.question}>
                    <Text style={styles.questionText}>Odor:</Text>
                    <View style={styles.stars}>
                        {[1, 2, 3, 4, 5].map((value, index) => (
                            <TouchableOpacity key={index} onPress={() => selectStar('odor', value)}>
                                <Text style={[styles.star, value <= ratings.odor && styles.activeStar]}>★</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.explanation}>{explanations2[ratings.odor - 1]}</Text>
                </View>

                <View style={styles.question}>
                    <Text style={styles.questionText}>Storage Conditions:</Text>
                    <View style={styles.stars}>
                        {[1, 2, 3, 4, 5].map((value, index) => (
                            <TouchableOpacity key={index} onPress={() => selectStar('storage', value)}>
                                <Text style={[styles.star, value <= ratings.storage && styles.activeStar]}>★</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.explanation}>{explanations3[ratings.storage - 1]}</Text>
                </View>

                <TouchableOpacity style={styles.predictButton} onPress={predictShelfLife}>
                    <Text style={styles.buttonText}>Predict Remaining Shelf Life</Text>
                    <Text style={styles.remainingDaysText}>{predictShelfLife()} days</Text>
                </TouchableOpacity>

                {renderDropdown()}
            </ScrollView>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    dropdownButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
    dropdownButtonText: {
        fontSize: 16,
    },
    question: {
        marginBottom: 20,
    },
    questionText: {
        fontWeight: 'bold',
        marginBottom: 10,
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
    categoryText: {
        fontSize: 18,
        marginBottom: 10,
    },
    predictButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    remainingDaysText: {
        color: 'white',
        fontSize: 20,
        marginTop: 5,
    },
    question: {
        marginBottom: 20,
    },
    questionText: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    stars: {
        flexDirection: 'row',
    },
    star: {
        fontSize: 25,
        color: '#ccc',
        marginRight: 5,
    },
    activeStar: {
        color: '#ffcc00',
    },
    explanation: {
        fontSize: 14,
        marginTop: 5,
        color: '#666',
    },
    predictButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    }
});

export default ShelfLifePredictor;
