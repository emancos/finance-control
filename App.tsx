import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "react-native"

import LoginScreen from "./screens/login-screen"
import DashboardScreen from "./screens/dashboard-screen"
import TransactionDetailScreen from "./screens/transaction-detail-screen"
import AddTransactionScreen from "./screens/add-transaction-screen"
import CategoryListScreen from "./screens/category-list-screen"
import CategoryTransactionsScreen from "./screens/category-transactions-screen"
import SettingsScreen from "./screens/settings-screen"

// Create the stack navigator
const Stack = createNativeStackNavigator()

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
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
                <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
                <Stack.Screen name="CategoryList" component={CategoryListScreen} />
                <Stack.Screen name="CategoryTransactions" component={CategoryTransactionsScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
