import { View, Text, Image, StyleSheet } from "react-native"

interface HeaderProps {
    name: string
    profileImage: string
}

const Header = ({ name, profileImage }: HeaderProps) => {
    return (
        <View style={styles.header}>
            <Text style={styles.greeting}>Olá, {name}</Text>
            <Image style={styles.profilePhoto} source={{ uri: profileImage }} />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 28,
    },
    greeting: {
        fontSize: 22,
        fontWeight: "600",
        color: "#00bfa5",
    },
    profilePhoto: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: "#009688",
    },
})

export default Header
