import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyA5UDNPSGVazIwfbuLKfzV090ebPwSDzTQ')

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = "Give a recipe for chicken biryani";

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        // Format the recipe for display
        const formattedRecipe = formatRecipe(text);

        console.log(formattedRecipe);
    } catch (error) {
        console.error('Error:', error);
    }
}

function formatRecipe(text) {
    // Split the text into sections based on common recipe components
    const sections = text.split('\n\n');

    // Format each section
    const formattedSections = sections.map(section => {
        // Add formatting or processing as needed
        return section.trim();
    });

    // Join the formatted sections with line breaks
    const formattedRecipe = formattedSections.join('\n\n');

    return formattedRecipe;
}

run();
