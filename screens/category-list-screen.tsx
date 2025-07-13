import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from "react-native"
import { TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTransactions } from "../hooks/use-transactions"
import type { CategoryTotal } from "../types/transaction"
import { RootStackNavigationProp } from "../types/navigation"

const CategoryListScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const { categoryTotals, isLoading } = useTransactions()

    const handleCategoryPress = (category: CategoryTotal) => {
        navigation.navigate("CategoryTransactions", { category })
    }

    const renderCategoryItem = ({ item }: { item: CategoryTotal }) => {
        const IconComponent = item.icon

        return (
            <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategoryPress(item)} activeOpacity={0.7}>
                <View style={styles.categoryContent}>
                    <View style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}>
                        <IconComponent color={item.color} size={24} />
                    </View>

                    <View style={styles.categoryInfo}>
                        <Text style={styles.categoryName}>{item.name}</Text>
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBackground}>
                                <View
                                    style={[
                                        styles.progressBar,
                                        {
                                            width: `${Math.min(item.percentage, 100)}%`,
                                            backgroundColor: item.color,
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={styles.percentageText}>{item.percentage}%</Text>
                        </View>
                    </View>

                    <View style={styles.categoryValue}>
                        <Text style={styles.categoryTotal}>{item.formattedTotal}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma categoria encontrada</Text>
            <Text style={styles.emptySubtext}>Adicione transações para ver os gastos por categoria</Text>
        </View>
    )

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Categorias</Text>
        </View>
    )

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                {renderHeader()}
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00bfa5" />
                    <Text style={styles.loadingText}>Carregando categorias...</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={categoryTotals}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyList}
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
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#00bfa5",
        textAlign: "center",
    },
    listContent: {
        flexGrow: 1,
        padding: 16,
        paddingTop: 0,
    },
    categoryItem: {
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    categoryContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#e0e0e0",
        marginBottom: 8,
        textTransform: "capitalize",
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    progressBackground: {
        flex: 1,
        height: 6,
        backgroundColor: "#333",
        borderRadius: 3,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        borderRadius: 3,
    },
    percentageText: {
        fontSize: 12,
        color: "#80cbc4",
        fontWeight: "500",
        minWidth: 32,
        textAlign: "right",
    },
    categoryValue: {
        alignItems: "flex-end",
    },
    categoryTotal: {
        fontSize: 18,
        fontWeight: "700",
        color: "#f44336",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    emptyText: {
        fontSize: 18,
        color: "#e0e0e0",
        marginBottom: 8,
        textAlign: "center",
    },
    emptySubtext: {
        fontSize: 14,
        color: "#80cbc4",
        textAlign: "center",
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

export default CategoryListScreen
