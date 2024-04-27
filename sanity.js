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

export async function getItems() {
    const items = await client.fetch('*[_type == "items"]');
    return items;
}

export async function getItemsWithUID(uid) {
    const items = await client.fetch('*[_type == "items"]');
    const products = [];
    items.map(item => {
        if (item.uid === uid) {
            products.push(item);
        }
    })
    console.log(products);
    return products;
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
        let imageUrl = responseData.product?.images[0];
        if (imageUrl == undefined) {
            imageUrl = 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'
        }
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
            nutritionalInfo: responseData.product.nutrition_facts?.split(',').map(info => info.trim()),
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

export async function fetchDataAndAddToSanityFromRetailer(item, currentUserUID) {

    try {

        const sanityResponse = await client.create({
            _type: 'items',
            name: item.name,
            date: item.date,
            description: item.description,
            brand: item.brand,
            category: item.category,
            ingredients: item.ingredients.map(value => value),
            nutritionalInfo: item.nutritionalInfo.map(value => value),
            uid: currentUserUID,
            image: item.image,
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


//Users DB
// Function to add mobile number and currentUserUID to users database
export async function addUserMobileNumberAndUID(mobileNumber, currentUserUID) {
    try {
        const user = {
            _type: 'users',
            mobilenumber: mobileNumber,
            uid: currentUserUID,
        };

        const response = await client.create(user);
        console.log('User added successfully:', response);
        return response;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}

// Function to fetch all mobile numbers from users database
export async function getAllMobileNumbers() {
    try {
        const users = await client.fetch('*[_type == "users"]');
        const uid = users.map(user => user.uid);
        console.log('UIDs:', uid);
        return uid;
    } catch (error) {
        console.error('Error fetching mobile numbers:', error);
        throw error;
    }
}





// Retailer APP Related functions and Databases

export async function fetchDataAndAddToSanityRetailer(barcodeData, selectedDate, quantity, price) {
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
            _type: 'retailproducts',
            name: responseData.product.title,
            date: selectedDate.toISOString().split('T')[0],
            description: responseData.product.description,
            brand: responseData.product.brand,
            category: responseData.product.category[0],
            ingredients: responseData.product.ingredients.split(',').map(ingredient => ingredient.trim()),
            nutritionalInfo: responseData.product.nutrition_facts.split(',').map(info => info.trim()),
            quantity: quantity,
            price: price,
            barcode: barcodeData,
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
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getProducts() {
    const items = await client.fetch('*[_type == "retailproducts"]');
    return items;
}

export default async function checkMobileNumberInDB(mobileNumber) {

    try {
        // Query Sanity.io dataset for the mobile number
        const users = await client.fetch('*[_type == "users"]');
        let uid = undefined;
        users.map((user) => {
            console.log(user);
            if (user.mobilenumber == mobileNumber) {
                uid = user.uid;
            }
        })
        return uid;
    } catch (error) {
        console.error('Error retrieving UID:', error);
    }
}

export const updateQuantityInDatabase = async (itemId, newQuantity) => {
    try {
        // Update the document with the new quantity
        await client
            .patch(itemId) // Assuming itemId is the ID of the document to update
            .set({ quantity: newQuantity }) // Set the new quantity value
            .commit(); // Commit the update
        console.log('Quantity updated successfully');
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
};


export const updateProductQuantity = async (productId, quantity) => {
    try {
        const existingProducts = await client.fetch(`*[_type == "retailproducts"]`);
        console.log(existingProducts)
        existingProducts.map(async (item) => {
            if (item._id == productId) {
                await client.patch(item._id).set({ quantity }).commit();
            }
        })
    } catch (error) {
        console.error('Error updating product quantity:', error);
        throw new Error('Failed to update product quantity');
    }
};

export async function fetchDataAndAddToSanityNewBarcode(item, barcodeData, price) {

    try {

        const sanityResponse = await client.create({
            _type: 'retailproducts',
            name: item.name,
            date: item.date,
            description: item.description,
            brand: item.brand,
            category: item.category,
            ingredients: item.ingredients.map(value => value),
            nutritionalInfo: item.nutritionalInfo.map(value => value),
            quantity: item.quantity,
            price: price,
            image: item.image,
            barcode: barcodeData,
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

export async function fetchDataAndAddToSanityNewBarcodeManual(nameofProduct, barcodeData, priceofProduct, imgURL, dateofProduct, quantityofProduct) {

    try {

        const sanityResponse = await client.create({
            _type: 'retailproducts',
            name: nameofProduct,
            date: dateofProduct,
            description: 'No Description',
            brand: 'Not Applicable',
            category: 'Food',
            ingredients: 'Not Applicable',
            nutritionalInfo: 'N/A',
            quantity: quantityofProduct,
            price: priceofProduct,
            image: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: imgURL._id,
                },
            },
            barcode: barcodeData,
        });
        console.log('Data added to Sanity:', sanityResponse);
    } catch (error) {
        console.error('Error:', error);
    }
}