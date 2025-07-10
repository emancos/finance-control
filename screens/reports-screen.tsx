"use client"

import { useState, useEffect } from "react"
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from "react-native"
import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChart, BarChart3 } from "lucide-react-native"
import { useTransactions } from "../hooks/use-transactions"
import { useSettings } from "../hooks/use-settings"
import { formatCurrency } from "../utils/format-currency"
import CategoryCarousel from "../components/category-carousel"

const { width: screenWidth } = Dimensions.get("window")

const ReportsScreen = () => {
    const { transactions, categoryTotals, isLoading } = useTransactions()
    const { settings } = useSettings()
    const [selectedPeriod, setSelectedPeriod] = useState("month")
    const [reportData, setReportData] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        transactionCount: 0,
        averageTransaction: 0,
        biggestExpense: 0,
        mostUsedCategory: "",
    })

    const periods = [
        { label: "Este Mês", value: "month" },
        { label: "Esta Semana", value: "week" },
        { label: "Este Ano", value: "year" },
    ]

    useEffect(() => {
        calculateReportData()
    }, [transactions, selectedPeriod])

    const calculateReportData = () => {
        let income = 0
        let expenses = 0
        let biggestExpense = 0
        const categoryCount: Record<string, number> = {}

        // Filtrar transações por período (simplificado - usando todas as transações)
        const filteredTransactions = transactions

        filteredTransactions.forEach((transaction) => {
            const value = Number.parseFloat(transaction.value.replace(/[^\d,-]/g, "").replace(",", "."))

            if (transaction.type === "positive") {
                income += value
            } else {
                const absValue = Math.abs(value)
                expenses += absValue

                if (absValue > biggestExpense) {
                    biggestExpense = absValue
                }

                // Contar categorias
                if (transaction.category) {
                    categoryCount[transaction.category] = (categoryCount[transaction.category] || 0) + 1
                }
            }
        })

        // Encontrar categoria mais usada
        const mostUsedCategory = Object.entries(categoryCount).reduce(
            (max, [category, count]) => (count > max.count ? { category, count } : max),
            { category: "Nenhuma", count: 0 },
        ).category

        // Usar salário configurado se disponível
        const totalIncome = settings.salary > 0 ? settings.salary : income
        const balance = totalIncome - expenses
        const averageTransaction =
            filteredTransactions.length > 0 ? expenses / filteredTransactions.filter((t) => t.type === "negative").length : 0

        setReportData({
            totalIncome,
            totalExpenses: expenses,
            balance,
            transactionCount: filteredTransactions.length,
            averageTransaction,
            biggestExpense,
            mostUsedCategory,
        })
    }

    const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <View style={styles.statHeader}>
                <Icon color={color} size={24} />
                <Text style={styles.statTitle}>{title}</Text>
            </View>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
    )

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00bfa5" />
                    <Text style={styles.loadingText}>Carregando relatórios...</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Relatórios Financeiros</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Seletor de Período */}
                <View style={styles.periodSelector}>
                    {periods.map((period) => (
                        <TouchableOpacity
                            key={period.value}
                            style={[styles.periodButton, selectedPeriod === period.value && styles.periodButtonActive]}
                            onPress={() => setSelectedPeriod(period.value)}
                        >
                            <Text style={[styles.periodButtonText, selectedPeriod === period.value && styles.periodButtonTextActive]}>
                                {period.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Cards de Estatísticas Principais */}
                <View style={styles.statsGrid}>
                    <StatCard
                        title="Receitas"
                        value={formatCurrency(reportData.totalIncome)}
                        icon={TrendingUp}
                        color="#4caf50"
                        subtitle="Total de entradas"
                    />

                    <StatCard
                        title="Despesas"
                        value={formatCurrency(reportData.totalExpenses)}
                        icon={TrendingDown}
                        color="#f44336"
                        subtitle="Total de saídas"
                    />

                    <StatCard
                        title="Saldo"
                        value={formatCurrency(reportData.balance)}
                        icon={DollarSign}
                        color={reportData.balance >= 0 ? "#4caf50" : "#f44336"}
                        subtitle={reportData.balance >= 0 ? "Saldo positivo" : "Saldo negativo"}
                    />

                    <StatCard
                        title="Transações"
                        value={reportData.transactionCount.toString()}
                        icon={Calendar}
                        color="#00bfa5"
                        subtitle="Total de movimentações"
                    />
                </View>

                {/* Estatísticas Detalhadas */}
                <View style={styles.detailedStats}>
                    <Text style={styles.sectionTitle}>Análise Detalhada</Text>

                    <View style={styles.detailCard}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Gasto Médio por Transação</Text>
                            <Text style={styles.detailValue}>{formatCurrency(reportData.averageTransaction)}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Maior Gasto Individual</Text>
                            <Text style={[styles.detailValue, styles.expenseValue]}>{formatCurrency(reportData.biggestExpense)}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Categoria Mais Utilizada</Text>
                            <Text style={[styles.detailValue, styles.categoryValue]}>{reportData.mostUsedCategory}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Taxa de Poupança</Text>
                            <Text style={[styles.detailValue, { color: reportData.balance >= 0 ? "#4caf50" : "#f44336" }]}>
                                {reportData.totalIncome > 0
                                    ? `${((reportData.balance / reportData.totalIncome) * 100).toFixed(1)}%`
                                    : "0%"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Gastos por Categoria */}
                {categoryTotals.length > 0 && (
                    <View style={styles.categorySection}>
                        <Text style={styles.sectionTitle}>Distribuição por Categoria</Text>
                        <CategoryCarousel
                            categories={categoryTotals.slice(0, 5)} // Mostrar apenas top 5
                            onCategoryPress={() => { }} // Não navegar, apenas visualizar
                        />
                    </View>
                )}

                {/* Insights e Dicas */}
                <View style={styles.insightsSection}>
                    <Text style={styles.sectionTitle}>Insights Financeiros</Text>

                    <View style={styles.insightCard}>
                        <PieChart color="#00bfa5" size={24} />
                        <View style={styles.insightContent}>
                            <Text style={styles.insightTitle}>Análise de Gastos</Text>
                            <Text style={styles.insightText}>
                                {reportData.totalExpenses > reportData.totalIncome * 0.8
                                    ? "Seus gastos estão altos. Considere revisar suas despesas."
                                    : "Seus gastos estão controlados. Continue assim!"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.insightCard}>
                        <BarChart3 color="#00bfa5" size={24} />
                        <View style={styles.insightContent}>
                            <Text style={styles.insightTitle}>Meta de Poupança</Text>
                            <Text style={styles.insightText}>
                                {reportData.balance > 0
                                    ? `Parabéns! Você conseguiu poupar ${formatCurrency(reportData.balance)} este período.`
                                    : "Tente estabelecer uma meta de poupança mensal para melhorar suas finanças."}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#00bfa5",
        textAlign: "center",
    },
    content: {
        flex: 1,
        padding: 16,
    },
    periodSelector: {
        flexDirection: "row",
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    periodButtonActive: {
        backgroundColor: "#00bfa5",
    },
    periodButtonText: {
        fontSize: 14,
        color: "#80cbc4",
        fontWeight: "500",
    },
    periodButtonTextActive: {
        color: "#fff",
        fontWeight: "600",
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        width: (screenWidth - 44) / 2, // 2 cards per row with margins
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 16,
        padding: 16,
        borderLeftWidth: 4,
        elevation: 4,
    },
    statHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    statTitle: {
        fontSize: 14,
        color: "#80cbc4",
        marginLeft: 8,
        fontWeight: "500",
    },
    statValue: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 4,
    },
    statSubtitle: {
        fontSize: 12,
        color: "#999",
    },
    detailedStats: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#00bfa5",
        marginBottom: 16,
    },
    detailCard: {
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 16,
        padding: 16,
        elevation: 4,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    detailLabel: {
        fontSize: 14,
        color: "#80cbc4",
        flex: 1,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#e0e0e0",
        textAlign: "right",
    },
    expenseValue: {
        color: "#f44336",
    },
    categoryValue: {
        color: "#00bfa5",
        textTransform: "capitalize",
    },
    categorySection: {
        marginBottom: 24,
    },
    insightsSection: {
        marginBottom: 40,
    },
    insightCard: {
        flexDirection: "row",
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
    },
    insightContent: {
        flex: 1,
        marginLeft: 12,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#e0e0e0",
        marginBottom: 4,
    },
    insightText: {
        fontSize: 14,
        color: "#80cbc4",
        lineHeight: 20,
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

export default ReportsScreen
