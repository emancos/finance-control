import { View, Text, Image, StyleSheet } from "react-native"

interface HeaderProps {
    name: string
}

const Header = ({ name }: HeaderProps) => {
    return (
        <View style={styles.header}>
            <Text style={styles.greeting}>Olá, {name}</Text>
            <Image style={styles.profilePhoto} source={require("../assets/profile-photo.png")} />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 28,
        width: "100%",
    },
    greeting: {
        fontSize: 22,
        fontWeight: "600",
        color: "#00bfa5",
        flex: 1,
        textAlign: "left",
    },
    profilePhoto: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: "#009688",
        marginLeft: 16,
    },
})

export default Header

