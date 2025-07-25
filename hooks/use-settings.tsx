"use client"

import React, { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react"
import { SettingsService, type AppSettings } from "../services/settings-service"

interface SettingsContextData {
    settings: AppSettings
    isLoading: boolean
    error: string | null
    updateSalary: (salary: number) => Promise<boolean>
    saveSettings: (newSettings: Partial<AppSettings>) => Promise<boolean>
    refreshSettings: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextData | null>(null)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<AppSettings>({
        salary: 0,
        currency: "BRL",
        theme: "dark",
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Carregar configurações
    const loadSettings = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await SettingsService.getSettings()
            setSettings(data)
        } catch (err) {
            setError("Erro ao carregar configurações")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Atualizar salário
    const updateSalary = useCallback(
        async (salary: number) => {
            try {
                await SettingsService.updateSalary(salary)
                // Recarrega as configurações para atualizar o estado global
                await loadSettings()
                return true
            } catch (err) {
                setError("Erro ao atualizar salário")
                console.error(err)
                return false
            }
        },
        [loadSettings],
    )

    // Salvar configurações
    const saveSettings = useCallback(
        async (newSettings: Partial<AppSettings>) => {
            try {
                await SettingsService.saveSettings(newSettings)
                // Recarrega as configurações para atualizar o estado global
                await loadSettings()
                return true
            } catch (err) {
                setError("Erro ao salvar configurações")
                console.error(err)
                return false
            }
        },
        [loadSettings],
    )

    // Carregar configurações na montagem do componente
    useEffect(() => {
        loadSettings()
    }, [loadSettings])

    return (
        <SettingsContext.Provider
            value={{
                settings,
                isLoading,
                error,
                updateSalary,
                saveSettings,
                refreshSettings: loadSettings,
            }
            }
        >
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings(): SettingsContextData {
    const context = useContext(SettingsContext)
    if (context === null) {
        throw new Error("useSettings deve ser usado dentro de um SettingsProvider. Verifique a árvore de componentes.")
    }
    return context
}
