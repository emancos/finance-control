import type React from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native"

export interface CategoryData {
    id: string
    name: string
    total: number 
    formattedTotal: string
    icon: React.ComponentType<any>
    color: string
    percentage: number
}

interface CategoryCarouselProps {
    categories: CategoryData[]
    onCategoryPress?: (category: CategoryData) => void
}

const { width: screenWidth } = Dimensions.get("window")
const cardWidth = screenWidth * 0.4 // 40% da largura da tela

const CategoryCarousel = ({ categories, onCategoryPress }: CategoryCarouselProps) => {
    const renderCategoryCard = ({ item }: { item: CategoryData }) => {
        const IconComponent = item.icon

        return (
            <TouchableOpacity style={styles.categoryCard} onPress={() => onCategoryPress?.(item)} activeOpacity={0.7}>
                <View style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}>
                    <IconComponent color={item.color} size={24} />
                </View>

                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.categoryTotal}>{item.formattedTotal}</Text>

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
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Gastos por Categoria</Text>
                <TouchableOpacity style={styles.seeAllButton}>
                    <Text style={styles.seeAllText}>Ver todas</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={categories}
                renderItem={renderCategoryCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContent}
                snapToInterval={cardWidth + 12} // card width + margin
                decelerationRate="fast"
                snapToAlignment="start"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#00bfa5",
    },
    seeAllButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    seeAllText: {
        fontSize: 14,
        color: "#80cbc4",
        fontWeight: "500",
    },
    carouselContent: {
        paddingLeft: 4,
        paddingRight: 16,
    },
    categoryCard: {
        width: cardWidth,
        backgroundColor: "rgb(40 40 40)",
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    categoryName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#e0e0e0",
        marginBottom: 4,
    },
    categoryTotal: {
        fontSize: 18,
        fontWeight: "700",
        color: "#f44336",
        marginBottom: 12,
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    progressBackground: {
        flex: 1,
        height: 4,
        backgroundColor: "#333",
        borderRadius: 2,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        borderRadius: 2,
    },
    percentageText: {
        fontSize: 12,
        color: "#80cbc4",
        fontWeight: "500",
        minWidth: 32,
        textAlign: "right",
    },
})

export default CategoryCarousel
