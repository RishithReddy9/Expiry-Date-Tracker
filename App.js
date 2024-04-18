import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import BottomTabNavigator from './Components/TabNav/TabNavigator';
import Home from './Screens/Home/Home';
import AddItems from './Screens/AddItems/AddItems';
import AddDate from './Screens/AddItems/AddDate';
import Inventory from './Screens/Home/Inventory';
import RecipeGenerator from './Screens/GenerateRecipe/GenerateRecipe';
import Login from './Screens/Login/Login';
import ProfileCard from './Screens/Profile/Profile';
import UploadPage from './Screens/RecipeCommunity/UploadPage';
import AddRecipe from './Screens/RecipeCommunity/AddRecipe';
import { AuthProvider } from './Screens/Login/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="RecipeCommunity" component={UploadPage} />
            <Stack.Screen name="Main" component={BottomTabNavigator} />
            <Stack.Screen name="Generate Recipes" component={RecipeGenerator} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Inventory" component={Inventory} />
            <Stack.Screen name="BarcodeScanner" component={AddItems} />
            <Stack.Screen name="AddDate" component={AddDate} />
            <Stack.Screen name="Profile" component={ProfileCard} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}