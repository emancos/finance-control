"use client"

import { useState, useEffect } from "react"
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    Image,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, User, Mail, Camera, Lock, LogOut, Save, Eye, EyeOff, Edit3 } from "lucide-react-native"
import { useAuth } from "../hooks/use-auth"

const ProfileScreen = () => {
    const navigation = useNavigation()
    const { user, logout, updateUser, changePassword } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        name: "",
        email: "",
    })

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name,
                email: user.email,
            })
        }
    }, [user])

    const handleLogout = () => {
        Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Sair",
                style: "destructive",
                onPress: async () => {
                    await logout()
                    navigation.navigate("Login" as never)
                },
            },
        ])
    }

    const handleUpdateProfile = async () => {
        if (!profileForm.name.trim()) {
            Alert.alert("Erro", "Nome é obrigatório")
            return
        }

        if (!profileForm.email.trim()) {
            Alert.alert("Erro", "Email é obrigatório")
            return
        }

        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(profileForm.email)) {
            Alert.alert("Erro", "Email inválido")
            return
        }

        setIsLoading(true)

        try {
            const result = await updateUser({
                name: profileForm.name,
                email: profileForm.email,
            })

            if (result.success) {
                Alert.alert("Sucesso", result.message)
                setIsEditingProfile(false)
            } else {
                Alert.alert("Erro", result.message)
            }
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error)
            Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChangePassword = async () => {
        if (!passwordForm.currentPassword) {
            Alert.alert("Erro", "Senha atual é obrigatória")
            return
        }

        if (!passwordForm.newPassword) {
            Alert.alert("Erro", "Nova senha é obrigatória")
            return
        }

        if (passwordForm.newPassword.length < 6) {
            Alert.alert("Erro", "Nova senha deve ter pelo menos 6 caracteres")
            return
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            Alert.alert("Erro", "Senhas não coincidem")
            return
        }

        setIsLoading(true)

        try {
            const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword)

            if (result.success) {
                Alert.alert("Sucesso", result.message)
                setIsChangingPassword(false)
                setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                })
            } else {
                Alert.alert("Erro", result.message)
            }
        } catch (error) {
            console.error("Erro ao alterar senha:", error)
            Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleImagePicker = () => {
        Alert.alert("Alterar Foto", "Escolha uma opção:", [
            { text: "Cancelar", style: "cancel" },
            { text: "Câmera", onPress: () => Alert.alert("Info", "Funcionalidade em desenvolvimento") },
            { text: "Galeria", onPress: () => Alert.alert("Info", "Funcionalidade em desenvolvimento") },
        ])
    }

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00bfa5" />
                    <Text style={styles.loadingText}>Carregando perfil...</Text>
                </View>
            </SafeAreaView>
        )
    }

    // Preparar dados para FlatList
    const profileData = [
        { type: "header", id: "header" },
        { type: "profile-image", id: "profile-image" },
        { type: "profile-info", id: "profile-info" },
        { type: "security", id: "security" },
        { type: "account-info", id: "account-info" },
    ]

    const renderItem = ({ item }: { item: any }) => {
        switch (item.type) {
            case "header":
                return (
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <ArrowLeft color="#00bfa5" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Meu Perfil</Text>
                        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                            <LogOut color="#f44336" size={24} />
                        </TouchableOpacity>
                    </View>
                )

            case "profile-image":
                return (
                    <View style={styles.profileImageSection}>
                        <View style={styles.profileImageContainer}>
                            {user.profileImage ? (
                                <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.profileImagePlaceholder}>
                                    <User color="#80cbc4" size={40} />
                                </View>
                            )}
                            <TouchableOpacity style={styles.cameraButton} onPress={handleImagePicker}>
                                <Camera color="#fff" size={16} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.profileName}>{user.name}</Text>
                        <Text style={styles.profileEmail}>{user.email}</Text>
                    </View>
                )

            case "profile-info":
                return (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                            <TouchableOpacity onPress={() => setIsEditingProfile(!isEditingProfile)} style={styles.editButton}>
                                <Edit3 color="#00bfa5" size={20} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.card}>
                            {/* Nome */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nome Completo</Text>
                                {isEditingProfile ? (
                                    <View style={styles.inputContainer}>
                                        <User color="#80cbc4" size={20} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={profileForm.name}
                                            onChangeText={(value) => setProfileForm((prev) => ({ ...prev, name: value }))}
                                            placeholder="Digite seu nome"
                                            placeholderTextColor="#777"
                                        />
                                    </View>
                                ) : (
                                    <Text style={styles.infoText}>{user.name}</Text>
                                )}
                            </View>

                            {/* Email */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                {isEditingProfile ? (
                                    <View style={styles.inputContainer}>
                                        <Mail color="#80cbc4" size={20} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={profileForm.email}
                                            onChangeText={(value) => setProfileForm((prev) => ({ ...prev, email: value }))}
                                            placeholder="Digite seu email"
                                            placeholderTextColor="#777"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                ) : (
                                    <Text style={styles.infoText}>{user.email}</Text>
                                )}
                            </View>

                            {isEditingProfile && (
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => {
                                            setIsEditingProfile(false)
                                            setProfileForm({
                                                name: user.name,
                                                email: user.email,
                                            })
                                        }}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                                        onPress={handleUpdateProfile}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#fff" size="small" />
                                        ) : (
                                            <>
                                                <Save color="#fff" size={16} />
                                                <Text style={styles.saveButtonText}>Salvar</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                )

            case "security":
                return (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Segurança</Text>
                            <TouchableOpacity onPress={() => setIsChangingPassword(!isChangingPassword)} style={styles.editButton}>
                                <Lock color="#00bfa5" size={20} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.card}>
                            {!isChangingPassword ? (
                                <TouchableOpacity style={styles.passwordChangeButton} onPress={() => setIsChangingPassword(true)}>
                                    <Lock color="#00bfa5" size={20} />
                                    <Text style={styles.passwordChangeText}>Alterar Senha</Text>
                                </TouchableOpacity>
                            ) : (
                                <>
                                    {/* Senha Atual */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Senha Atual</Text>
                                        <View style={styles.inputContainer}>
                                            <Lock color="#80cbc4" size={20} style={styles.inputIcon} />
                                            <TextInput
                                                style={styles.input}
                                                value={passwordForm.currentPassword}
                                                onChangeText={(value) => setPasswordForm((prev) => ({ ...prev, currentPassword: value }))}
                                                placeholder="Digite sua senha atual"
                                                placeholderTextColor="#777"
                                                secureTextEntry={!showCurrentPassword}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                                style={styles.eyeButton}
                                            >
                                                {showCurrentPassword ? <EyeOff color="#80cbc4" size={20} /> : <Eye color="#80cbc4" size={20} />}
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Nova Senha */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Nova Senha</Text>
                                        <View style={styles.inputContainer}>
                                            <Lock color="#80cbc4" size={20} style={styles.inputIcon} />
                                            <TextInput
                                                style={styles.input}
                                                value={passwordForm.newPassword}
                                                onChangeText={(value) => setPasswordForm((prev) => ({ ...prev, newPassword: value }))}
                                                placeholder="Digite sua nova senha"
                                                placeholderTextColor="#777"
                                                secureTextEntry={!showNewPassword}
                                            />
                                            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeButton}>
                                                {showNewPassword ? <EyeOff color="#80cbc4" size={20} /> : <Eye color="#80cbc4" size={20} />}
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.passwordHint}>Mínimo de 6 caracteres</Text>
                                    </View>

                                    {/* Confirmar Nova Senha */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Confirmar Nova Senha</Text>
                                        <View style={styles.inputContainer}>
                                            <Lock color="#80cbc4" size={20} style={styles.inputIcon} />
                                            <TextInput
                                                style={styles.input}
                                                value={passwordForm.confirmPassword}
                                                onChangeText={(value) => setPasswordForm((prev) => ({ ...prev, confirmPassword: value }))}
                                                placeholder="Confirme sua nova senha"
                                                placeholderTextColor="#777"
                                                secureTextEntry={!showConfirmPassword}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={styles.eyeButton}
                                            >
                                                {showConfirmPassword ? <EyeOff color="#80cbc4" size={20} /> : <Eye color="#80cbc4" size={20} />}
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity
                                            style={styles.cancelButton}
                                            onPress={() => {
                                                setIsChangingPassword(false)
                                                setPasswordForm({
                                                    currentPassword: "",
                                                    newPassword: "",
                                                    confirmPassword: "",
                                                })
                                            }}
                                        >
                                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                                            onPress={handleChangePassword}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <ActivityIndicator color="#fff" size="small" />
                                            ) : (
                                                <>
                                                    <Save color="#fff" size={16} />
                                                    <Text style={styles.saveButtonText}>Alterar</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                )

            case "account-info":
                return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Informações da Conta</Text>
                        <View style={styles.card}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Membro desde:</Text>
                                <Text style={styles.infoValue}>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Última atualização:</Text>
                                <Text style={styles.infoValue}>{new Date(user.updatedAt).toLocaleDateString("pt-BR")}</Text>
                            </View>
                        </View>
                    </View>
                )

            default:
                return null
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={profileData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
        flex: 1,
        textAlign: "center",
        marginHorizontal: 16,
    },
    logoutButton: {
        padding: 8,
    },
    content: {
        flexGrow: 1,
        padding: 16,
        paddingTop: 0,
    },
    profileImageSection: {
        alignItems: "center",
        marginBottom: 32,
    },
    profileImageContainer: {
        position: "relative",
        marginBottom: 16,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#009688",
    },
    profileImagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "rgb(40 40 40)",
        borderWidth: 3,
        borderColor: "#009688",
        justifyContent: "center",
        alignItems: "center",
    },
    cameraButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#009688",
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#121212",
    },
    profileName: {
        fontSize: 24,
        fontWeight: "700",
        color: "#e0e0e0",
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 16,
        color: "#80cbc4",
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#00bfa5",
    },
    editButton: {
        padding: 8,
        backgroundColor: "rgba(0, 191, 165, 0.1)",
        borderRadius: 8,
    },
    card: {
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 16,
        padding: 20,
        elevation: 4,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: "#80cbc4",
        marginBottom: 8,
        fontWeight: "500",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#333",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#444",
    },
    inputIcon: {
        marginLeft: 16,
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: "#e0e0e0",
    },
    eyeButton: {
        padding: 12,
    },
    infoText: {
        fontSize: 16,
        color: "#e0e0e0",
        padding: 12,
        backgroundColor: "#333",
        borderRadius: 12,
    },
    passwordHint: {
        fontSize: 12,
        color: "#999",
        marginTop: 4,
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#333",
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#80cbc4",
        fontSize: 14,
        fontWeight: "500",
    },
    saveButton: {
        flex: 1,
        backgroundColor: "#009688",
        borderRadius: 12,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    saveButtonDisabled: {
        backgroundColor: "#006156",
        opacity: 0.7,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    passwordChangeButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 191, 165, 0.1)",
        borderRadius: 12,
        padding: 16,
        gap: 8,
    },
    passwordChangeText: {
        color: "#00bfa5",
        fontSize: 16,
        fontWeight: "500",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    infoLabel: {
        fontSize: 14,
        color: "#80cbc4",
    },
    infoValue: {
        fontSize: 14,
        color: "#e0e0e0",
        fontWeight: "500",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#00bfa5",
    },
})

export default ProfileScreen
