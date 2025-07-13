"use client"

import { useState } from "react"
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native"
import { useAuth } from "../hooks/use-auth"
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin"

// Um componente simples para o ícone do Google
const GoogleIcon = () => (
    <Image source={{ uri: "https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png" }} style={{ width: 24, height: 24 }} />
)

const LoginScreen = () => {
    const navigation = useNavigation()
    const { login, loginWithGoogle } = useAuth() // Adicionado loginWithGoogle
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false) // Estado de loading para o Google

    const handleLogin = async () => {
        if (!email.trim()) {
            Alert.alert("Erro", "Email é obrigatório")
            return
        }

        if (!password) {
            Alert.alert("Erro", "Senha é obrigatória")
            return
        }

        setIsLoading(true)

        try {
            const result = await login(email, password)

            if (result.success) {
                navigation.navigate("Main" as never)
            } else {
                Alert.alert("Erro", result.message)
            }
        } catch (error) {
            console.error("Erro no login:", error)
            Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            const googleUser = {
                name: userInfo.data?.user.name as string,
                email: userInfo.data?.user.email as string,
                profileImage: userInfo.data?.user.photo as string,
            };

            const result = await loginWithGoogle(googleUser);

            if (result.success) {
                navigation.navigate("Main" as never);
            } else {
                Alert.alert("Erro no Login com Google", result.message);
            }
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            } else if (error.code === statusCodes.IN_PROGRESS) {
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert("Erro", "Google Play Services não está disponível ou está desatualizado.");
            } else {
                console.error(error);
                Alert.alert("Erro", "Ocorreu um erro ao tentar fazer login com o Google.");
            }
        } finally {
            setIsGoogleLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.loginContainer}>
                    <Text style={styles.title}>Bem-vindo de volta!</Text>

                    <View style={styles.profileContainer}>
                        <Image style={styles.profilePhoto} source={require("../assets/icon.png")} />
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
                                value={email}
                                onChangeText={setEmail}
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
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                                {showPassword ? <EyeOff color="#80cbc4" size={20} /> : <Eye color="#80cbc4" size={20} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Botão Login */}
                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.buttonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    {/* Divisor */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OU</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Botão Google */}
                    <TouchableOpacity
                        style={[styles.googleButton, isGoogleLoading && styles.buttonDisabled]}
                        onPress={handleGoogleLogin}
                        disabled={isGoogleLoading}
                        activeOpacity={0.8}
                    >
                        {isGoogleLoading ? (
                            <ActivityIndicator color="#121212" size="small" />
                        ) : (
                            <>
                                <GoogleIcon />
                                <Text style={styles.googleButtonText}>Entrar com Google</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Link para Registro */}
                    <View style={styles.registerLinkContainer}>
                        <Text style={styles.registerLinkText}>Não tem uma conta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Register" as never)}>
                            <Text style={styles.registerLink}>Criar Conta</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    scrollContainer: {
        flexGrow: 1,
    },
    loginContainer: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
    title: {
        textAlign: "center",
        marginBottom: 24,
        fontSize: 28,
        fontWeight: "700",
        color: "#00bfa5",
    },
    profileContainer: {
        alignItems: "center",
        marginBottom: 32,
    },
    profilePhoto: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: "#009688",
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
    button: {
        backgroundColor: "#009688",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#333",
    },
    dividerText: {
        marginHorizontal: 16,
        color: "#80cbc4",
        fontWeight: "500",
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    googleButtonText: {
        color: "#121212",
        fontSize: 16,
        fontWeight: "600",
    },
    registerLinkContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
    },
    registerLinkText: {
        fontSize: 14,
        color: "#80cbc4",
    },
    registerLink: {
        fontSize: 14,
        color: "#00bfa5",
        fontWeight: "600",
    },
})

export default LoginScreen