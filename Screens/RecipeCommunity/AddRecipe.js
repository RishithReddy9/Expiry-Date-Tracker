import { View, Text } from 'react-native'
import React from 'react'

const AddRecipe = ({ route }) => {
    const img = route.params;
    return (
        <View>
            <Text>AddRecipe</Text>
        </View>
    )
}

export default AddRecipe