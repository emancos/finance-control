"use client"

import { useState, useEffect, useCallback } from "react"
import { SettingsService, type AppSettings } from "../services/settings-service"

export function useSettings() {
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

    return {
        settings,
        isLoading,
        error,
        updateSalary,
        saveSettings,
        refreshSettings: loadSettings,
    }
}
