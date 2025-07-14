"use client"

import { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Alert,
  FlatList,
} from "react-native"
import { Settings } from "lucide-react-native"
import { RefreshControl } from "react-native"

import Header from "../components/header"
import FinancialCards from "../components/financial-card"
import { useNavigation } from "@react-navigation/native"
import CategoryCarousel from "../components/category-carousel"
import { useTransactions } from "../hooks/use-transactions"
import { useSettings } from "../hooks/use-settings"
import { formatCurrency } from "../utils/format-currency"
import type { CategoryTotal } from "../types/transaction"
import { DashboardScreenNavigationProp } from "../types/navigation"

const DashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>()
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
    if (!settings) {
      return
    }

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
  }, [transactions, settings])

  const handleCategoryPress = (category: CategoryTotal) => {
    navigation.navigate("CategoryTransactions", { category })
  }

  const handleSeeAllCategories = () => {
    navigation.navigate("Categories" as never)
  }

  const handleSettings = () => {
    navigation.navigate("Settings" as never)
  }

  const handleTransactionPress = (transaction: any) => {
    navigation.navigate("TransactionDetail", { transaction })
  }

  // Preparar dados para FlatList
  const dashboardData = [
    { type: "header", id: "header" },
    { type: "financial-cards", id: "financial-cards", data: financialSummary },
    ...(categoryTotals && categoryTotals.length > 0 ? [{ type: "category-carousel", id: "category-carousel", data: categoryTotals }] : []),
    { type: "transactions-header", id: "transactions-header" },
    ...(transactions ? transactions.map((transaction, index) => ({
      type: "transaction",
      id: `transaction-${transaction.id || index}`,
      data: transaction,
    })) : []),
    ...(transactions && transactions.length === 0 ? [{ type: "empty-transactions", id: "empty-transactions" }] : []),
  ]

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case "header":
        return (
          <View style={styles.headerContainer}>
            <Header name={userData.name} />
            <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
              <Settings color="#00bfa5" size={24} />
            </TouchableOpacity>
          </View>
        )

      case "financial-cards":
        return <FinancialCards data={item.data} />

      case "category-carousel":
        return (
          <CategoryCarousel
            categories={item.data}
            onCategoryPress={handleCategoryPress}
            onSeeAll={handleSeeAllCategories}
          />
        )

      case "transactions-header":
        return (
          <View style={styles.transactionsHeaderContainer}>
            <Text style={styles.transactionsTitle}>Últimas Transações</Text>
          </View>
        )

      case "transaction":
        return (
          <TouchableOpacity
            style={styles.transactionRow}
            onPress={() => handleTransactionPress(item.data)}
            activeOpacity={0.7}
          >
            <Text style={styles.transactionDescription}>{item.data.description}</Text>
            <Text style={[styles.transactionValue, item.data.type === "positive" ? styles.positive : styles.negative]}>
              {item.data.value}
            </Text>
            <Text style={styles.transactionDate}>{item.data.date}</Text>
          </TouchableOpacity>
        )

      case "empty-transactions":
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
            <Text style={styles.emptySubtext}>Adicione uma nova transação usando o botão +</Text>
          </View>
        )

      default:
        return null
    }
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
        <FlatList
          data={dashboardData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshTransactions} tintColor="#00bfa5" />}
        />
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
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  transactionsHeaderContainer: {
    backgroundColor: "rgb(40 40 40)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    marginBottom: 0,
    elevation: 4,
  },
  transactionsTitle: {
    color: "#00bfa5",
    fontSize: 16,
    fontWeight: "600",
  },
  transactionRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "rgb(40 40 40)",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 0,
  },
  transactionDescription: {
    flex: 1,
    fontSize: 15,
    color: "#ddd",
  },
  transactionValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
  },
  transactionDate: {
    flex: 0.8,
    fontSize: 15,
    color: "#ddd",
  },
  positive: {
    color: "#4caf50",
  },
  negative: {
    color: "#f44336",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(40 40 40)",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
  },
  emptyText: {
    fontSize: 16,
    color: "#e0e0e0",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#80cbc4",
    textAlign: "center",
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
