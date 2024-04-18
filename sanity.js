import axios from 'axios';
import { createClient } from "@sanity/client";
import ImageUrlBuilder from "@sanity/image-url";

const client = createClient({
    projectId: '6snf0jry',
    dataset: 'production',
    token: 'skii7Flc38cgUy5JYSz3hfPNFzIsi8oKitHUGoVNlB94xDREXPWcqrPrknZG79KtD0zfjza9rl6SY1Nyz3yjojhHNOlBn6Q0u40ySXAQt0GwbOxsHYB2qn6jXsH4cGi8faiHmgkfIU8i0WfjKhC89djQjYgw92mBMDcyL1QTGw8NMZLIixuu',
    useCdn: false,
    apiVersion: '2021-10-21',
});

export async function getItems(currentUserUID) {
    const items = await client.fetch('*[_type == "items"]');
    return items;
}

const builder = ImageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);

async function fetchExpiryDate(itemId) {
    try {
        const item = await client.getDocument(itemId);
        if (item && item.date) {
            return item.date;
        } else {
            console.error('Item not found or does not have a date:', itemId);
            return null;
        }
    } catch (error) {
        console.error('Error fetching expiry date from Sanity:', error);
        throw error;
    }
}

// Function to schedule push notification
async function schedulePushNotification(expiryDate) {
    // Calculate the date 7 days before the expiry date
    const sevenDaysBeforeExpiry = new Date(expiryDate);
    sevenDaysBeforeExpiry.setDate(sevenDaysBeforeExpiry.getDate() - 7);

    // Schedule push notification if the expiry date is after 7 days from today
    if (sevenDaysBeforeExpiry > new Date()) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Your item is expiring soon!",
                body: `Your item will expire in 7 days. Remember to check it.`,
            },
            trigger: { date: sevenDaysBeforeExpiry },
        });
    }
}

// Function to handle fetching data from API and adding to Sanity
export async function fetchDataAndAddToSanity(barcodeData, selectedDate, currentUserUID) {
    const options = {
        method: 'GET',
        url: 'https://barcodes-lookup.p.rapidapi.com/',
        params: { query: barcodeData },
        headers: {
            'X-RapidAPI-Key': '61f5d93abdmsh1291af3ef677d5fp1fbc8bjsnc627da8fddf4',
            'X-RapidAPI-Host': 'barcodes-lookup.p.rapidapi.com',
        },
    };

    try {
        // Fetch data from the API
        const response = await axios.request(options);
        const responseData = response.data;

        // Process the fetched data as needed
        const imageUrl = responseData.product.images[0];
        const uploadedImageAsset = await uploadImageToSanity(imageUrl);

        const processedData = processData(responseData, selectedDate, uploadedImageAsset);
        console.log(processedData);

        // Add the processed data to Sanity.io
        const sanityResponse = await client.create({
            _type: 'items',
            name: responseData.product.title,
            date: selectedDate.toISOString().split('T')[0],
            description: responseData.product.description,
            brand: responseData.product.brand,
            category: responseData.product.category[0],
            ingredients: responseData.product.ingredients.split(',').map(ingredient => ingredient.trim()),
            nutritionalInfo: responseData.product.nutrition_facts.split(',').map(info => info.trim()),
            uid: currentUserUID,
            // Use the uploaded image asset
            image: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: uploadedImageAsset._id,
                },
            },
        });
        console.log('Data added to Sanity:', sanityResponse);

        // Fetch expiry date from the created document in Sanity
        const expiryDate = await fetchExpiryDate(sanityResponse._id);

        // Schedule push notification based on expiry date
        await schedulePushNotification(expiryDate);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function processData(data, selectedDate, uploadedImageAsset) {
    const dateOnly = new Date(selectedDate);
    dateOnly.setHours(0, 0, 0, 0);

    const processedData = {
        _type: 'items',
        name: data.product.title,
        date: dateOnly.toISOString().split('T')[0],
        description: data.product.description,
        brand: data.product.brand,
        category: data.product.category[0],
        uid: currentUserUID,
        // Use the uploaded image asset
        image: {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: uploadedImageAsset._id,
            },
        },
    };

    return processedData;
}

// Function to handle item deletion
export async function deleteItemById(itemId, callback) {
    try {
        const response = await client.delete(itemId);
        console.log('Item deleted successfully:', response);
        callback();
        return response;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
}

async function uploadImageToSanity(imageUrl) {
    try {
        // Fetch the image from the provided URL
        const response = await fetch(imageUrl);
        const imageData = await response.blob();

        // Upload the image to Sanity.io
        const imageAsset = await client.assets.upload('image', imageData);
        console.log('Image uploaded to Sanity:', imageAsset);
        return imageAsset;
    } catch (error) {
        console.error('Error uploading image to Sanity:', error);
        throw error;
    }
}

export async function getRecipes() {
    const recipes = await client.fetch('*[_type == "recipes"]');
    return recipes;
}

export async function uploadImageToSanityDirect(imageUrl) {
    try {
        // Fetch the image from the provided URL
        const response = await fetch(imageUrl);
        const imageData = await response.blob();

        // Upload the image to Sanity.io
        const imageAsset = await client.assets.upload('image', imageData);
        console.log('Image uploaded to Sanity:', imageAsset);
        return imageAsset;
    } catch (error) {
        console.error('Error uploading image to Sanity:', error);
        throw error;
    }
}