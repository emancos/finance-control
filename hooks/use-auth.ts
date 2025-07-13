"use client"

import { useState, useEffect, useCallback } from "react"
import { AuthService } from "../services/auth-service"
import type { UserProfile } from "../types/user"

interface GoogleUser {
    name: string
    email: string
    profileImage?: string
}

export function useAuth() {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Verificar se há usuário logado
    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true)
        try {
            const currentUser = await AuthService.getCurrentUser()
            setUser(currentUser)
            setIsAuthenticated(!!currentUser)
        } catch (error) {
            console.error("Erro ao verificar autenticação:", error)
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Login
    const login = useCallback(async (email: string, password: string) => {
        const result = await AuthService.login(email, password)
        if (result.success && result.user) {
            setUser(result.user)
            setIsAuthenticated(true)
        }
        return result
    }, [])

    // Login com Google
    const loginWithGoogle = useCallback(async (googleUser: GoogleUser) => {
        const result = await AuthService.loginWithGoogle(googleUser)
        if (result.success && result.user) {
            setUser(result.user)
            setIsAuthenticated(true)
        }
        return result
    }, [])

    // Registro
    const register = useCallback(async (name: string, email: string, password: string) => {
        const result = await AuthService.register(name, email, password)
        if (result.success && result.user) {
            setUser(result.user)
            setIsAuthenticated(true)
        }
        return result
    }, [])

    // Logout
    const logout = useCallback(async () => {
        await AuthService.logout()
        setUser(null)
        setIsAuthenticated(false)
    }, [])

    // Atualizar usuário
    const updateUser = useCallback(
        async (updates: Partial<Pick<UserProfile, "name" | "email" | "profileImage">>) => {
            if (!user) return { success: false, message: "Usuário não encontrado" }

            const result = await AuthService.updateUser(user.id, updates)
            if (result.success && result.user) {
                setUser(result.user)
            }
            return result
        },
        [user],
    )

    // Alterar senha
    const changePassword = useCallback(
        async (currentPassword: string, newPassword: string) => {
            if (!user) return { success: false, message: "Usuário não encontrado" }

            return await AuthService.changePassword(user.id, currentPassword, newPassword)
        },
        [user],
    )

    // Verificar autenticação na montagem
    useEffect(() => {
        checkAuthStatus()
    }, [checkAuthStatus])

    return {
        user,
        isLoading,
        isAuthenticated,
        login,
        loginWithGoogle, // Exporta a nova função
        register,
        logout,
        updateUser,
        changePassword,
        refreshAuth: checkAuthStatus,
    }
}
