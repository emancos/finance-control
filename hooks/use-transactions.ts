"use client"

import { useState, useEffect, useCallback } from "react"
import { StorageService } from "../services/storage-service"
import type { Transaction, CategoryTotal } from "../types/transaction"
import { formatCurrency } from "../utils/format-currency"
import { categoryIcons } from "../utils/category-icons"

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([])

    // Carregar transações
    const loadTransactions = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await StorageService.getTransactions()
            setTransactions(data)
            await loadCategoryTotals()
        } catch (err) {
            setError("Erro ao carregar transações")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Carregar totais por categoria
    const loadCategoryTotals = useCallback(async () => {
        try {
            const totals = await StorageService.getCategoryTotals()

            // Calcular o total geral para percentuais
            const totalExpenses = Object.values(totals).reduce((sum, value) => sum + value, 0)

            // Mapear para o formato necessário para o componente
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
                    icon: categoryConfig?.icon || categoryIcons.outros.icon, // Ensure icon is always present
                }
            })

            // Ordenar por valor (maior para menor)
            formattedTotals.sort((a, b) => b.total - a.total)

            setCategoryTotals(formattedTotals)
        } catch (err) {
            console.error("Erro ao carregar totais por categoria:", err)
        }
    }, [])

    // Adicionar transação
    const addTransaction = useCallback(
        async (transaction: Transaction) => {
            try {
                await StorageService.saveTransaction(transaction)
                await loadTransactions()
                return true
            } catch (err) {
                setError("Erro ao adicionar transação")
                console.error(err)
                return false
            }
        },
        [loadTransactions],
    )

    // Atualizar transação
    const updateTransaction = useCallback(
        async (transaction: Transaction) => {
            try {
                await StorageService.updateTransaction(transaction)
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
                await loadTransactions()
                return true
            } catch (err) {
                setError("Erro ao excluir transação")
                console.error(err)
                return false
            }
        },
        [loadTransactions],
    )

    // Carregar transações na montagem do componente
    useEffect(() => {
        loadTransactions()
    }, [loadTransactions])

    return {
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
