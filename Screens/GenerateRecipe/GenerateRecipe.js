import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigation } from '@react-navigation/core';

const RecipeGenerator = () => {
    const [keyword, setKeyword] = useState('');
    const [recipe, setRecipe] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const genAI = new GoogleGenerativeAI('AIzaSyA5UDNPSGVazIwfbuLKfzV090ebPwSDzTQ');


    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const generateRecipe = async () => {
        try {
            setIsLoading(true);

            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const prompt = `Give a Recipe with these ingredients only and donot include any other ingredients: ${keyword} with Recipe name, Ingredients, Instructions, Tips`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const formattedRecipe = text
                .replace(/(?<=\n)([A-Z].*?)(?=\n)/g, (match) => `<b>${match}</b>`)
                .replace(/[*]/g, '')

            setRecipe(formattedRecipe);
        } catch (error) {
            console.error('Error generating recipe:', error);
            setRecipe('Error generating recipe');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.heading}>Recipe Generator</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Ingredients available..."
                    value={keyword}
                    onChangeText={setKeyword}
                />
                <Button title="Generate Recipe" onPress={generateRecipe} />
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={styles.loadingText}>Generating recipe...</Text>
                    </View>
                ) : (
                    <ScrollView style={styles.recipeContainer}>
                        <Text style={styles.recipeText}>{recipe}</Text>

                    </ScrollView>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    loadingText: {
        fontSize: 16,
        marginTop: 10,
    },
    recipeContainer: {
        marginTop: 20,
        width: '80%',
    },
    recipeText: {
        fontSize: 16,
        textAlign: 'left',
    },
    boldText: {
        fontWeight: 'bold',
    },
});

export default RecipeGenerator;
