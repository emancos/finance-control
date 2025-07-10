"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Text } from "react-native"
import { Plus } from "lucide-react-native"
import { RefreshControl } from "react-native"

import Header from "../components/header"
import FinancialCards from "../components/financial-card"
import TransactionsList from "../components/transactions-list"
import { useNavigation } from "@react-navigation/native"
import CategoryCarousel from "../components/category-carousel"
import { useTransactions } from "../hooks/use-transactions"
import { formatCurrency } from "../utils/format-currency"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

const DashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()
  const { transactions, categoryTotals, isLoading, refreshTransactions } = useTransactions()
  const [financialSummary, setFinancialSummary] = useState([
    { title: "Salário Disponível", amount: "R$ 0,00", type: "positive" as const },
    { title: "Saldo Devedor", amount: "R$ 0,00", type: "negative" as const },
    { title: "Resumo Gastos", amount: "R$ 0,00", type: "negative" as const },
  ])

  const userData = {
    name: "Emanuel",
  }

  // Calcular resumo financeiro com base nas transações
  useEffect(() => {
    if (transactions.length > 0) {
      let income = 0
      let expenses = 0
      let debt = 0

      transactions.forEach((transaction) => {
        const value = Number.parseFloat(transaction.value.replace(/[^\d,-]/g, "").replace(",", "."))

        if (transaction.type === "positive") {
          income += value
        } else {
          expenses += Math.abs(value)

          // Se for parcelado, adicionar ao saldo devedor
          if (
            transaction.paymentMethod?.includes("Parcelado") &&
            transaction.installments &&
            transaction.installments > 1
          ) {
            const installmentValue = Number.parseFloat(transaction.installmentValue?.replace(",", ".") || "0")
            debt += installmentValue * (transaction.installments - 1)
          }
        }
      })

      setFinancialSummary([
        { title: "Salário Disponível", amount: formatCurrency(income - expenses), type: "positive" as const },
        { title: "Saldo Devedor", amount: formatCurrency(debt), type: "negative" as const },
        { title: "Resumo Gastos", amount: formatCurrency(expenses), type: "negative" as const },
      ])
    }
  }, [transactions])

  const handleAddTransaction = () => {
    navigation.navigate("AddTransaction" as never)
  }

  const handleCategoryPress = (category: any) => {
    // TODO: Navigate to category details screen
    console.log("Category pressed:", category.name)
  }

  const handleTransactionPress = (transaction: any) => {
    navigation.navigate("TransactionDetail", { transaction })
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00bfa5" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dashboard}>
        <Header name={userData.name} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshTransactions} tintColor="#00bfa5" />}
        >
          <FinancialCards data={financialSummary} />

          {categoryTotals.length > 0 && (
            <CategoryCarousel categories={categoryTotals} onCategoryPress={handleCategoryPress} />
          )}

          <TransactionsList transactions={transactions} onTransactionPress={handleTransactionPress} />
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={handleAddTransaction} activeOpacity={0.8}>
          <Plus color="#fff" size={24} />
        </TouchableOpacity>
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
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#009688",
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#00bfa5",
  },
})

export default DashboardScreen
