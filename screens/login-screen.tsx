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
} from "react-native"
import { useNavigation } from "@react-navigation/native"

const LoginScreen = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigation = useNavigation()

    const handleLogin = () => {
        navigation.navigate("Main" as never)
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.loginContainer}>
                    <Text style={styles.title}>Bem-vindo(a)!</Text>

                    <View style={styles.profileContainer}>
                        <Image style={styles.profilePhoto} source={require("../assets/icon.png")} />
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor="#777"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="#777"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </TouchableOpacity>
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
        fontWeight: "600",
        color: "#00bfa5",
    },
    profileContainer: {
        alignItems: "center",
        marginBottom: 24,
    },
    profilePhoto: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: "#009688",
    },
    input: {
        width: "100%",
        padding: 12,
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: "rgb(40 40 40)",
        color: "#e0e0e0",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#009688",
        borderRadius: 28,
        padding: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
})

export default LoginScreen
