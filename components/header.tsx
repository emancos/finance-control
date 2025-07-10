"use client"

import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../hooks/use-auth"

interface HeaderProps {
    name: string
}

const Header = ({ name }: HeaderProps) => {
    const navigation = useNavigation()
    const { user } = useAuth()

    const handleProfilePress = () => {
        navigation.navigate("Profile" as never)
    }

    return (
        <View style={styles.header}>
            <Text style={styles.greeting}>Olá, {name}</Text>
            <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
                {user?.profileImage ? (
                    <Image source={{ uri: user.profileImage }} style={styles.profilePhoto} />
                ) : (
                    <Image style={styles.profilePhoto} source={require("../assets/profile-photo.png")} />
                )}
            </TouchableOpacity>
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
