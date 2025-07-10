import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Transaction } from "../types/transaction"

const TRANSACTIONS_STORAGE_KEY = "@finance_app:transactions"
const CATEGORIES_STORAGE_KEY = "@finance_app:categories"

/**
 * Serviço para gerenciar o armazenamento local de transações e categorias
 */
export const StorageService = {
    /**
     * Salva uma nova transação no armazenamento local
     */
    async saveTransaction(transaction: Transaction): Promise<void> {
        try {
            // Buscar transações existentes
            const transactions = await this.getTransactions()

            // Adicionar ID único e timestamp para a nova transação
            const newTransaction: Transaction = {
                ...transaction,
                id: Date.now().toString(),
                timestamp: Date.now(),
            }

            // Adicionar a nova transação ao início da lista
            const updatedTransactions = [newTransaction, ...transactions]

            // Salvar a lista atualizada
            await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTransactions))

            return
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

    /**
     * Busca transações por categoria
     */
    async getTransactionsByCategory(category: string): Promise<Transaction[]> {
        try {
            const transactions = await this.getTransactions()
            return transactions.filter((transaction) => transaction.category === category)
        } catch (error) {
            console.error("Erro ao buscar transações por categoria:", error)
            return []
        }
    },

    /**
     * Calcula o total de gastos por categoria
     */
    async getCategoryTotals(): Promise<Record<string, number>> {
        try {
            const transactions = await this.getTransactions()
            const categoryTotals: Record<string, number> = {}

            transactions.forEach((transaction) => {
                if (!transaction.category || transaction.type !== "negative") return

                const category = transaction.category
                const amount = Number.parseFloat(transaction.value.replace(/[^\d,-]/g, "").replace(",", "."))

                if (isNaN(amount)) return

                if (categoryTotals[category]) {
                    categoryTotals[category] += Math.abs(amount)
                } else {
                    categoryTotals[category] = Math.abs(amount)
                }
            })

            return categoryTotals
        } catch (error) {
            console.error("Erro ao calcular totais por categoria:", error)
            return {}
        }
    },

    /**
     * Limpa todos os dados armazenados (para testes)
     */
    async clearAllData(): Promise<void> {
        try {
            await AsyncStorage.removeItem(TRANSACTIONS_STORAGE_KEY)
            await AsyncStorage.removeItem(CATEGORIES_STORAGE_KEY)
        } catch (error) {
            console.error("Erro ao limpar dados:", error)
        }
    },
}
