import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

export interface Transaction {
    description: string
    value: string
    date: string
    type: "positive" | "negative"
    category?: string
    time?: string
    paymentMethod?: string
    notes?: string
}

interface TransactionsListProps {
    transactions: Transaction[]
}

const TransactionsList = ({ transactions }: TransactionsListProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>()

    const handleTransactionPress = (transaction: Transaction) => {
        navigation.navigate("TransactionDetail", { transaction })
    }

    const renderItem = ({ item }: { item: Transaction }) => (
        <TouchableOpacity style={styles.row} onPress={() => handleTransactionPress(item)} activeOpacity={0.7}>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={[styles.value, item.type === "positive" ? styles.positive : styles.negative]}>{item.value}</Text>
            <Text style={styles.date}>{item.date}</Text>
        </TouchableOpacity>
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
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                style={styles.list}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1e1e1e",
        padding: 16,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
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
})

export default TransactionsList
