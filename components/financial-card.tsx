import { View, Text, StyleSheet } from "react-native"

interface CardData {
    title: string
    amount: string
    type: "positive" | "negative"
}

interface FinancialCardsProps {
    data: CardData[]
}

const FinancialCards = ({ data }: FinancialCardsProps) => {
    return (
        <View style={styles.cardContainer}>
            {data.map((item, index) => (
                <View key={index} style={[styles.row, index < data.length - 1 && styles.rowWithBorder]}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.dotLine} />
                    <Text style={[styles.amount, item.type === "positive" ? styles.positive : styles.negative]}>
                        {item.amount}
                    </Text>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#1e1e1e",
        borderRadius: 16,
        padding: 12,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 4,
        elevation: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        position: "relative",
    },
    rowWithBorder: {
        borderBottomWidth: 0.5,
        borderBottomColor: "#333",
    },
    title: {
        flex: 1,
        fontSize: 13,
        color: "#b2dfdb",
        fontWeight: "500",
        textAlign: "left",
    },
    dotLine: {
        flex: 0.3,
        height: 1,
        backgroundColor: "#333",
        marginHorizontal: 4,
    },
    amount: {
        flex: 0.8,
        fontSize: 16,
        fontWeight: "700",
        textAlign: "right",
    },
    positive: {
        color: "#4caf50",
    },
    negative: {
        color: "#f44336",
    },
})

export default FinancialCards
