"use client"

import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ArrowLeft, Edit3, Trash2 } from "lucide-react-native"
import { useTransactions } from "../hooks/use-transactions"
import type { Transaction } from "../types/transaction"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

const TransactionDetailScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const route = useRoute()
    const { transaction } = route.params as { transaction: Transaction }
    const { deleteTransaction } = useTransactions()

    // Default values for fields that might not be provided
    const category = transaction.category || "Não categorizado"
    const time = transaction.time || "12:00"
    const paymentMethod = transaction.paymentMethod || "Cartão de crédito"
    const notes = transaction.notes || "Sem observações adicionais"

    const handleEdit = () => {
        navigation.navigate("AddTransaction", { transaction })
    }

    const handleDelete = () => {
        Alert.alert(
            "Excluir Transação",
            `Tem certeza que deseja excluir a transação "${transaction.description}"?\n\nEsta ação não pode ser desfeita.`,
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        if (transaction.id) {
                            const success = await deleteTransaction(transaction.id)
                            if (success) {
                                Alert.alert("Sucesso", "Transação excluída com sucesso!", [
                                    { text: "OK", onPress: () => navigation.goBack() },
                                ])
                            } else {
                                Alert.alert("Erro", "Não foi possível excluir a transação. Tente novamente.")
                            }
                        } else {
                            Alert.alert("Erro", "ID da transação não encontrado.")
                        }
                    },
                },
            ],
        )
    }

    // Preparar dados para FlatList
    const detailData = [
        { type: "header", id: "header" },
        { type: "transaction-header", id: "transaction-header" },
        { type: "details-card", id: "details-card" },
        { type: "actions-card", id: "actions-card" },
    ]

    const renderItem = ({ item }: { item: any }) => {
        switch (item.type) {
            case "header":
                return (
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <ArrowLeft color="#00bfa5" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Detalhes da Transação</Text>
                        <View style={styles.headerActions}>
                            <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
                                <Edit3 color="#00bfa5" size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDelete} style={[styles.actionButton, styles.deleteButton]}>
                                <Trash2 color="#f44336" size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )

            case "transaction-header":
                return (
                    <View style={styles.transactionHeader}>
                        <Text style={styles.description}>{transaction.description}</Text>
                        <Text style={[styles.value, transaction.type === "positive" ? styles.positive : styles.negative]}>
                            {transaction.value}
                        </Text>
                        {transaction.type === "positive" && <Text style={styles.typeLabel}>Receita</Text>}
                        {transaction.type === "negative" && <Text style={styles.typeLabel}>Despesa</Text>}
                    </View>
                )

            case "details-card":
                return (
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
                            <Text style={[styles.detailValue, styles.categoryValue]}>{category}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Método de Pagamento</Text>
                            <Text style={styles.detailValue}>{paymentMethod}</Text>
                        </View>

                        {/* Informações de Parcelamento */}
                        {transaction.installments && transaction.installments > 1 && (
                            <>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Parcelas</Text>
                                    <Text style={styles.detailValue}>{transaction.installments}x</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Valor por Parcela</Text>
                                    <Text style={styles.detailValue}>R$ {transaction.installmentValue}</Text>
                                </View>
                            </>
                        )}

                        {/* Informações de Compra Coletiva */}
                        {transaction.isCollective && transaction.people && transaction.people.length > 0 && (
                            <View style={styles.collectiveSection}>
                                <Text style={styles.sectionTitle}>Compra Coletiva</Text>
                                {transaction.people.map((person, index) => (
                                    <View key={person.id} style={styles.personRow}>
                                        <Text style={styles.personName}>{person.name}</Text>
                                        <Text style={styles.personAmount}>R$ {person.amount}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.notesContainer}>
                            <Text style={styles.detailLabel}>Observações</Text>
                            <Text style={styles.notes}>{notes}</Text>
                        </View>
                    </View>
                )

            case "actions-card":
                return (
                    <View style={styles.actionsCard}>
                        <Text style={styles.actionsTitle}>Ações</Text>
                        <TouchableOpacity style={styles.editActionButton} onPress={handleEdit}>
                            <Edit3 color="#00bfa5" size={20} />
                            <Text style={styles.editActionText}>Editar Transação</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteActionButton} onPress={handleDelete}>
                            <Trash2 color="#f44336" size={20} />
                            <Text style={styles.deleteActionText}>Excluir Transação</Text>
                        </TouchableOpacity>
                    </View>
                )

            default:
                return null
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={detailData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
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
        justifyContent: "space-between",
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
        flex: 1,
        marginLeft: 16,
    },
    headerActions: {
        flexDirection: "row",
        gap: 8,
    },
    actionButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "rgba(0, 191, 165, 0.1)",
    },
    deleteButton: {
        backgroundColor: "rgba(244, 67, 54, 0.1)",
    },
    content: {
        flexGrow: 1,
        padding: 16,
        paddingTop: 0,
    },
    transactionHeader: {
        marginBottom: 24,
        alignItems: "center",
    },
    description: {
        fontSize: 24,
        fontWeight: "700",
        color: "#e0e0e0",
        marginBottom: 8,
        textAlign: "center",
    },
    value: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 4,
    },
    positive: {
        color: "#4caf50",
    },
    negative: {
        color: "#f44336",
    },
    typeLabel: {
        fontSize: 14,
        color: "#80cbc4",
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    card: {
        backgroundColor: "#1e1e1e",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
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
        fontSize: 16,
        color: "#80cbc4",
    },
    detailValue: {
        fontSize: 16,
        color: "#e0e0e0",
        fontWeight: "500",
        flex: 1,
        textAlign: "right",
    },
    categoryValue: {
        textTransform: "capitalize",
    },
    collectiveSection: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    sectionTitle: {
        fontSize: 16,
        color: "#80cbc4",
        marginBottom: 8,
        fontWeight: "600",
    },
    personRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 4,
        paddingLeft: 16,
    },
    personName: {
        fontSize: 14,
        color: "#e0e0e0",
    },
    personAmount: {
        fontSize: 14,
        color: "#f44336",
        fontWeight: "600",
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
    actionsCard: {
        backgroundColor: "#1e1e1e",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
    },
    actionsTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#00bfa5",
        marginBottom: 16,
    },
    editActionButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0, 191, 165, 0.1)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(0, 191, 165, 0.2)",
    },
    editActionText: {
        fontSize: 16,
        color: "#00bfa5",
        fontWeight: "600",
        marginLeft: 12,
    },
    deleteActionButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(244, 67, 54, 0.1)",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(244, 67, 54, 0.2)",
    },
    deleteActionText: {
        fontSize: 16,
        color: "#f44336",
        fontWeight: "600",
        marginLeft: 12,
    },
})

export default TransactionDetailScreen
