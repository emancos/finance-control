"use client"

import React, { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react"
import { StorageService } from "../services/storage-service"
import type { Transaction, CategoryTotal } from "../types/transaction"
import { formatCurrency } from "../utils/format-currency"
import { categoryIcons } from "../utils/category-icons"

// Definir a interface para o valor do nosso contexto
interface TransactionsContextData {
    transactions: Transaction[]
    categoryTotals: CategoryTotal[]
    isLoading: boolean
    error: string | null
    addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => Promise<boolean>
    updateTransaction: (transaction: Transaction) => Promise<boolean>
    deleteTransaction: (id: string) => Promise<boolean>
    refreshTransactions: () => Promise<void>
}

// Criar o Context com um valor padrão
const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData)

// Criar o componente Provedor
export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([])

    // Função interna para calcular os totais por categoria
    const calculateCategoryTotals = useCallback((currentTransactions: Transaction[]) => {
        const totals: Record<string, number> = {}

        currentTransactions.forEach((transaction) => {
            if (!transaction.category || transaction.type !== "negative") return
            const category = transaction.category
            const amount = Number.parseFloat(transaction.value.replace(/[^\d,-]/g, "").replace(",", "."))
            if (isNaN(amount)) return
            totals[category] = (totals[category] || 0) + Math.abs(amount)
        })

        const totalExpenses = Object.values(totals).reduce((sum, value) => sum + value, 0)

        const formattedTotals = Object.entries(totals).map(([category, total], index) => {
            const percentage = totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0
            const categoryConfig = categoryIcons[category]
            return {
                id: index.toString(),
                name: category,
                total,
                formattedTotal: formatCurrency(total),
                percentage,
                color: categoryConfig?.color || "#009688",
                icon: categoryConfig?.icon || categoryIcons.outros.icon,
            }
        })

        formattedTotals.sort((a, b) => b.total - a.total)
        setCategoryTotals(formattedTotals)
    }, [])

    // Carregar transações do armazenamento
    const loadTransactions = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await StorageService.getTransactions()
            setTransactions(data)
            calculateCategoryTotals(data)
        } catch (err) {
            setError("Erro ao carregar transações")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [calculateCategoryTotals])

    // Carregar transações na montagem inicial
    useEffect(() => {
        loadTransactions()
    }, [loadTransactions])

    // Adicionar transação
    const addTransaction = useCallback(
        async (transaction: Omit<Transaction, "id" | "timestamp">) => {
            try {
                const newTransaction = await StorageService.saveTransaction(transaction)
                if (newTransaction) {
                    // Atualiza o estado local IMEDIATAMENTE
                    const updatedTransactions = [newTransaction, ...transactions]
                    setTransactions(updatedTransactions)
                    calculateCategoryTotals(updatedTransactions)
                    return true
                }
                return false
            } catch (err) {
                setError("Erro ao adicionar transação")
                console.error(err)
                return false
            }
        },
        [transactions, calculateCategoryTotals],
    )

    // Atualizar transação
    const updateTransaction = useCallback(
        async (transaction: Transaction) => {
            try {
                await StorageService.updateTransaction(transaction)
                // Recarrega tudo para garantir consistência
                await loadTransactions()
                return true
            } catch (err) {
                setError("Erro ao atualizar transação")
                console.error(err)
                return false
            }
        },
        [loadTransactions],
    )

    // Excluir transação
    const deleteTransaction = useCallback(
        async (id: string) => {
            try {
                await StorageService.deleteTransaction(id)
                // Atualiza o estado local IMEDIATAMENTE
                const updatedTransactions = transactions.filter((t) => t.id !== id)
                setTransactions(updatedTransactions)
                calculateCategoryTotals(updatedTransactions)
                return true
            } catch (err) {
                setError("Erro ao excluir transação")
                console.error(err)
                return false
            }
        },
        [transactions, calculateCategoryTotals],
    )

    return (
        <TransactionsContext.Provider
            value= {{
        transactions,
            categoryTotals,
            isLoading,
            error,
            addTransaction,
            updateTransaction,
            deleteTransaction,
            refreshTransactions: loadTransactions,
            }
}
        >
    { children }
    </TransactionsContext.Provider>
    )
}

// Hook customizado para consumir o contexto
export function useTransactions(): TransactionsContextData {
    const context = useContext(TransactionsContext)
    if (!context) {
        throw new Error("useTransactions must be used within a TransactionsProvider")
    }
    return context
}
