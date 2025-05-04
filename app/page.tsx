import { StyleSheet, Text, View } from "react-native"

export default function Page() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Logbook!</Text>
            <Text style={styles.subtitle}>This is the home page.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
    },
})
