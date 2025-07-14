"use client"

import { useState, useEffect } from "react"
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    TextInput,
    Alert,
    ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, DollarSign, Save } from "lucide-react-native"
import { useSettings } from "../hooks/use-settings"

const SettingsScreen = () => {
    const navigation = useNavigation()
    const { settings, updateSalary, isLoading } = useSettings()
    const [salary, setSalary] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (settings && settings.salary > 0) {
            setSalary(settings.salary.toString().replace(".", ","))
        }
    }, [settings])

    const handleSaveSalary = async () => {
        if (!salary.trim()) {
            Alert.alert("Erro", "Por favor, informe o valor do salário")
            return
        }

        const numericSalary = Number.parseFloat(salary.replace(",", "."))
        if (isNaN(numericSalary) || numericSalary <= 0) {
            Alert.alert("Erro", "Por favor, informe um valor válido para o salário")
            return
        }

        setIsSaving(true)

        try {
            const success = await updateSalary(numericSalary)
            if (success) {
                Alert.alert("Sucesso", "Salário atualizado com sucesso!", [{ text: "OK", onPress: () => navigation.goBack() }])
            } else {
                Alert.alert("Erro", "Não foi possível salvar o salário. Tente novamente.")
            }
        } catch (error) {
            console.error("Erro ao salvar salário:", error)
            Alert.alert("Erro", "Ocorreu um erro ao salvar o salário.")
        } finally {
            setIsSaving(false)
        }
    }

    const formatSalaryDisplay = (value: number) => {
        return `R$ ${value.toFixed(2).replace(".", ",")}`
    }

    // Preparar dados para FlatList
    const settingsData = [
        { type: "header", id: "header" },
        { type: "salary-section", id: "salary-section" },
        { type: "info-section", id: "info-section" },
    ]

    const renderItem = ({ item }: { item: any }) => {
        switch (item.type) {
            case "header":
                return (
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <ArrowLeft color="#00bfa5" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Configurações</Text>
                    </View>
                )

            case "salary-section":
                return (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <DollarSign color="#00bfa5" size={24} />
                            <Text style={styles.sectionTitle}>Configuração de Salário</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Salário Mensal</Text>
                            <Text style={styles.cardSubtitle}>
                                Configure seu salário mensal para cálculos automáticos de saldo disponível
                            </Text>

                            {settings && settings.salary > 0 && (
                                <View style={styles.currentSalaryContainer}>
                                    <Text style={styles.currentSalaryLabel}>Salário atual:</Text>
                                    <Text style={styles.currentSalaryValue}>{formatSalaryDisplay(settings.salary)}</Text>
                                </View>
                            )}

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Novo salário</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0,00"
                                    placeholderTextColor="#777"
                                    value={salary}
                                    onChangeText={setSalary}
                                    keyboardType="numeric"
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                                onPress={handleSaveSalary}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <>
                                        <Save color="#fff" size={20} />
                                        <Text style={styles.saveButtonText}>Salvar Salário</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )

            case "info-section":
                return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Como funciona</Text>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>Cálculos Automáticos</Text>
                            <Text style={styles.infoText}>
                                • <Text style={styles.highlight}>Salário Disponível:</Text> Salário mensal menos gastos totais
                            </Text>
                            <Text style={styles.infoText}>
                                • <Text style={styles.highlight}>Saldo Devedor:</Text> Soma das parcelas pendentes de compras parceladas
                            </Text>
                            <Text style={styles.infoText}>
                                • <Text style={styles.highlight}>Resumo Gastos:</Text> Total de todas as despesas do período
                            </Text>
                        </View>
                    </View>
                )

            default:
                return null
        }
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft color="#00bfa5" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Configurações</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00bfa5" />
                    <Text style={styles.loadingText}>Carregando configurações...</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={settingsData}
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
        flexGrow: 1,
        padding: 16,
        paddingTop: 0,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#00bfa5",
        marginLeft: 8,
    },
    card: {
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 16,
        padding: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#e0e0e0",
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#80cbc4",
        marginBottom: 16,
        lineHeight: 20,
    },
    currentSalaryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#333",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    currentSalaryLabel: {
        fontSize: 14,
        color: "#80cbc4",
    },
    currentSalaryValue: {
        fontSize: 16,
        fontWeight: "700",
        color: "#4caf50",
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: "#80cbc4",
        marginBottom: 8,
        fontWeight: "500",
    },
    input: {
        backgroundColor: "#333",
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: "#e0e0e0",
        borderWidth: 1,
        borderColor: "#444",
    },
    saveButton: {
        backgroundColor: "#009688",
        borderRadius: 12,
        padding: 16,
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
        fontSize: 16,
        fontWeight: "600",
    },
    infoCard: {
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 16,
        padding: 20,
        elevation: 2,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#e0e0e0",
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: "#b0b0b0",
        marginBottom: 8,
        lineHeight: 20,
    },
    highlight: {
        color: "#00bfa5",
        fontWeight: "600",
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

export default SettingsScreen