import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types/navigation';

import { SettingsProvider } from './hooks/use-settings';
import { TransactionsProvider } from './hooks/use-transactions';

import MainTabNavigator from './components/main-tab-navigator';
import LoginScreen from './screens/login-screen';
import RegisterScreen from './screens/register-screen';
import TransactionDetailScreen from './screens/transaction-detail-screen';
import AddTransactionScreen from './screens/add-transaction-screen';
import CategoryTransactionsScreen from './screens/category-transactions-screen';
import ProfileScreen from './screens/profile-screen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Cria o Stack Navigator principal
const RootStack = createNativeStackNavigator<RootStackParamList>();

// Componente que envolve toda a aplicação com os provedores
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <SettingsProvider>
            <TransactionsProvider>
                {children}
            </TransactionsProvider>
        </SettingsProvider>
    );
};

// Componente principal da aplicação com a estrutura de navegação
const App = () => {
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: process.env.EXPO_WEB_CLIENT_ID,
        });
    }, []);

    return (
        <AppProviders>
            <NavigationContainer>
                <RootStack.Navigator
                    initialRouteName="Login"
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <RootStack.Screen name="Login" component={LoginScreen} />
                    <RootStack.Screen name="Register" component={RegisterScreen} />
                    <RootStack.Screen name="Main" component={MainTabNavigator} />
                    <RootStack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
                    <RootStack.Screen name="CategoryTransactions" component={CategoryTransactionsScreen} />
                    <RootStack.Screen name="Profile" component={ProfileScreen} />
                    <RootStack.Screen
                        name="AddTransaction"
                        component={AddTransactionScreen}
                        options={{ presentation: 'modal' }}
                    />
                </RootStack.Navigator>
            </NavigationContainer>
        </AppProviders>
    );
};

export default App;
