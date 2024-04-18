import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getRecipes } from '../../sanity'; // Replace with your function to fetch recipes
import * as ImagePicker from 'expo-image-picker'; // For image picking
import { uploadImageToSanity } from '../../sanity'; // Replace with your function to upload images


export default RecipesCommunity = () => {
    const [recipes, setRecipes] = useState([]);
    const [image, setImage] = useState(null);

    const fetchRecipes = async () => {
        try {
            const fetchedRecipes = await getRecipes();
            setRecipes(fetchedRecipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to access your photos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const handleUploadImage = async () => {
        if (!image) {
            alert('Please select an image to upload.');
            return;
        }

        try {
            const uploadedImageUrl = await uploadImageToSanity(image);
            console.log('Uploaded image URL:', uploadedImageUrl);
            setImage(null);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const renderRecipe = ({ item }) => (
        <View style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>{item.description}</Text>
            {/* Add recipe image and other details here */}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={recipes}
                renderItem={renderRecipe}
                keyExtractor={item => item._id}
            />
            <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
                <MaterialIcons name="add-a-photo" size={24} color="white" />
            </TouchableOpacity>
            {image && (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: image }} style={styles.previewImage} />
                    <TouchableOpacity style={styles.uploadConfirmButton} onPress={handleUploadImage}>
                        <Text style={styles.uploadConfirmText}>Upload</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    recipeCard: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    uploadButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 50,
    },
    previewContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        alignItems: 'center',
    },
    previewImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
        borderRadius: 5,
    },
    uploadConfirmButton: {
        backgroundColor: '#2ecc71',
        padding: 1
    }
});