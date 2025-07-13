import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import type { CompositeNavigationProp, NavigatorScreenParams } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { Transaction, CategoryTotal } from "./transaction"

export type TabParamList = {
    Dashboard: undefined
    Categories: undefined
    Add: undefined
    Reports: undefined
    Settings: undefined
}

export type RootStackParamList = {
    Login: undefined
    Register: undefined
    Main: NavigatorScreenParams<TabParamList>
    TransactionDetail: { transaction: Transaction }
    AddTransaction: { transaction?: Transaction } 
    CategoryTransactions: { category: CategoryTotal }
    Profile: undefined
}

// Tipo para o Stack Navigator pai
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>

export type DashboardScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, "Dashboard">,
    NativeStackNavigationProp<RootStackParamList>
>

export type CategoriesScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, "Categories">,
    NativeStackNavigationProp<RootStackParamList>
>

// Adicionando tipos para as outras telas do Tab Navigator por completude
export type ReportsScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, "Reports">,
    NativeStackNavigationProp<RootStackParamList>
>

export type SettingsScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, "Settings">,
    NativeStackNavigationProp<RootStackParamList>
>
