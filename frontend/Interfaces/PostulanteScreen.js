// DashboardAdopcionScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Alert,
    SafeAreaView,
    Image
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const PostulanteScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [userName] = useState(route?.params?.userName || 'Usuario');
    const [userEmail] = useState(route?.params?.userEmail || 'usuario@email.com');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        animateIn();
    }, []);

    const animateIn = () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(0);
        scaleAnim.setValue(0.9);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 80,
                friction: 8,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que deseas cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Cerrar Sesión",
                    style: "destructive",
                    onPress: () => navigation.navigate('Login')
                }
            ]
        );
    };

    // Menú principal simplificado con 4 opciones principales
    const menuItems = [
        {
            id: 'formulario',
            title: 'Formulario de Adopción',
            subtitle: 'Completa tu solicitud de adopción',
            icon: 'assignment',
            iconLibrary: 'MaterialIcons',
            color: '#3AAFA9',
            action: () => navigation.navigate('Formulario'),
            status: 'available',
            priority: 'high'
        },
        {
            id: 'seguimiento',
            title: 'Seguimiento del Proceso',
            subtitle: 'Revisa el estado de tu solicitud',
            icon: 'timeline',
            iconLibrary: 'MaterialIcons',
            color: '#667eea',
            action: () => navigation.navigate('Seguimiento'),
            status: 'available',
            priority: 'high'
        },
        {
            id: 'citas',
            title: 'Citas y Entrevistas',
            subtitle: 'Programa y consulta tus citas',
            icon: 'event',
            iconLibrary: 'MaterialIcons',
            color: '#4facfe',
            action: () => navigation.navigate('Citas'),
            status: 'available',
            priority: 'medium'
        },
        {
            id: 'recursos',
            title: 'Recursos y Guías',
            subtitle: 'Información y apoyo para el proceso',
            icon: 'library-books',
            iconLibrary: 'MaterialIcons',
            color: '#a18cd1',
            action: () => navigation.navigate('Recursos'),
            status: 'available',
            priority: 'medium'
        }
    ];

    const renderStatusBadge = (status, priority) => {
        if (priority === 'high') {
            return (
                <View style={styles.priorityBadge}>
                    <Text style={styles.priorityText}>Principal</Text>
                </View>
            );
        }
        return null;
    };

    const renderMenuItem = (item, index) => {
        const isHighPriority = item.priority === 'high';

        return (
            <Animated.View
                key={item.id}
                style={[
                    {
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            {
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [50 * (index + 1), 0]
                                })
                            }
                        ]
                    }
                ]}
            >
                <TouchableOpacity
                    style={[
                        styles.menuItem,
                        isHighPriority && styles.menuItemHighPriority
                    ]}
                    onPress={item.action}
                    activeOpacity={0.7}
                >
                    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                        <MaterialIcons
                            name={item.icon}
                            size={28}
                            color="#fff"
                        />
                    </View>

                    <View style={styles.menuItemContent}>
                        <View style={styles.titleRow}>
                            <Text style={styles.menuItemTitle}>
                                {item.title}
                            </Text>
                            {renderStatusBadge(item.status, item.priority)}
                        </View>
                        <Text style={styles.menuItemSubtitle}>
                            {item.subtitle}
                        </Text>
                    </View>

                    <View style={styles.arrowContainer}>
                        <MaterialIcons
                            name="chevron-right"
                            size={24}
                            color="#6b7280"
                        />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Header simple */}
            <View style={styles.simpleHeader}>
                <Text style={styles.appTitle}>Centro de Adopción</Text>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => Alert.alert('Perfil', 'Funcionalidad de perfil')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="account-circle" size={28} color="#3AAFA9" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Tarjeta de perfil */}
                <Animated.View
                    style={[
                        styles.profileCard,
                        {
                            opacity: fadeAnim,
                            transform: [{
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [30, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <View style={styles.profileCardContent}>
                        <View style={styles.avatarContainer}>
                            <MaterialIcons name="person" size={32} color="#3AAFA9" />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.welcomeText}>¡Hola, {userName}!</Text>
                            <Text style={styles.userEmailCard}>{userEmail}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons name="logout" size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                {/* Mensaje de bienvenida */}
                <Animated.View
                    style={[
                        styles.welcomeCard,
                        {
                            opacity: fadeAnim,
                            transform: [{
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [30, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <MaterialIcons name="favorite" size={24} color="#3AAFA9" />
                    <Text style={styles.welcomeCardTitle}>¡Comienza tu proceso de adopción!</Text>
                    <Text style={styles.welcomeCardText}>
                        Te acompañamos en cada paso. Comienza llenando el formulario de adopción.
                    </Text>
                </Animated.View>

                {/* Menu Items */}
                <Animated.View
                    style={[
                        styles.menuContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [40, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <Text style={styles.sectionTitle}>Opciones Principales</Text>
                    {menuItems.map((item, index) => renderMenuItem(item, index))}
                </Animated.View>

                {/* Info adicional */}
                <Animated.View
                    style={[
                        styles.infoCard,
                        {
                            opacity: fadeAnim,
                            transform: [{
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [50, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <MaterialIcons name="info" size={20} color="#6b7280" />
                    <Text style={styles.infoText}>
                        ¿Necesitas ayuda? Contacta a nuestro equipo de soporte desde la sección de Recursos y Guías.
                    </Text>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    simpleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    appTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1f2937',
        letterSpacing: 0.3,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    content: {
        flex: 1,
    },
    profileCard: {
        backgroundColor: '#fff',
        margin: 20,
        marginBottom: 10,
        padding: 20,
        borderRadius: 20,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    profileCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f9ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#e0f2fe',
    },
    profileInfo: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 16,
        color: '#1f2937',
        fontWeight: '700',
        marginBottom: 2,
    },
    userEmailCard: {
        fontSize: 13,
        color: '#6b7280',
        fontWeight: '400',
    },
    logoutButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    welcomeCard: {
        backgroundColor: '#fff',
        margin: 20,
        marginBottom: 10,
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    welcomeCardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginTop: 10,
        marginBottom: 8,
        textAlign: 'center',
    },
    welcomeCardText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 20,
    },
    menuContainer: {
        padding: 20,
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1f2937',
        marginBottom: 20,
        letterSpacing: 0.3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    menuItemHighPriority: {
        borderWidth: 2,
        borderColor: '#3AAFA9',
        shadowColor: '#3AAFA9',
        shadowOpacity: 0.15,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    menuItemContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        flex: 1,
        marginRight: 8,
    },
    menuItemSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '400',
        lineHeight: 20,
    },
    priorityBadge: {
        backgroundColor: '#3AAFA9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    priorityText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
    },
    arrowContainer: {
        marginLeft: 12,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        margin: 20,
        marginTop: 0,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    infoText: {
        fontSize: 13,
        color: '#6b7280',
        marginLeft: 12,
        flex: 1,
        lineHeight: 18,
    },
});

export default PostulanteScreen;