import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import BottomTabNavigator from './Components/TabNav/TabNavigator';
import Home from './Screens/Home/Home';
import RetailerHome from './Retailer/Screens/Home/Home';
import RetailerAddItems from './Retailer/Screens/AddItems/AddItems';
import AddItems from './Screens/AddItems/AddItems';
import AddDate from './Screens/AddItems/AddDate';
import RetailerAddDate from './Retailer/Screens/AddItems/AddDate';
import RetailerAddQuantity from './Retailer/Screens/AddItems/AddQuantity';
import BillingScanner from './Retailer/Screens/Billing/BarcodeScanner'
import Billing from './Retailer/Screens/Billing/Billing';
import Inventory from './Screens/Home/Inventory';
import RecipeGenerator from './Screens/GenerateRecipe/GenerateRecipe';
import Login from './Screens/Login/Login';
import ProfileCard from './Screens/Profile/Profile';
import UploadPage from './Screens/RecipeCommunity/UploadPage';
import AddRecipe from './Screens/RecipeCommunity/AddRecipe';
import { AuthProvider } from './Screens/Login/AuthContext';
import Intro from './Screens/Intro/Intro';
import TabNavRetailer from './Retailer/Components/TabNavRetailer/TabNavRetailer';
import CashPayment from './Retailer/Screens/Billing/CashPayment';
import OnlinePayment from './Retailer/Screens/Billing/OnlinePayment';
import LoginRetailer from './Retailer/Screens/Login/Login';
import Display from './Retailer/Screens/KED/Display';
import SpeechRecognition from './Screens/SpeechRecognition'
import ShelfLifePredictor from './Screens/ShelfLifePrediction/ShelfLifePrediction';
import Analytics from './Retailer/Screens/Analytics/Analytics';
import BarcodeGeneratorApp from './Retailer/Screens/BarcodeGeneration/BarcodeGeneration';
import BarcodeGeneratorDisplay from './Retailer/Screens/BarcodeGeneration/BarcodeGenerationDisplay';
import GeneratorHome from './Retailer/Screens/BarcodeGeneration/GeneratorHome';
import BarcodeGenerationScanner from './Retailer/Screens/BarcodeGeneration/BarcodeGenerationScanner';
import ManualEntry from './Retailer/Screens/BarcodeGeneration/ManualEntry';
import ManualEntryGenerator from './Retailer/Screens/BarcodeGeneration/ManualEntryGenerator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Intro" component={Intro} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="LoginRetailer" component={LoginRetailer} />
            <Stack.Screen name="Main" component={BottomTabNavigator} />
            <Stack.Screen name="BottomTabRetailer" component={TabNavRetailer} />
            <Stack.Screen name="RetailerHome" component={RetailerHome} />
            <Stack.Screen name="RetailerAddItems" component={RetailerAddItems} />
            <Stack.Screen name="RetailerAddDate" component={RetailerAddDate} />
            <Stack.Screen name="RetailerAddQuantity" component={RetailerAddQuantity} />
            <Stack.Screen name="Billing" component={Billing} />
            <Stack.Screen name="BillingScanner" component={BillingScanner} />
            <Stack.Screen name="Cash" component={CashPayment} />
            <Stack.Screen name="Online" component={OnlinePayment} />
            <Stack.Screen name="Analytics" component={Analytics} />
            <Stack.Screen name="GeneratorHome" component={GeneratorHome} />
            <Stack.Screen name="ManualEntry" component={ManualEntry} />
            <Stack.Screen name="ManualEntryGenerator" component={ManualEntryGenerator} />
            <Stack.Screen name="BarcodeGenerationScanner" component={BarcodeGenerationScanner} />
            <Stack.Screen name="BarcodeGeneratorDisplay" component={BarcodeGeneratorDisplay} />
            <Stack.Screen name="BarcodeGenerator" component={BarcodeGeneratorApp} />
            <Stack.Screen name="Shelf" component={ShelfLifePredictor} />
            <Stack.Screen name="Generate Recipes" component={RecipeGenerator} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Inventory" component={Inventory} />
            <Stack.Screen name="BarcodeScanner" component={AddItems} />
            <Stack.Screen name="AddDate" component={AddDate} />
            <Stack.Screen name="Profile" component={ProfileCard} />
            <Stack.Screen name="DisplayKED" component={Display} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}