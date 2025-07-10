"use client"

import { useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from "lucide-react-native"
import { useAuth } from "../hooks/use-auth"

const RegisterScreen = () => {
    const navigation = useNavigation()
    const { register } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const updateFormData = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const validateForm = () => {
        if (!formData.name.trim()) {
            Alert.alert("Erro", "Nome é obrigatório")
            return false
        }

        if (!formData.email.trim()) {
            Alert.alert("Erro", "Email é obrigatório")
            return false
        }

        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            Alert.alert("Erro", "Email inválido")
            return false
        }

        if (!formData.password) {
            Alert.alert("Erro", "Senha é obrigatória")
            return false
        }

        if (formData.password.length < 6) {
            Alert.alert("Erro", "Senha deve ter pelo menos 6 caracteres")
            return false
        }

        if (formData.password !== formData.confirmPassword) {
            Alert.alert("Erro", "Senhas não coincidem")
            return false
        }

        return true
    }

    const handleRegister = async () => {
        if (!validateForm()) return

        setIsLoading(true)

        try {
            const result = await register(formData.name, formData.email, formData.password)

            if (result.success) {
                Alert.alert("Sucesso", result.message, [{ text: "OK", onPress: () => navigation.navigate("Main" as never) }])
            } else {
                Alert.alert("Erro", result.message)
            }
        } catch (error) {
            console.error("Erro no registro:", error)
            Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft color="#00bfa5" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Criar Conta</Text>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.welcomeSection}>
                        <Text style={styles.title}>Bem-vindo!</Text>
                        <Text style={styles.subtitle}>Crie sua conta para começar a controlar suas finanças</Text>
                    </View>

                    {/* Nome */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome Completo</Text>
                        <View style={styles.inputContainer}>
                            <User color="#80cbc4" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu nome completo"
                                placeholderTextColor="#777"
                                value={formData.name}
                                onChangeText={(value) => updateFormData("name", value)}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Mail color="#80cbc4" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu email"
                                placeholderTextColor="#777"
                                value={formData.email}
                                onChangeText={(value) => updateFormData("email", value)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    {/* Senha */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Senha</Text>
                        <View style={styles.inputContainer}>
                            <Lock color="#80cbc4" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Digite sua senha"
                                placeholderTextColor="#777"
                                value={formData.password}
                                onChangeText={(value) => updateFormData("password", value)}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                                {showPassword ? <EyeOff color="#80cbc4" size={20} /> : <Eye color="#80cbc4" size={20} />}
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.passwordHint}>Mínimo de 6 caracteres</Text>
                    </View>

                    {/* Confirmar Senha */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirmar Senha</Text>
                        <View style={styles.inputContainer}>
                            <Lock color="#80cbc4" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirme sua senha"
                                placeholderTextColor="#777"
                                value={formData.confirmPassword}
                                onChangeText={(value) => updateFormData("confirmPassword", value)}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                                {showConfirmPassword ? <EyeOff color="#80cbc4" size={20} /> : <Eye color="#80cbc4" size={20} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Botão Registrar */}
                    <TouchableOpacity
                        style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.registerButtonText}>Criar Conta</Text>
                        )}
                    </TouchableOpacity>

                    {/* Link para Login */}
                    <View style={styles.loginLinkContainer}>
                        <Text style={styles.loginLinkText}>Já tem uma conta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
                            <Text style={styles.loginLink}>Fazer Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
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
        marginLeft: 16,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    welcomeSection: {
        marginBottom: 32,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#00bfa5",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#80cbc4",
        textAlign: "center",
        lineHeight: 22,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: "#80cbc4",
        marginBottom: 8,
        fontWeight: "500",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#333",
    },
    inputIcon: {
        marginLeft: 16,
    },
    input: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: "#e0e0e0",
    },
    eyeButton: {
        padding: 16,
    },
    passwordHint: {
        fontSize: 12,
        color: "#999",
        marginTop: 4,
    },
    registerButton: {
        backgroundColor: "#009688",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginTop: 8,
        marginBottom: 24,
    },
    registerButtonDisabled: {
        backgroundColor: "#006156",
        opacity: 0.7,
    },
    registerButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    loginLinkContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    loginLinkText: {
        fontSize: 14,
        color: "#80cbc4",
    },
    loginLink: {
        fontSize: 14,
        color: "#00bfa5",
        fontWeight: "600",
    },
})

export default RegisterScreen
