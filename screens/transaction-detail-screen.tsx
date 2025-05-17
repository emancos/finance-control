import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ArrowLeft } from "lucide-react-native"
import type { Transaction } from "../components/transactions-list"

const TransactionDetailScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { transaction } = route.params as { transaction: Transaction }

    // Default values for fields that might not be provided
    const category = transaction.category || "Não categorizado"
    const time = transaction.time || "12:00"
    const paymentMethod = transaction.paymentMethod || "Cartão de crédito"
    const notes = transaction.notes || "Sem observações adicionais"

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color="#00bfa5" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalhes da Transação</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.transactionHeader}>
                    <Text style={styles.description}>{transaction.description}</Text>
                    <Text style={[styles.value, transaction.type === "positive" ? styles.positive : styles.negative]}>
                        {transaction.value}
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Data</Text>
                        <Text style={styles.detailValue}>{transaction.date}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Hora</Text>
                        <Text style={styles.detailValue}>{time}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Categoria</Text>
                        <Text style={styles.detailValue}>{category}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Método de Pagamento</Text>
                        <Text style={styles.detailValue}>{paymentMethod}</Text>
                    </View>

                    <View style={styles.notesContainer}>
                        <Text style={styles.detailLabel}>Observações</Text>
                        <Text style={styles.notes}>{notes}</Text>
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
    },
    content: {
        flex: 1,
        padding: 16,
    },
    transactionHeader: {
        marginBottom: 24,
    },
    description: {
        fontSize: 24,
        fontWeight: "700",
        color: "#e0e0e0",
        marginBottom: 8,
    },
    value: {
        fontSize: 28,
        fontWeight: "700",
    },
    positive: {
        color: "#4caf50",
    },
    negative: {
        color: "#f44336",
    },
    card: {
        backgroundColor: "#1e1e1e",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    detailLabel: {
        fontSize: 16,
        color: "#80cbc4",
    },
    detailValue: {
        fontSize: 16,
        color: "#e0e0e0",
        fontWeight: "500",
    },
    notesContainer: {
        paddingVertical: 12,
    },
    notes: {
        fontSize: 16,
        color: "#e0e0e0",
        marginTop: 8,
        lineHeight: 22,
    },
})

export default TransactionDetailScreen
