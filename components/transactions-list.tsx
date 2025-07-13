import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { Transaction } from "../types/transaction"
import { RootStackNavigationProp } from "../types/navigation"

interface TransactionsListProps {
    transactions: Transaction[]
    onTransactionPress?: (transaction: Transaction) => void
}

const TransactionsList = ({ transactions, onTransactionPress }: TransactionsListProps) => {
    const navigation = useNavigation<RootStackNavigationProp>()

    const handleTransactionPress = (transaction: Transaction) => {
        if (onTransactionPress) {
            onTransactionPress(transaction)
        } else {
            navigation.navigate("TransactionDetail", { transaction })
        }
    }

    const renderItem = ({ item }: { item: Transaction }) => (
        <TouchableOpacity style={styles.row} onPress={() => handleTransactionPress(item)} activeOpacity={0.7}>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={[styles.value, item.type === "positive" ? styles.positive : styles.negative]}>{item.value}</Text>
            <Text style={styles.date}>{item.date}</Text>
        </TouchableOpacity>
    )

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
            <Text style={styles.emptySubtext}>Adicione uma nova transação usando o botão +</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Últimas Transações</Text>

            <View style={styles.headerRow}>
                <Text style={styles.headerText}>Descrição</Text>
                <Text style={styles.headerText}>Valor</Text>
                <Text style={styles.headerText}>Data</Text>
            </View>

            <FlatList
                data={transactions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id || Math.random().toString()}
                showsVerticalScrollIndicator={false}
                style={styles.list}
                ListEmptyComponent={renderEmptyList}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(40 40 40)",
        padding: 16,
        borderRadius: 16,
        elevation: 4,
        overflow: "hidden",
    },
    title: {
        marginBottom: 12,
        color: "#00bfa5",
        fontSize: 16,
        fontWeight: "600",
    },
    headerRow: {
        flexDirection: "row",
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    headerText: {
        textAlign: "left",
        paddingHorizontal: 6,
        fontWeight: "600",
        fontSize: 14,
        color: "#80cbc4",
    },
    list: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    description: {
        flex: 1,
        fontSize: 15,
        color: "#ddd",
    },
    value: {
        flex: 1,
        fontSize: 15,
        fontWeight: "700",
    },
    date: {
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
})

export default TransactionsList
