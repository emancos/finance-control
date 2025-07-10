"use client"

import { useState, useEffect } from "react"
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Switch,
    Alert,
    ActivityIndicator,
} from "react-native"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react-native"
import { Dropdown } from "react-native-element-dropdown"
import { useTransactions } from "../hooks/use-transactions"
import { getCategoryOptions } from "../utils/category-icons"
import type { Person, Transaction } from "../types/transaction"
import type { RootStackParamList } from "../types/navigation"

type AddTransactionRouteProp = RouteProp<RootStackParamList, "AddTransaction">

const AddTransactionScreen = () => {
    const navigation = useNavigation()
    const route = useRoute<AddTransactionRouteProp>()
    const { addTransaction, updateTransaction } = useTransactions()
    const [isSaving, setIsSaving] = useState(false)

    // Verificar se é modo de edição
    const editTransaction = route.params?.transaction
    const isEditMode = !!editTransaction

    // Form state
    const [description, setDescription] = useState("")
    const [totalAmount, setTotalAmount] = useState("")
    const [category, setCategory] = useState("supermercado")
    const [isCategoryFocus, setIsCategoryFocus] = useState(false)
    const [paymentType, setPaymentType] = useState("vista")
    const [isPaymentTypeFocus, setIsPaymentTypeFocus] = useState(false)
    const [installments, setInstallments] = useState("2")
    const [isInstallmentsFocus, setIsInstallmentsFocus] = useState(false)
    const [isCollective, setIsCollective] = useState(false)
    const [people, setPeople] = useState<Person[]>([{ id: "1", name: "", amount: "" }])
    const [date, setDate] = useState(new Date().toLocaleDateString("pt-BR"))
    const [time, setTime] = useState(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))
    const [notes, setNotes] = useState("")

    const categories = getCategoryOptions()

    const paymentTypeData = [
        { label: "À Vista", value: "vista" },
        { label: "Parcelado", value: "parcelado" },
    ]

    // Opções de parcelamento
    const installmentOptions = Array.from({ length: 12 }, (_, i) => ({
        label: `${i + 1}x`,
        value: (i + 1).toString(),
    }))

    // Inicializar campos quando em modo de edição
    useEffect(() => {
        if (isEditMode && editTransaction) {
            setDescription(editTransaction.description || "")
            setCategory(editTransaction.category || "supermercado")
            setDate(editTransaction.date || "")
            setTime(editTransaction.time || "")
            setNotes(editTransaction.notes || "")
            setIsCollective(editTransaction.isCollective || false)
            setPeople(editTransaction.people || [{ id: "1", name: "", amount: "" }])

            // Extrair valor numérico da string (ex: "- R$ 320,00" -> "320,00")
            const valueMatch = editTransaction.value.match(/[\d,]+/)
            if (valueMatch) {
                setTotalAmount(valueMatch[0])
            }

            // Determinar tipo de pagamento baseado no método
            if (editTransaction.paymentMethod?.includes("Parcelado")) {
                setPaymentType("parcelado")
                // Extrair número de parcelas (ex: "Parcelado 3x" -> "3")
                const installmentMatch = editTransaction.paymentMethod.match(/(\d+)x/)
                if (installmentMatch) {
                    setInstallments(installmentMatch[1])
                }
            } else {
                setPaymentType("vista")
            }
        }
    }, [isEditMode, editTransaction])

    const calculateInstallmentValue = () => {
        if (!totalAmount || paymentType === "vista") return ""
        const total = Number.parseFloat(totalAmount.replace(",", "."))
        const installmentCount = Number.parseInt(installments)
        if (isNaN(total) || isNaN(installmentCount)) return ""
        return (total / installmentCount).toFixed(2).replace(".", ",")
    }

    // Pessoa compras coletivas
    const addPerson = () => {
        const newPerson: Person = {
            id: Date.now().toString(),
            name: "",
            amount: "",
        }
        setPeople([...people, newPerson])
    }

    const removePerson = (id: string) => {
        if (people.length > 1) {
            setPeople(people.filter((person) => person.id !== id))
        }
    }

    const updatePerson = (id: string, field: "name" | "amount", value: string) => {
        setPeople(people.map((person) => (person.id === id ? { ...person, [field]: value } : person)))
    }

    const calculateCollectiveTotal = () => {
        return people.reduce((total, person) => {
            const amount = Number.parseFloat(person.amount.replace(",", ".") || "0")
            return total + amount
        }, 0)
    }

    const validateForm = () => {
        if (!description.trim()) {
            Alert.alert("Erro", "Descrição é obrigatória")
            return false
        }
        if (!totalAmount.trim()) {
            Alert.alert("Erro", "Valor é obrigatório")
            return false
        }
        if (isCollective) {
            const hasEmptyPerson = people.some((person) => !person.name.trim() || !person.amount.trim())
            if (hasEmptyPerson) {
                Alert.alert("Erro", "Preencha todos os campos das pessoas")
                return false
            }
            const total = Number.parseFloat(totalAmount.replace(",", "."))
            const collectiveTotal = calculateCollectiveTotal()
            if (Math.abs(total - collectiveTotal) > 0.01) {
                Alert.alert("Erro", "A soma dos valores individuais deve ser igual ao valor total")
                return false
            }
        }
        return true
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsSaving(true)

        try {
            if (isEditMode && editTransaction) {
                // Modo de edição - atualizar transação existente
                const updatedTransaction: Transaction = {
                    ...editTransaction, // Manter dados originais (id, timestamp, etc.)
                    description,
                    value: editTransaction.type === "positive" ? `+ R$ ${totalAmount}` : `- R$ ${totalAmount}`,
                    date,
                    category: editTransaction.type === "negative" ? category : editTransaction.category,
                    time,
                    paymentMethod:
                        editTransaction.type === "negative"
                            ? paymentType === "vista"
                                ? "À Vista"
                                : `Parcelado ${installments}x`
                            : editTransaction.paymentMethod,
                    notes,
                    installments:
                        editTransaction.type === "negative" && paymentType === "parcelado"
                            ? Number.parseInt(installments)
                            : undefined,
                    installmentValue:
                        editTransaction.type === "negative" && paymentType === "parcelado"
                            ? calculateInstallmentValue()
                            : undefined,
                    isCollective: editTransaction.type === "negative" ? isCollective : false,
                    people: editTransaction.type === "negative" && isCollective ? people : undefined,
                }

                const success = await updateTransaction(updatedTransaction)

                if (success) {
                    Alert.alert("Sucesso", "Transação atualizada com sucesso!", [
                        { text: "OK", onPress: () => navigation.goBack() },
                    ])
                } else {
                    Alert.alert("Erro", "Não foi possível atualizar a transação. Tente novamente.")
                }
            } else {
                // Modo de adição - criar nova transação
                const transactionData = {
                    description,
                    value: `- R$ ${totalAmount}`,
                    date,
                    type: "negative" as const,
                    category,
                    time,
                    paymentMethod: paymentType === "vista" ? "À Vista" : `Parcelado ${installments}x`,
                    notes,
                    installments: paymentType === "parcelado" ? Number.parseInt(installments) : undefined,
                    installmentValue: paymentType === "parcelado" ? calculateInstallmentValue() : undefined,
                    isCollective,
                    people: isCollective ? people : undefined,
                }

                const success = await addTransaction(transactionData)

                if (success) {
                    Alert.alert("Sucesso", "Transação adicionada com sucesso!", [
                        { text: "OK", onPress: () => navigation.goBack() },
                    ])
                } else {
                    Alert.alert("Erro", "Não foi possível salvar a transação. Tente novamente.")
                }
            }
        } catch (error) {
            console.error("Erro ao salvar transação:", error)
            Alert.alert("Erro", "Ocorreu um erro ao salvar a transação.")
        } finally {
            setIsSaving(false)
        }
    }

    // Determinar se deve mostrar campos específicos de despesas
    const showExpenseFields = !isEditMode || (isEditMode && editTransaction?.type === "negative")

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color="#00bfa5" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditMode ? "Editar Transação" : "Nova Transação"}</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Descrição */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Descrição</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Compras do mês"
                        placeholderTextColor="#777"
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                {/* Valor Total */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Valor Total</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0,00"
                        placeholderTextColor="#777"
                        value={totalAmount}
                        onChangeText={setTotalAmount}
                        keyboardType="numeric"
                    />
                </View>

                {/* Data e Hora */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Data e Hora</Text>
                    <View style={styles.dateTimeContainer}>
                        <TextInput
                            style={[styles.input, styles.dateInput]}
                            placeholder="DD/MM/AAAA"
                            placeholderTextColor="#777"
                            value={date}
                            onChangeText={setDate}
                        />
                        <TextInput
                            style={[styles.input, styles.timeInput]}
                            placeholder="HH:MM"
                            placeholderTextColor="#777"
                            value={time}
                            onChangeText={setTime}
                        />
                    </View>
                </View>

                {/* Categoria - apenas para despesas */}
                {showExpenseFields && (
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Categoria</Text>
                        <Dropdown
                            style={[styles.dropdown, isCategoryFocus && { borderColor: "#00bfa5" }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            containerStyle={styles.dropdownContainer}
                            itemContainerStyle={styles.itemContainer}
                            itemTextStyle={styles.itemText}
                            activeColor="rgb(50, 50, 50)"
                            iconStyle={styles.iconStyle}
                            data={categories}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isCategoryFocus ? "Selecione a categoria" : "..."}
                            value={category}
                            onFocus={() => setIsCategoryFocus(true)}
                            onBlur={() => setIsCategoryFocus(false)}
                            onChange={(item) => {
                                setCategory(item.value)
                                setIsCategoryFocus(false)
                            }}
                        />
                    </View>
                )}

                {/* Tipo de Pagamento - apenas para despesas */}
                {showExpenseFields && (
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Tipo de Pagamento</Text>
                        <Dropdown
                            style={[styles.dropdown, isPaymentTypeFocus && { borderColor: "#00bfa5" }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            containerStyle={styles.dropdownContainer}
                            itemContainerStyle={styles.itemContainer}
                            itemTextStyle={styles.itemText}
                            activeColor="rgb(50, 50, 50)"
                            iconStyle={styles.iconStyle}
                            data={paymentTypeData}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isPaymentTypeFocus ? "Selecione o tipo de pagamento" : "..."}
                            value={paymentType}
                            onFocus={() => setIsPaymentTypeFocus(true)}
                            onBlur={() => setIsPaymentTypeFocus(false)}
                            onChange={(item) => {
                                setPaymentType(item.value)
                                setIsPaymentTypeFocus(false)
                            }}
                        />
                    </View>
                )}

                {/* Parcelas (se parcelado) - apenas para despesas */}
                {showExpenseFields && paymentType === "parcelado" && (
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Número de Parcelas</Text>
                        <Dropdown
                            style={[styles.dropdown, isInstallmentsFocus && { borderColor: "#00bfa5" }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            containerStyle={styles.dropdownContainer}
                            itemContainerStyle={styles.itemContainer}
                            itemTextStyle={styles.itemText}
                            activeColor="rgb(50, 50, 50)"
                            iconStyle={styles.iconStyle}
                            data={installmentOptions}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isInstallmentsFocus ? "Selecione o número de parcelas" : "..."}
                            value={installments}
                            onFocus={() => setIsInstallmentsFocus(true)}
                            onBlur={() => setIsInstallmentsFocus(false)}
                            onChange={(item) => {
                                setInstallments(item.value)
                                setIsInstallmentsFocus(false)
                            }}
                        />
                        <Text style={styles.installmentInfo}>Valor por parcela: R$ {calculateInstallmentValue()}</Text>
                    </View>
                )}

                {/* Compra Coletiva - apenas para despesas */}
                {showExpenseFields && (
                    <View style={styles.formGroup}>
                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>Compra Coletiva</Text>
                            <Switch
                                value={isCollective}
                                onValueChange={setIsCollective}
                                trackColor={{ false: "#333", true: "#00bfa5" }}
                                thumbColor={isCollective ? "#fff" : "#ccc"}
                            />
                        </View>
                    </View>
                )}

                {/* Pessoas (se coletiva) - apenas para despesas */}
                {showExpenseFields && isCollective && (
                    <View style={styles.formGroup}>
                        <View style={styles.peopleHeader}>
                            <Text style={styles.label}>Divisão por Pessoa</Text>
                            <TouchableOpacity onPress={addPerson} style={styles.addButton}>
                                <Plus color="#00bfa5" size={20} />
                            </TouchableOpacity>
                        </View>

                        {people.map((person, index) => (
                            <View key={person.id} style={styles.personContainer}>
                                <View style={styles.personInputs}>
                                    <TextInput
                                        style={[styles.input, styles.personNameInput]}
                                        placeholder="Nome da pessoa"
                                        placeholderTextColor="#777"
                                        value={person.name}
                                        onChangeText={(value) => updatePerson(person.id, "name", value)}
                                    />
                                    <TextInput
                                        style={[styles.input, styles.personAmountInput]}
                                        placeholder="0,00"
                                        placeholderTextColor="#777"
                                        value={person.amount}
                                        onChangeText={(value) => updatePerson(person.id, "amount", value)}
                                        keyboardType="numeric"
                                    />
                                </View>
                                {people.length > 1 && (
                                    <TouchableOpacity onPress={() => removePerson(person.id)} style={styles.removeButton}>
                                        <Trash2 color="#f44336" size={20} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}

                        <Text style={styles.collectiveTotal}>
                            Total dividido: R$ {calculateCollectiveTotal().toFixed(2).replace(".", ",")}
                        </Text>
                    </View>
                )}

                {/* Observações */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Observações</Text>
                    <TextInput
                        style={[styles.input, styles.notesInput]}
                        placeholder="Observações adicionais"
                        placeholderTextColor="#777"
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </View>

                {/* Botão Salvar */}
                <TouchableOpacity
                    style={[styles.submitButton, isSaving && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <>
                            {isEditMode ? <Save color="#fff" size={20} /> : <Plus color="#fff" size={20} />}
                            <Text style={styles.submitButtonText}>{isEditMode ? "Salvar Alterações" : "Adicionar Transação"}</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
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
        flex: 1,
        padding: 16,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: "#80cbc4",
        marginBottom: 8,
        fontWeight: "500",
    },
    input: {
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: "#e0e0e0",
        borderWidth: 1,
        borderColor: "#333",
    },
    dateTimeContainer: {
        flexDirection: "row",
        gap: 12,
    },
    dateInput: {
        flex: 2,
    },
    timeInput: {
        flex: 1,
    },
    notesInput: {
        minHeight: 80,
        paddingTop: 12,
    },
    dropdown: {
        height: 48,
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#333",
    },
    dropdownContainer: {
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 12,
        borderWidth: 0,
        marginTop: 4,
    },
    itemContainer: {
        borderRadius: 12,
    },
    itemText: {
        color: "#e0e0e0",
    },
    placeholderStyle: {
        fontSize: 16,
        color: "#777",
    },
    selectedTextStyle: {
        fontSize: 16,
        color: "#e0e0e0",
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    installmentInfo: {
        marginTop: 8,
        fontSize: 14,
        color: "#00bfa5",
        fontWeight: "500",
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    peopleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    addButton: {
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 20,
        padding: 8,
        borderWidth: 1,
        borderColor: "#00bfa5",
    },
    personContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    personInputs: {
        flex: 1,
        flexDirection: "row",
        gap: 8,
    },
    personNameInput: {
        flex: 2,
    },
    personAmountInput: {
        flex: 1,
    },
    removeButton: {
        marginLeft: 8,
        padding: 8,
    },
    collectiveTotal: {
        fontSize: 14,
        color: "#00bfa5",
        fontWeight: "500",
        textAlign: "center",
        marginTop: 8,
    },
    submitButton: {
        backgroundColor: "#009688",
        borderRadius: 28,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 20,
        marginBottom: 40,
    },
    submitButtonDisabled: {
        backgroundColor: "#006156",
        opacity: 0.7,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
})

export default AddTransactionScreen
