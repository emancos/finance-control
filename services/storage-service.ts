import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Transaction } from "../types/transaction"

const TRANSACTIONS_STORAGE_KEY = "@finance_app:transactions"
const CATEGORIES_STORAGE_KEY = "@finance_app:categories"

/**
 * Serviço para gerenciar o armazenamento local de transações e categorias
 */
export const StorageService = {
    /**
     * Salva uma nova transação e a retorna com ID e timestamp
     */
    async saveTransaction(transaction: Omit<Transaction, "id" | "timestamp">): Promise<Transaction | null> {
        try {
            const transactions = await this.getTransactions()
            const newTransaction: Transaction = {
                ...transaction,
                id: Date.now().toString(),
                timestamp: Date.now(),
            }
            const updatedTransactions = [newTransaction, ...transactions]
            await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTransactions))
            return newTransaction // Retorna a transação criada
        } catch (error) {
            console.error("Erro ao salvar transação:", error)
            throw new Error("Não foi possível salvar a transação")
        }
    },

    /**
     * Busca todas as transações do armazenamento local
     */
    async getTransactions(): Promise<Transaction[]> {
        try {
            const data = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY)
            return data ? JSON.parse(data) : []
        } catch (error) {
            console.error("Erro ao buscar transações:", error)
            return []
        }
    },

    /**
     * Atualiza uma transação existente
     */
    async updateTransaction(updatedTransaction: Transaction): Promise<void> {
        try {
            const transactions = await this.getTransactions()
            const updatedTransactions = transactions.map((transaction) =>
                transaction.id === updatedTransaction.id ? updatedTransaction : transaction,
            )

            await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTransactions))
        } catch (error) {
            console.error("Erro ao atualizar transação:", error)
            throw new Error("Não foi possível atualizar a transação")
        }
    },

    /**
     * Remove uma transação pelo ID
     */
    async deleteTransaction(id: string): Promise<void> {
        try {
            const transactions = await this.getTransactions()
            const filteredTransactions = transactions.filter((transaction) => transaction.id !== id)

            await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(filteredTransactions))
        } catch (error) {
            console.error("Erro ao excluir transação:", error)
            throw new Error("Não foi possível excluir a transação")
        }
    },

    // ... (outros métodos permanecem os mesmos)
}
