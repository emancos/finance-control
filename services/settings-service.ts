import AsyncStorage from "@react-native-async-storage/async-storage"

const SETTINGS_STORAGE_KEY = "@finance_app:settings"

export interface AppSettings {
    salary: number
    currency: string
    theme: "light" | "dark"
}

const defaultSettings: AppSettings = {
    salary: 0,
    currency: "BRL",
    theme: "dark",
}

/**
 * Serviço para gerenciar configurações do aplicativo
 */
export const SettingsService = {
    /**
     * Busca as configurações do armazenamento local
     */
    async getSettings(): Promise<AppSettings> {
        try {
            const data = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY)
            return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings
        } catch (error) {
            console.error("Erro ao buscar configurações:", error)
            return defaultSettings
        }
    },

    /**
     * Salva as configurações no armazenamento local
     */
    async saveSettings(settings: Partial<AppSettings>): Promise<void> {
        try {
            const currentSettings = await this.getSettings()
            const updatedSettings = { ...currentSettings, ...settings }
            await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings))
        } catch (error) {
            console.error("Erro ao salvar configurações:", error)
            throw new Error("Não foi possível salvar as configurações")
        }
    },

    /**
     * Atualiza apenas o salário
     */
    async updateSalary(salary: number): Promise<void> {
        try {
            await this.saveSettings({ salary })
        } catch (error) {
            console.error("Erro ao atualizar salário:", error)
            throw new Error("Não foi possível atualizar o salário")
        }
    },

    /**
     * Limpa todas as configurações
     */
    async clearSettings(): Promise<void> {
        try {
            await AsyncStorage.removeItem(SETTINGS_STORAGE_KEY)
        } catch (error) {
            console.error("Erro ao limpar configurações:", error)
        }
    },
}
