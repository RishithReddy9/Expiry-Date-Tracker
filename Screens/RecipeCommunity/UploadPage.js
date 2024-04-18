import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getRecipes, uploadImageToSanityDirect, urlFor } from '../../sanity';
import { useNavigation } from '@react-navigation/core';
import { createClient } from '@sanity/client';
import ImageUrlBuilder from '@sanity/image-url';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default RecipesScreen = () => {

    const client = createClient({
        projectId: '6snf0jry',
        dataset: 'production',
        token: 'skii7Flc38cgUy5JYSz3hfPNFzIsi8oKitHUGoVNlB94xDREXPWcqrPrknZG79KtD0zfjza9rl6SY1Nyz3yjojhHNOlBn6Q0u40ySXAQt0GwbOxsHYB2qn6jXsH4cGi8faiHmgkfIU8i0WfjKhC89djQjYgw92mBMDcyL1QTGw8NMZLIixuu',
        useCdn: false,
        apiVersion: '2021-10-21',
    });

    // Get a pre-configured url-builder from your sanity client
    const builder = ImageUrlBuilder(client)

    // Then we like to make a simple function like this that gives the
    // builder an image and returns the builder for you to specify additional
    // parameters:
    function urlFor(source) {
        return builder.image(source)
    }
    const navigation = useNavigation();
    const [recipes, setRecipes] = useState([]);
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');

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
        console.log(result);
        if (!result.cancelled) {
            setImage(result.assets[0].uri);
        }
        console.log(image);
    };

    const handleNavigateToAddRecipe = () => {
        if (!image) {
            alert('Please select an image first.');
            return;
        }
        // Navigate to AddRecipeScreen 
        navigation.navigate('AddRecipe', { image });
    };

    const handleUploadRecipe = async () => {
        if (!image || !description) {
            alert('Please select an image and add a description.');
            return;
        }

        try {
            const uploadedImageUrl = await uploadImageToSanityDirect(image);

            const newRecipe = {
                _type: 'recipes',
                image: {
                    _type: 'image',
                    asset: {
                        _ref: uploadedImageUrl._id,
                    },
                },
                description,
            };

            const response = await client.create(newRecipe);
            console.log('Recipe created:', response);

            setImage(null);
            setDescription('');

            fetchRecipes();
        } catch (error) {
            console.error('Error uploading recipe:', error);
        }
    };

    const renderRecipe = ({ item }) => {

        const imgUrl = urlFor(item.image).url();
        console.log(imgUrl);
        return (
            <View style={styles.recipeCard}>
                <Text style={styles.recipeTitle}>{item.description}</Text>
                <Image source={{ uri: imgUrl }} style={styles.image} />
            </View>
        )
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.container}>
                    <FlatList
                        data={recipes}
                        renderItem={renderRecipe}
                        keyExtractor={item => item._id}
                    />
                    <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
                        <MaterialIcons name="add-a-photo" size={24} color="white" />
                    </TouchableOpacity>
                    {image && (



                        <View style={styles.addRecipeContainer}>
                            <Image source={{ uri: image }} style={styles.previewImage} />
                            <TextInput
                                style={styles.descriptionInput}
                                multiline={true}
                                placeholder="Add recipe description"
                                value={description}
                                onChangeText={setDescription}
                            />
                            <TouchableOpacity style={styles.uploadConfirmButton} onPress={handleUploadRecipe}>
                                <Text style={styles.uploadConfirmText}>Add Recipe</Text>
                            </TouchableOpacity>
                        </View>

                    )}
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'space-around'
    },
    recipeCard: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    uploadButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#3498db',
        padding: 15,
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
        padding: 10,
        borderRadius: 5,
    },
    uploadConfirmText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    addRecipeContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    descriptionInput: {
        marginBottom: 15,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
    },
    image: {
        width: 140,
        height: 140,
        borderRadius: 8,
        marginBottom: 5,
    },
});
