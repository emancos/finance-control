"use client"

import { useState } from "react"
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
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, Plus, Trash2 } from "lucide-react-native"
import { Picker } from "@react-native-picker/picker"

interface Person {
    id: string
    name: string
    amount: string
}

const AddTransactionScreen = () => {
    const navigation = useNavigation()

    // Form state
    const [description, setDescription] = useState("")
    const [totalAmount, setTotalAmount] = useState("")
    const [category, setCategory] = useState("supermercado")
    const [paymentType, setPaymentType] = useState("vista")
    const [installments, setInstallments] = useState("2")
    const [isCollective, setIsCollective] = useState(false)
    const [people, setPeople] = useState<Person[]>([{ id: "1", name: "", amount: "" }])

    const categories = [
        { label: "Supermercado", value: "supermercado" },
        { label: "Veículo", value: "veiculo" },
        { label: "Farmácia", value: "farmacia" },
        { label: "Lazer", value: "lazer" },
        { label: "Alimentação", value: "alimentacao" },
        { label: "Moradia", value: "moradia" },
        { label: "Saúde", value: "saude" },
        { label: "Educação", value: "educacao" },
        { label: "Transporte", value: "transporte" },
        { label: "Vestuário", value: "vestuario" },
        { label: "Outros", value: "outros" },
    ]

    const installmentOptions = Array.from({ length: 12 }, (_, i) => ({
        label: `${i + 1}x`,
        value: (i + 1).toString(),
    }))

    const calculateInstallmentValue = () => {
        if (!totalAmount || paymentType === "vista") return ""
        const total = Number.parseFloat(totalAmount.replace(",", "."))
        const installmentCount = Number.parseInt(installments)
        if (isNaN(total) || isNaN(installmentCount)) return ""
        return (total / installmentCount).toFixed(2).replace(".", ",")
    }

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

    const handleSubmit = () => {
        if (!validateForm()) return

        // Here you would save the transaction
        Alert.alert("Sucesso", "Transação adicionada com sucesso!", [{ text: "OK", onPress: () => navigation.goBack() }])
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color="#00bfa5" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nova Transação</Text>
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

                {/* Categoria */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Categoria</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={category}
                            onValueChange={setCategory}
                            style={styles.picker}
                            dropdownIconColor="#00bfa5"
                        >
                            {categories.map((cat) => (
                                <Picker.Item key={cat.value} label={cat.label} value={cat.value} color="#e0e0e0" />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Tipo de Pagamento */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Tipo de Pagamento</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={paymentType}
                            onValueChange={setPaymentType}
                            style={styles.picker}
                            dropdownIconColor="#00bfa5"
                        >
                            <Picker.Item label="À Vista" value="vista" color="#e0e0e0" />
                            <Picker.Item label="Parcelado" value="parcelado" color="#e0e0e0" />
                        </Picker>
                    </View>
                </View>

                {/* Parcelas (se parcelado) */}
                {paymentType === "parcelado" && (
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Número de Parcelas</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={installments}
                                onValueChange={setInstallments}
                                style={styles.picker}
                                dropdownIconColor="#00bfa5"
                            >
                                {installmentOptions.map((option) => (
                                    <Picker.Item key={option.value} label={option.label} value={option.value} color="#e0e0e0" />
                                ))}
                            </Picker>
                        </View>
                        <Text style={styles.installmentInfo}>Valor por parcela: R$ {calculateInstallmentValue()}</Text>
                    </View>
                )}

                {/* Compra Coletiva */}
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

                {/* Pessoas (se coletiva) */}
                {isCollective && (
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

                {/* Botão Salvar */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Adicionar Transação</Text>
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
        backgroundColor: "#1e1e1e",
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: "#e0e0e0",
        borderWidth: 1,
        borderColor: "#333",
    },
    pickerContainer: {
        backgroundColor: "#1e1e1e",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#333",
    },
    picker: {
        color: "#e0e0e0",
        backgroundColor: "#1e1e1e",
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
        backgroundColor: "#1e1e1e",
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
        alignItems: "center",
        marginTop: 20,
        marginBottom: 40,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
})

export default AddTransactionScreen
