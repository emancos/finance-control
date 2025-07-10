import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ArrowLeft, Calendar, TrendingDown } from "lucide-react-native"
import { useTransactions } from "../hooks/use-transactions"
import type { Transaction, CategoryTotal } from "../types/transaction"
import { formatCurrency } from "../utils/format-currency"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

interface RouteParams {
    category: CategoryTotal
}

const CategoryTransactionsScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const route = useRoute()
    const { category } = route.params as RouteParams
    const { transactions, isLoading } = useTransactions()

    // Filtrar transações por categoria
    const categoryTransactions = transactions.filter(
        (transaction) => transaction.category === category.name && transaction.type === "negative",
    )

    // Calcular estatísticas
    const totalTransactions = categoryTransactions.length
    const averageTransaction = totalTransactions > 0 ? category.total / totalTransactions : 0

    const handleTransactionPress = (transaction: Transaction) => {
        navigation.navigate("TransactionDetail", { transaction })
    }

    const renderTransactionItem = ({ item }: { item: Transaction }) => (
        <TouchableOpacity style={styles.transactionItem} onPress={() => handleTransactionPress(item)} activeOpacity={0.7}>
            <View style={styles.transactionContent}>
                <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>{item.description}</Text>
                    <View style={styles.transactionMeta}>
                        <Text style={styles.transactionDate}>{item.date}</Text>
                        {item.time && <Text style={styles.transactionTime}>{item.time}</Text>}
                    </View>
                    {item.paymentMethod && <Text style={styles.paymentMethod}>{item.paymentMethod}</Text>}
                </View>
                <View style={styles.transactionValue}>
                    <Text style={styles.transactionAmount}>{item.value}</Text>
                    {item.installments && item.installments > 1 && (
                        <Text style={styles.installmentInfo}>
                            {item.installments}x de R$ {item.installmentValue}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
            <Text style={styles.emptySubtext}>Não há transações registradas para a categoria "{category.name}"</Text>
        </View>
    )

    const renderHeader = () => {
        const IconComponent = category.icon

        return (
            <>
                {/* Header com botão voltar */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft color="#00bfa5" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {category.name}
                    </Text>
                </View>

                {/* Conteúdo do header */}
                <View style={styles.headerContent}>
                    {/* Card da categoria */}
                    <View style={styles.categoryCard}>
                        <View style={styles.categoryHeader}>
                            <View style={[styles.categoryIcon, { backgroundColor: category.color + "20" }]}>
                                <IconComponent color={category.color} size={32} />
                            </View>
                            <View style={styles.categoryInfo}>
                                <Text style={styles.categoryName}>{category.name}</Text>
                                <Text style={styles.categoryTotal}>{category.formattedTotal}</Text>
                            </View>
                        </View>

                        <View style={styles.progressContainer}>
                            <View style={styles.progressBackground}>
                                <View
                                    style={[
                                        styles.progressBar,
                                        {
                                            width: `${Math.min(category.percentage, 100)}%`,
                                            backgroundColor: category.color,
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={styles.percentageText}>{category.percentage}%</Text>
                        </View>
                    </View>

                    {/* Estatísticas */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Calendar color="#80cbc4" size={20} />
                            <Text style={styles.statLabel}>Transações</Text>
                            <Text style={styles.statValue}>{totalTransactions}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <TrendingDown color="#80cbc4" size={20} />
                            <Text style={styles.statLabel}>Média por transação</Text>
                            <Text style={styles.statValue}>{formatCurrency(averageTransaction)}</Text>
                        </View>
                    </View>

                    {/* Título da lista */}
                    <Text style={styles.listTitle}>Transações da Categoria</Text>
                </View>
            </>
        )
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft color="#00bfa5" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{category.name}</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00bfa5" />
                    <Text style={styles.loadingText}>Carregando transações...</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={categoryTransactions}
                renderItem={renderTransactionItem}
                keyExtractor={(item) => item.id || Math.random().toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyList}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#00bfa5",
        marginLeft: 16,
        flex: 1,
        textTransform: "capitalize",
    },
    headerContent: {
        padding: 16,
    },
    categoryCard: {
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    categoryHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    categoryIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryName: {
        fontSize: 24,
        fontWeight: "700",
        color: "#e0e0e0",
        marginBottom: 4,
        textTransform: "capitalize",
    },
    categoryTotal: {
        fontSize: 20,
        fontWeight: "700",
        color: "#f44336",
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    progressBackground: {
        flex: 1,
        height: 8,
        backgroundColor: "#333",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        borderRadius: 4,
    },
    percentageText: {
        fontSize: 14,
        color: "#80cbc4",
        fontWeight: "600",
        minWidth: 40,
        textAlign: "right",
    },
    statsContainer: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 24,
    },
    statItem: {
        flex: 1,
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        elevation: 2,
    },
    statLabel: {
        fontSize: 12,
        color: "#80cbc4",
        marginTop: 8,
        marginBottom: 4,
        textAlign: "center",
    },
    statValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#e0e0e0",
        textAlign: "center",
    },
    listTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#00bfa5",
        marginBottom: 8,
    },
    listContent: {
        flexGrow: 1,
    },
    transactionItem: {
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    transactionContent: {
        flexDirection: "row",
        padding: 16,
    },
    transactionInfo: {
        flex: 1,
        marginRight: 12,
    },
    transactionDescription: {
        fontSize: 16,
        fontWeight: "600",
        color: "#e0e0e0",
        marginBottom: 4,
    },
    transactionMeta: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 14,
        color: "#80cbc4",
        marginRight: 12,
    },
    transactionTime: {
        fontSize: 14,
        color: "#80cbc4",
    },
    paymentMethod: {
        fontSize: 12,
        color: "#999",
        fontStyle: "italic",
    },
    transactionValue: {
        alignItems: "flex-end",
        justifyContent: "center",
    },
    transactionAmount: {
        fontSize: 18,
        fontWeight: "700",
        color: "#f44336",
        marginBottom: 2,
    },
    installmentInfo: {
        fontSize: 12,
        color: "#80cbc4",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: "#e0e0e0",
        marginBottom: 8,
        textAlign: "center",
    },
    emptySubtext: {
        fontSize: 14,
        color: "#80cbc4",
        textAlign: "center",
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

export default CategoryTransactionsScreen
