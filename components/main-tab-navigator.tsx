import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Home, PieChart, Plus, BarChart3, Settings } from "lucide-react-native"
import DashboardScreen from "../screens/dashboard-screen"
import CategoryListScreen from "../screens/category-list-screen"
import AddTransactionScreen from "../screens/add-transaction-screen"
import ReportsScreen from "../screens/reports-screen"
import SettingsScreen from "../screens/settings-screen"
import type { TabParamList } from "../types/navigation"

const Tab = createBottomTabNavigator<TabParamList>()

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#1e1e1e",
                    borderTopColor: "#333",
                    borderTopWidth: 1,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: "#00bfa5",
                tabBarInactiveTintColor: "#80cbc4",
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                    marginTop: 4,
                },
                tabBarIconStyle: {
                    marginBottom: 2,
                },
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarLabel: "Início",
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />

            <Tab.Screen
                name="Categories"
                component={CategoryListScreen}
                options={{
                    tabBarLabel: "Categorias",
                    tabBarIcon: ({ color, size }) => <PieChart color={color} size={size} />,
                }}
            />

            <Tab.Screen
                name="AddTransaction"
                component={AddTransactionScreen}
                options={{
                    tabBarLabel: "Nova",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Plus
                            color={focused ? "#fff" : color}
                            size={size + 4}
                            style={{
                                backgroundColor: focused ? "#00bfa5" : "transparent",
                                borderRadius: 20,
                                padding: focused ? 8 : 0,
                            }}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Reports"
                component={ReportsScreen}
                options={{
                    tabBarLabel: "Relatórios",
                    tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
                }}
            />

            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarLabel: "Config",
                    tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    )
}

export default MainTabNavigator
