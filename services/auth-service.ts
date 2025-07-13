import AsyncStorage from "@react-native-async-storage/async-storage"
import type { User, UserProfile } from "../types/user"

const USERS_STORAGE_KEY = "@finance_app:users"
const CURRENT_USER_KEY = "@finance_app:current_user"

interface GoogleUser {
    name: string
    email: string
    profileImage?: string
}

/**
 * Serviço de autenticação local
 */
export const AuthService = {
    /**
     * Registra um novo usuário
     */
    async register(
        name: string,
        email: string,
        password: string,
    ): Promise<{ success: boolean; message: string; user?: UserProfile }> {
        try {
            // Verificar se o email já existe
            const users = await this.getAllUsers()
            const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase())

            if (existingUser) {
                return { success: false, message: "Este email já está cadastrado" }
            }

            // Criar novo usuário
            const newUser: User = {
                id: Date.now().toString(),
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password, // Em produção, usar hash da senha
                createdAt: Date.now(),
                updatedAt: Date.now(),
            }

            // Salvar usuário
            const updatedUsers = [...users, newUser]
            await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers))

            // Fazer login automático
            const userProfile = this.userToProfile(newUser)
            await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile))

            return {
                success: true,
                message: "Usuário cadastrado com sucesso!",
                user: userProfile,
            }
        } catch (error) {
            console.error("Erro ao registrar usuário:", error)
            return { success: false, message: "Erro interno. Tente novamente." }
        }
    },

    /**
     * Faz login do usuário
     */
    async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: UserProfile }> {
        try {
            const users = await this.getAllUsers()
            const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password)

            if (!user) {
                return { success: false, message: "Email ou senha incorretos" }
            }

            // Salvar usuário logado
            const userProfile = this.userToProfile(user)
            await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile))

            return {
                success: true,
                message: "Login realizado com sucesso!",
                user: userProfile,
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error)
            return { success: false, message: "Erro interno. Tente novamente." }
        }
    },

    /**
     * Faz login ou registra um usuário vindo do Google
     */
    async loginWithGoogle(
        googleUser: GoogleUser,
    ): Promise<{ success: boolean; message: string; user?: UserProfile }> {
        try {
            const users = await this.getAllUsers()
            const existingUser = users.find((u) => u.email.toLowerCase() === googleUser.email.toLowerCase())

            if (existingUser) {
                // Usuário já existe, apenas faz login
                const userToLogin = {
                    ...existingUser,
                    // Atualiza a foto do perfil se houver uma nova do Google
                    profileImage: googleUser.profileImage || existingUser.profileImage,
                    updatedAt: Date.now(),
                }

                // Atualiza a lista de usuários com a nova foto
                const updatedUsers = users.map(u => u.id === userToLogin.id ? userToLogin : u);
                await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));


                const userProfile = this.userToProfile(userToLogin)
                await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile))

                return { success: true, message: "Login com Google realizado com sucesso!", user: userProfile }
            } else {
                // Usuário não existe, cria uma nova conta
                const newUser: User = {
                    id: Date.now().toString(),
                    name: googleUser.name,
                    email: googleUser.email.toLowerCase(),
                    password: `google_auth_${Date.now()}`, // Senha aleatória, já que o login será via Google
                    profileImage: googleUser.profileImage,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                }

                const updatedUsers = [...users, newUser]
                await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers))

                const userProfile = this.userToProfile(newUser)
                await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile))

                return { success: true, message: "Conta criada com Google com sucesso!", user: userProfile }
            }
        } catch (error) {
            console.error("Erro no login com Google:", error)
            return { success: false, message: "Erro interno ao tentar login com Google." }
        }
    },

    /**
     * Faz logout do usuário
     */
    async logout(): Promise<void> {
        try {
            await AsyncStorage.removeItem(CURRENT_USER_KEY)
        } catch (error) {
            console.error("Erro ao fazer logout:", error)
        }
    },

    /**
     * Obtém o usuário logado
     */
    async getCurrentUser(): Promise<UserProfile | null> {
        try {
            const userData = await AsyncStorage.getItem(CURRENT_USER_KEY)
            return userData ? JSON.parse(userData) : null
        } catch (error) {
            console.error("Erro ao obter usuário atual:", error)
            return null
        }
    },

    /**
     * Verifica se há usuário logado
     */
    async isLoggedIn(): Promise<boolean> {
        const user = await this.getCurrentUser()
        return !!user
    },

    /**
     * Atualiza informações do usuário
     */
    async updateUser(
        userId: string,
        updates: Partial<Pick<User, "name" | "email" | "profileImage">>,
    ): Promise<{ success: boolean; message: string; user?: UserProfile }> {
        try {
            const users = await this.getAllUsers()
            const userIndex = users.findIndex((u) => u.id === userId)

            if (userIndex === -1) {
                return { success: false, message: "Usuário não encontrado" }
            }

            // Verificar se o novo email já existe (se estiver sendo alterado)
            if (updates.email && updates.email !== users[userIndex].email) {
                const emailExists = users.some((u) => u.id !== userId && u.email.toLowerCase() === updates.email!.toLowerCase())
                if (emailExists) {
                    return { success: false, message: "Este email já está sendo usado por outro usuário" }
                }
            }

            // Atualizar usuário
            const updatedUser: User = {
                ...users[userIndex],
                ...updates,
                email: updates.email ? updates.email.toLowerCase().trim() : users[userIndex].email,
                name: updates.name ? updates.name.trim() : users[userIndex].name,
                updatedAt: Date.now(),
            }

            users[userIndex] = updatedUser
            await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

            // Atualizar usuário logado
            const userProfile = this.userToProfile(updatedUser)
            await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile))

            return {
                success: true,
                message: "Informações atualizadas com sucesso!",
                user: userProfile,
            }
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error)
            return { success: false, message: "Erro interno. Tente novamente." }
        }
    },

    /**
     * Altera a senha do usuário
     */
    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string,
    ): Promise<{ success: boolean; message: string }> {
        try {
            const users = await this.getAllUsers()
            const userIndex = users.findIndex((u) => u.id === userId)

            if (userIndex === -1) {
                return { success: false, message: "Usuário não encontrado" }
            }

            // Verificar senha atual
            if (users[userIndex].password !== currentPassword) {
                return { success: false, message: "Senha atual incorreta" }
            }

            // Atualizar senha
            users[userIndex] = {
                ...users[userIndex],
                password: newPassword, // Em produção, usar hash
                updatedAt: Date.now(),
            }

            await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

            return { success: true, message: "Senha alterada com sucesso!" }
        } catch (error) {
            console.error("Erro ao alterar senha:", error)
            return { success: false, message: "Erro interno. Tente novamente." }
        }
    },

    /**
     * Obtém todos os usuários (uso interno)
     */
    async getAllUsers(): Promise<User[]> {
        try {
            const data = await AsyncStorage.getItem(USERS_STORAGE_KEY)
            return data ? JSON.parse(data) : []
        } catch (error) {
            console.error("Erro ao obter usuários:", error)
            return []
        }
    },

    /**
     * Converte User para UserProfile (remove senha)
     */
    userToProfile(user: User): UserProfile {
        const { password, ...profile } = user
        return profile
    },

    /**
     * Limpa todos os dados de usuários (para desenvolvimento)
     */
    async clearAllUsers(): Promise<void> {
        try {
            await AsyncStorage.removeItem(USERS_STORAGE_KEY)
            await AsyncStorage.removeItem(CURRENT_USER_KEY)
        } catch (error) {
            console.error("Erro ao limpar usuários:", error)
        }
    },
}
