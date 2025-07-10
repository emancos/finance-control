// useNavigation<NativeStackNavigationProp<any>>()

"use client"

import { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Alert,
} from "react-native"
import { Plus, Settings } from "lucide-react-native"
import { RefreshControl } from "react-native"

import Header from "../components/header"
import FinancialCards from "../components/financial-card"
import TransactionsList from "../components/transactions-list"
import { useNavigation } from "@react-navigation/native"
import CategoryCarousel from "../components/category-carousel"
import { useTransactions } from "../hooks/use-transactions"
import { useSettings } from "../hooks/use-settings"
import { formatCurrency } from "../utils/format-currency"
import type { CategoryTotal } from "../types/transaction"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

const DashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()
  const { transactions, categoryTotals, isLoading: transactionsLoading, refreshTransactions } = useTransactions()
  const { settings, isLoading: settingsLoading } = useSettings()
  const [financialSummary, setFinancialSummary] = useState([
    { title: "Salário Disponível", amount: "R$ 0,00", type: "positive" as const },
    { title: "Saldo Devedor", amount: "R$ 0,00", type: "negative" as const },
    { title: "Resumo Gastos", amount: "R$ 0,00", type: "negative" as const },
  ])

  const userData = {
    name: "Emanuel",
  }

  const isLoading = transactionsLoading || settingsLoading

  // Calcular resumo financeiro com base nas transações e configurações
  useEffect(() => {
    let income = 0
    let expenses = 0
    let pendingDebt = 0

    transactions.forEach((transaction) => {
      const value = Number.parseFloat(transaction.value.replace(/[^\d,-]/g, "").replace(",", "."))

      if (transaction.type === "positive") {
        income += value
      } else {
        expenses += Math.abs(value)

        // Calcular saldo devedor (parcelas pendentes)
        if (transaction.installments && transaction.installments > 1) {
          const installmentValue = Number.parseFloat(transaction.installmentValue?.replace(",", ".") || "0")
          // Assumindo que ainda restam parcelas a pagar (simplificado)
          pendingDebt += installmentValue * (transaction.installments - 1)
        }
      }
    })

    // Usar salário configurado se disponível
    const totalIncome = settings.salary > 0 ? settings.salary : income
    const availableSalary = totalIncome - expenses

    setFinancialSummary([
      {
        title: "Salário Disponível",
        amount: formatCurrency(availableSalary),
        type: availableSalary >= 0 ? "positive" : "negative",
      },
      { title: "Saldo Devedor", amount: formatCurrency(pendingDebt), type: "negative" as const },
      { title: "Resumo Gastos", amount: formatCurrency(expenses), type: "negative" as const },
    ])
  }, [transactions, settings.salary])

  const handleAddTransaction = () => {
    navigation.navigate("AddTransaction" as never)
  }

  const handleCategoryPress = (category: CategoryTotal) => {
    navigation.navigate("CategoryTransactions", { category })
  }

  const handleSeeAllCategories = () => {
    navigation.navigate("CategoryList" as never)
  }

  const handleSettings = () => {
    navigation.navigate("Settings" as never)
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
        <View style={styles.headerContainer}>
          <Header name={userData.name} />
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
            <Settings color="#00bfa5" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshTransactions} tintColor="#00bfa5" />}
        >
          <FinancialCards data={financialSummary} />

          {categoryTotals.length > 0 && (
            <CategoryCarousel
              categories={categoryTotals}
              onCategoryPress={handleCategoryPress}
              onSeeAll={handleSeeAllCategories}
            />
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  settingsButton: {
    padding: 8,
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
  seedButton: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
  },
  seedButtonText: {
    color: "#00bfa5",
    fontSize: 14,
    fontWeight: "500",
  },
})

export default DashboardScreen
