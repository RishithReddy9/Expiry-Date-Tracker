import React, { useState } from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const YourComponent = () => {
    const [eanNumbers, setEanNumbers] = useState([]);

    // Function to handle image selection
    const handleChooseImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            // Check if the selected image has a non-zero size
            if (result.fileSize === 0) {
                alert('Selected image is empty. Please choose a valid image.');
                return;
            }

            // Image selected and validated, send it to OCR.space API
            const formData = new FormData();
            formData.append('file', {
                uri: result.uri,
                name: 'image.jpg',
                type: 'image/jpeg',
            });
            formData.append('apikey', 'YK89455222688957');
            formData.append('language', 'eng');

            axios.post('https://api.ocr.space/parse/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    if (response.data && response.data.ParsedResults && response.data.ParsedResults[0]) {
                        // Extract text from the API response
                        const extractedText = response.data.ParsedResults[0].ParsedText;

                        // Extract EAN numbers from the extracted text
                        const eanPattern = /\b\d{13}\b/g;
                        const extractedEanNumbers = extractedText.match(eanPattern) || [];
                        setEanNumbers(extractedEanNumbers);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    };

    console.log(eanNumbers);
    return (
        <SafeAreaView>
            <Button title="Choose Image" onPress={handleChooseImage} />
            <Text>Extracted EAN numbers:</Text>
            {eanNumbers.map((ean, index) => (
                <Text key={index}>{ean}</Text>
            ))}
        </SafeAreaView>
    );
};

export default YourComponent;
