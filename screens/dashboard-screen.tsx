import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native"

import Header from "../components/header"
import FinancialCards from "../components/financial-card"
import TransactionsList from "../components/transactions-list"

const DashboardScreen = () => {
    // Sample data for the dashboard
    const userData = {
        name: "Marina",
        profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
    }

    const financialData = [
        { title: "Salário Disponível", amount: "R$ 7.500,00", type: "positive" as const },
        { title: "Saldo Devedor", amount: "R$ 1.200,00", type: "negative" as const },
        { title: "Resumo Gastos", amount: "R$ 3.450,00", type: "negative" as const },
    ]

    const transactions = [
        {
            description: "Mercado",
            value: "- R$ 320,00",
            date: "24/06/2024",
            type: "negative" as const,
            category: "Alimentação",
            time: "15:30",
            paymentMethod: "Cartão de débito",
            notes: "Compras semanais no Supermercado Extra. Incluiu frutas, legumes e produtos de limpeza.",
        },
        {
            description: "Salário",
            value: "+ R$ 7.500,00",
            date: "23/06/2024",
            type: "positive" as const,
            category: "Receita",
            time: "08:00",
            paymentMethod: "Transferência bancária",
            notes: "Salário mensal da empresa XYZ Tecnologia.",
        },
        {
            description: "Conta de luz",
            value: "- R$ 150,00",
            date: "22/06/2024",
            type: "negative" as const,
            category: "Moradia",
            time: "10:15",
            paymentMethod: "Débito automático",
            notes: "Fatura de energia elétrica referente ao mês de junho.",
        },
        {
            description: "Academia",
            value: "- R$ 100,00",
            date: "20/06/2024",
            type: "negative" as const,
            category: "Saúde",
            time: "14:45",
            paymentMethod: "Cartão de crédito",
            notes: "Mensalidade da academia Fitness Center.",
        },
        {
            description: "Streaming",
            value: "- R$ 50,00",
            date: "20/06/2024",
            type: "negative" as const,
            category: "Entretenimento",
            time: "09:30",
            paymentMethod: "Cartão de crédito",
            notes: "Assinatura mensal dos serviços de streaming.",
        },
    ]

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.dashboard}>
                <Header name={userData.name} profileImage={userData.profileImage} />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <FinancialCards data={financialData} />
                    <TransactionsList transactions={transactions} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    dashboard: {
        flex: 1,
        padding: 24,
        paddingBottom: 16,
    },
    scrollContent: {
        flexGrow: 1,
    },
})

export default DashboardScreen
