import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "react-native"

import LoginScreen from "./screens/login-screen"
import RegisterScreen from "./screens/register-screen"
import ProfileScreen from "./screens/profile-screen"
import MainTabNavigator from "./components/main-tab-navigator"
import TransactionDetailScreen from "./screens/transaction-detail-screen"
import AddTransactionScreen from "./screens/add-transaction-screen"
import CategoryTransactionsScreen from "./screens/category-transactions-screen"
import type { RootStackParamList } from "./types/navigation"
import { GoogleSignin } from "@react-native-google-signin/google-signin"

// Create the stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>()

GoogleSignin.configure({
    webClientId: process.env.EXPO_WEB_CLIENT_ID,
});

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#121212" />
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#121212" },
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Main" component={MainTabNavigator} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
                <Stack.Screen
                    name="AddTransaction"
                    component={AddTransactionScreen}
                    options={{
                        presentation: "modal", // Apresentar como modal quando chamado do stack
                    }}
                />
                <Stack.Screen name="CategoryTransactions" component={CategoryTransactionsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
