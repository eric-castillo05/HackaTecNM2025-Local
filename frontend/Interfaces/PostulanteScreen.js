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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';

const { width, height } = Dimensions.get('window');

const PostulanteScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [userName] = useState(route?.params?.userName || 'Usuario');
    const [userEmail] = useState(route?.params?.userEmail || 'usuario@email.com');
    const [activeTab, setActiveTab] = useState('adoptar');
    const [userID] = useState(route?.params?.userID || '12345'); // ID único del usuario

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    // Datos de ejemplo para hijos adoptados
    const [adoptedChildren] = useState([
        {
            id: 1,
            name: 'María Elena',
            age: 8,
            adoptionDate: '2023-03-15',
            status: 'Adoptado',
            photo: null // Placeholder para foto
        },
        {
            id: 2,
            name: 'Carlos Andrés',
            age: 5,
            adoptionDate: '2024-01-20',
            status: 'En proceso de adaptación',
            photo: null
        }
    ]);

    useEffect(() => {
        animateIn();
    }, [activeTab]);

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
                    onPress: async () => {
                        try {
                            await AsyncStorage.multiRemove([
                                'userToken',
                                'userData',
                                'userEmail',
                                'userName',
                                'isLoggedIn',
                                'refreshToken'
                            ]);

                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Landing' }],
                                })
                            );

                            console.log('Sesión cerrada exitosamente');

                        } catch (error) {
                            console.error('Error al cerrar sesión:', error);
                            Alert.alert(
                                "Error",
                                "Hubo un problema al cerrar sesión. Inténtalo de nuevo."
                            );
                        }
                    }
                }
            ]
        );
    };

    // Menú principal para la pestaña "Adoptar"
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

    const renderChildCard = (child, index) => (
        <Animated.View
            key={child.id}
            style={[
                styles.childCard,
                {
                    opacity: fadeAnim,
                    transform: [{
                        translateY: slideAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [30 * (index + 1), 0]
                        })
                    }]
                }
            ]}
        >
            <View style={styles.childPhotoContainer}>
                {child.photo ? (
                    <Image source={{ uri: child.photo }} style={styles.childPhoto} />
                ) : (
                    <View style={styles.childPhotoPlaceholder}>
                        <MaterialIcons name="child-care" size={32} color="#3AAFA9" />
                    </View>
                )}
            </View>
            <View style={styles.childInfo}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childAge}>{child.age} años</Text>
                <Text style={styles.childStatus}>{child.status}</Text>
                <Text style={styles.adoptionDate}>
                    Adoptado: {new Date(child.adoptionDate).toLocaleDateString('es-ES')}
                </Text>
            </View>
        </Animated.View>
    );

    const renderHomeContent = () => (
        <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {/* Estadísticas generales */}
            <Animated.View
                style={[
                    styles.statsContainer,
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
                <View style={styles.statCard}>
                    <MaterialIcons name="family-restroom" size={24} color="#3AAFA9" />
                    <Text style={styles.statNumber}>{adoptedChildren.length}</Text>
                    <Text style={styles.statLabel}>Hijos Adoptados</Text>
                </View>
                <View style={styles.statCard}>
                    <MaterialIcons name="schedule" size={24} color="#667eea" />
                    <Text style={styles.statNumber}>2</Text>
                    <Text style={styles.statLabel}>Años Activo</Text>
                </View>
                <View style={styles.statCard}>
                    <MaterialIcons name="verified" size={24} color="#4facfe" />
                    <Text style={styles.statNumber}>100%</Text>
                    <Text style={styles.statLabel}>Cumplimiento</Text>
                </View>
            </Animated.View>

            {/* Hijos adoptados */}
            <Animated.View
                style={[
                    styles.sectionContainer,
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
                <Text style={styles.sectionTitle}>Mis Hijos</Text>
                {adoptedChildren.map((child, index) => renderChildCard(child, index))}
            </Animated.View>

            {/* Próximas citas */}
            <Animated.View
                style={[
                    styles.appointmentCard,
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
                <View style={styles.appointmentHeader}>
                    <MaterialIcons name="event" size={20} color="#3AAFA9" />
                    <Text style={styles.appointmentTitle}>Próxima Cita</Text>
                </View>
                <Text style={styles.appointmentDate}>15 de Junio, 2025 - 10:00 AM</Text>
                <Text style={styles.appointmentType}>Seguimiento post-adopción</Text>

            </Animated.View>
        </ScrollView>
    );

    const renderAdoptContent = () => (
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
    );

    const renderQRContent = () => (
        <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {/* QR Card */}
            <Animated.View
                style={[
                    styles.qrCard,
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
                <Text style={styles.qrTitle}>Mi Código QR</Text>
                <Text style={styles.qrSubtitle}>Presenta este código para identificarte</Text>

                <View style={styles.qrContainer}>
                    <QRCode
                        value={`ADOPCION_${userID}_${userName}`}
                        size={200}
                        color="#1f2937"
                        backgroundColor="#fff"
                    />
                </View>

                <View style={styles.qrInfo}>
                    <Text style={styles.qrUserName}>{userName}</Text>
                    <Text style={styles.qrUserID}>ID: {userID}</Text>
                    <Text style={styles.qrUserEmail}>{userEmail}</Text>
                </View>
            </Animated.View>

            {/* Instrucciones */}
            <Animated.View
                style={[
                    styles.instructionsCard,
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
                <Text style={styles.instructionsTitle}>¿Cómo usar tu QR?</Text>
                <View style={styles.instructionItem}>
                    <MaterialIcons name="qr-code-scanner" size={20} color="#3AAFA9" />
                    <Text style={styles.instructionText}>
                        Presenta este código con las autoridades del centro de adopción
                    </Text>
                </View>
                <View style={styles.instructionItem}>
                    <MaterialIcons name="verified-user" size={20} color="#3AAFA9" />
                    <Text style={styles.instructionText}>
                        Te permitirá acceder rápidamente a tu información y expediente
                    </Text>
                </View>
                <View style={styles.instructionItem}>
                    <MaterialIcons name="security" size={20} color="#3AAFA9" />
                    <Text style={styles.instructionText}>
                        Mantén tu código seguro y no lo compartas con terceros
                    </Text>
                </View>
            </Animated.View>

            {/* Botón de compartir */}
            <Animated.View
                style={[
                    styles.shareContainer,
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
            </Animated.View>
        </ScrollView>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'inicio':
                return renderHomeContent();
            case 'adoptar':
                return renderAdoptContent();
            case 'qr':
                return renderQRContent();
            default:
                return renderAdoptContent();
        }
    };

    const getHeaderTitle = () => {
        switch (activeTab) {
            case 'inicio':
                return 'Mi Familia';
            case 'adoptar':
                return 'Centro de Adopción';
            case 'qr':
                return 'Mi Identificación';
            default:
                return 'Centro de Adopción';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.simpleHeader}>
                <Text style={styles.appTitle}>{getHeaderTitle()}</Text>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => Alert.alert('Perfil', 'Funcionalidad de perfil')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="account-circle" size={28} color="#3AAFA9" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            {renderContent()}

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={[styles.navItem, activeTab === 'inicio' && styles.navItemActive]}
                    onPress={() => setActiveTab('inicio')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons
                        name="home"
                        size={24}
                        color={activeTab === 'inicio' ? '#3AAFA9' : '#6b7280'}
                    />
                    <Text style={[
                        styles.navLabel,
                        activeTab === 'inicio' && styles.navLabelActive
                    ]}>
                        Inicio
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navItem, activeTab === 'adoptar' && styles.navItemActive]}
                    onPress={() => setActiveTab('adoptar')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons
                        name="favorite"
                        size={24}
                        color={activeTab === 'adoptar' ? '#3AAFA9' : '#6b7280'}
                    />
                    <Text style={[
                        styles.navLabel,
                        activeTab === 'adoptar' && styles.navLabelActive
                    ]}>
                        Adoptar
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navItem, activeTab === 'qr' && styles.navItemActive]}
                    onPress={() => setActiveTab('qr')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons
                        name="qr-code"
                        size={24}
                        color={activeTab === 'qr' ? '#3AAFA9' : '#6b7280'}
                    />
                    <Text style={[
                        styles.navLabel,
                        activeTab === 'qr' && styles.navLabelActive
                    ]}>
                        QR
                    </Text>
                </TouchableOpacity>
            </View>
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
    scrollContent: {
        paddingBottom: 90, // Espacio para el nav bar
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
    sectionContainer: {
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
    // Estilos para la pantalla de Inicio
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20,
        marginBottom: 10,
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 4,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1f2937',
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
        fontWeight: '500',
    },
    childCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    childPhotoContainer: {
        marginRight: 16,
    },
    childPhoto: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    childPhotoPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f9ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e0f2fe',
    },
    childInfo: {
        flex: 1,
    },
    childName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
    },
    childAge: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 2,
    },
    childStatus: {
        fontSize: 12,
        color: '#3AAFA9',
        fontWeight: '600',
        marginBottom: 4,
    },
    adoptionDate: {
        fontSize: 11,
        color: '#9ca3af',
    },
    childActionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    appointmentCard: {
        backgroundColor: '#fff',
        margin: 20,
        marginTop: 0,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    appointmentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    appointmentTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        marginLeft: 8,
    },
    appointmentDate: {
        fontSize: 15,
        fontWeight: '600',
        color: '#3AAFA9',
        marginBottom: 4,
    },
    appointmentType: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 16,
    },
    appointmentButton: {
        backgroundColor: '#3AAFA9',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignSelf: 'flex-start',
    },
    appointmentButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    // Estilos para la pantalla QR
    qrCard: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 30,
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
    qrTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1f2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    qrSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 30,
        textAlign: 'center',
    },
    qrContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 30,
    },
    qrInfo: {
        alignItems: 'center',
    },
    qrUserName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
    },
    qrUserID: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 2,
    },
    qrUserEmail: {
        fontSize: 12,
        color: '#9ca3af',
    },
    instructionsCard: {
        backgroundColor: '#fff',
        margin: 20,
        marginTop: 0,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    instructionsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 16,
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    instructionText: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 12,
        flex: 1,
        lineHeight: 20,
    },
    shareContainer: {
        margin: 20,
        marginTop: 0,
    },
    shareButton: {
        backgroundColor: '#3AAFA9',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3AAFA9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    shareButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    // Estilos para el Bottom Navigation
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 8,
        paddingBottom: 20,
        paddingHorizontal: 20,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 12,
    },
    navItemActive: {
        backgroundColor: '#f0f9ff',
    },
    navLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
        fontWeight: '500',
    },
    navLabelActive: {
        color: '#3AAFA9',
        fontWeight: '600',
    },
});
export default PostulanteScreen;