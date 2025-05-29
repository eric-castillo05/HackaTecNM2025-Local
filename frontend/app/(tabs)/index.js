import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const AdopcionScreen = () => {
    return (
        <ScrollView style={styles.container}>
            {/* Imagen de la familia */}
            <Image
                source={require('../../assets/familia.png')} // Asegúrate de tener esta imagen localmente
                style={styles.topImage}
                resizeMode="cover"
            />

            {/* Título principal */}
            <Text style={styles.title}>¿Quieres Adoptar?</Text>
            <Text style={styles.subtitle}>
                Estamos aquí para ayudarle a encontrar la familia adecuada para su hijo.
            </Text>

            {/* Carrusel de puntos (simulado) */}
            <View style={styles.dotsContainer}>
                <View style={styles.activeDot} />
                <View style={styles.inactiveDot} />
                <View style={styles.inactiveDot} />
                <View style={styles.inactiveDot} />
            </View>

            {/* Imagen del niño */}
            <Image
                source={require('../../assets/niño.png')} // Asegúrate de tener esta imagen localmente
                style={styles.kidImage}
                resizeMode="cover"
            />

            {/* Texto informativo */}
            <Text style={styles.description}>
                En México, miles de niñas y niños esperan la oportunidad de crecer en un hogar lleno de amor, cuidado y estabilidad. Según el DIF, más de 30,000 menores viven en casas hogar o bajo tutela institucional, muchos de ellos en espera de una familia definitiva.
                {"\n\n"}
                La adopción es un acto de amor que cambia vidas, pero el proceso puede ser largo, complejo y poco claro. Nuestra app nace para acompañarte en cada paso, brindando información verificada, seguimiento personalizado y herramientas para facilitar la conexión entre familias y autoridades.
                {"\n\n"}
                Creemos en una adopción segura, transparente y humana. Ya seas padre o madre en formación, servidor público o persona interesada, aquí encontrarás un espacio confiable para informarte, avanzar y apoyar.
            </Text>

            {/* Botón */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Empezar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topImage: {
        width: '100%',
        height: 250,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2aa198',
        textAlign: 'center',
        marginTop: 16,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 20,
        marginTop: 8,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    activeDot: {
        width: 8,
        height: 8,
        backgroundColor: '#333',
        borderRadius: 4,
        marginHorizontal: 4,
    },
    inactiveDot: {
        width: 8,
        height: 8,
        backgroundColor: '#ccc',
        borderRadius: 4,
        marginHorizontal: 4,
    },
    kidImage: {
        width: '100%',
        height: 200,
    },
    description: {
        fontSize: 14,
        paddingHorizontal: 20,
        marginTop: 16,
        marginBottom: 20,
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#2aa198',
        margin: 20,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default AdopcionScreen;
