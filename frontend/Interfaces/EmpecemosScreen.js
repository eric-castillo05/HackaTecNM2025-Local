import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const EmpecemosScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent />

            {/* Elementos decorativos de fondo */}
            <View style={styles.backgroundElements}>
                <View style={styles.circleTop}></View>
                <View style={styles.circleBottom}></View>
                <View style={styles.circleAccent}></View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="rocket-outline" size={48} color="#3AAFA9" />
                    </View>
                    <Text style={styles.title}>¡Empecemos!</Text>
                    <Text style={styles.subtitle}>
                        Únete a nuestra comunidad y descubre todo lo que tenemos para ti
                    </Text>
                </View>

                {/* Illustration Section */}
                <View style={styles.illustrationSection}>
                    <View style={styles.mainIllustration}>
                        <View style={styles.illustrationCircle}>
                            <Ionicons name="person-add-outline" size={64} color="#fff" />
                        </View>
                        <View style={styles.floatingElements}>
                            <View style={[styles.floatingDot, styles.dot1]} />
                            <View style={[styles.floatingDot, styles.dot2]} />
                            <View style={[styles.floatingDot, styles.dot3]} />
                        </View>
                    </View>
                </View>

                {/* Buttons Section */}
                <View style={styles.buttonsSection}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('SignUp')}
                        activeOpacity={0.8}
                    >
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => navigation.navigate('SignUp')}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="person-add" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.primaryButtonText}>Crear Cuenta</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('SignIn')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="log-in-outline" size={20} color="#3AAFA9" style={styles.buttonIcon} />
                        <Text style={styles.secondaryButtonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Section */}
                <View style={styles.footerSection}>
                    <Text style={styles.footerText}>
                        Al continuar, aceptas nuestros términos y condiciones
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFBFC',
    },
    backgroundElements: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
    circleTop: {
        position: 'absolute',
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        backgroundColor: 'rgba(58, 175, 169, 0.08)',
        top: -width * 0.3,
        right: -width * 0.2,
    },
    circleBottom: {
        position: 'absolute',
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
        backgroundColor: 'rgba(250, 246, 239, 0.8)',
        bottom: -width * 0.2,
        left: -width * 0.15,
    },
    circleAccent: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(58, 175, 169, 0.15)',
        top: height * 0.15,
        left: width * 0.1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingTop: 60,
        paddingHorizontal: 24,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(58, 175, 169, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#1A202C',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    illustrationSection: {
        alignItems: 'center',
        marginBottom: 50,
    },
    mainIllustration: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    illustrationCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#3AAFA9',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3AAFA9',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    floatingElements: {
        position: 'absolute',
        width: 200,
        height: 200,
    },
    floatingDot: {
        position: 'absolute',
        borderRadius: 8,
        backgroundColor: '#3AAFA9',
    },
    dot1: {
        width: 12,
        height: 12,
        top: 20,
        right: 30,
        opacity: 0.6,
    },
    dot2: {
        width: 8,
        height: 8,
        bottom: 40,
        left: 20,
        opacity: 0.4,
    },
    dot3: {
        width: 16,
        height: 16,
        top: 60,
        left: 10,
        opacity: 0.3,
    },
    buttonsSection: {
        marginBottom: 30,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    secondaryButtonText: {
        color: '#3AAFA9',
        fontSize: 16,
        fontWeight: '600',
    },
    footerSection: {
        alignItems: 'center',
        paddingBottom: 30,
    },
    footerText: {
        fontSize: 12,
        color: '#A0AEC0',
        textAlign: 'center',
        lineHeight: 18,
    },
    primaryButton: {
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: '#3AAFA9', // Solid background color
        shadowColor: '#3AAFA9',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
        paddingVertical: 18,
        paddingHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonIcon: {
        marginRight: 8,
    },
});

export default EmpecemosScreen;