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
    Modal,
    ActivityIndicator
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { CameraView, Camera } from 'expo-camera';

const { width, height } = Dimensions.get('window');

const TrabajadorSocialScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [workerName] = useState(route?.params?.workerName || 'Trabajador Social');
    const [workerEmail] = useState(route?.params?.workerEmail || 'trabajador@social.com');

    // Estados para QR Scanner
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Estados para datos de padre adoptivo
    const [parentData, setParentData] = useState(null);
    const [showParentInfo, setShowParentInfo] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        animateIn();
        getCameraPermissions();
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

    const getCameraPermissions = async () => {
        try {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        } catch (error) {
            console.error('Error requesting camera permissions:', error);
            setHasPermission(false);
        }
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
                                'refreshToken',
                                'workerData'
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

    const handleBarcodeScanned = async ({ type, data }) => {
        if (scanned) return;

        setScanned(true);
        setIsLoading(true);

        try {
            // Simular llamada a API para obtener datos del padre adoptivo
            const parentInfo = await fetchParentData(data);

            if (parentInfo) {
                setParentData(parentInfo);
                setShowScanner(false);
                setShowParentInfo(true);
            } else {
                Alert.alert(
                    "QR No Válido",
                    "No se encontró información para este código QR.",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                setScanned(false);
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Error processing QR:', error);
            Alert.alert(
                "Error",
                "Error al procesar el código QR. Inténtalo de nuevo.",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            setScanned(false);
                        }
                    }
                ]
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Simulación de llamada a API
    const fetchParentData = async (qrCode) => {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Datos simulados - en una app real vendrían de tu backend
        const mockData = {
            parentId: qrCode,
            parentName: "María González",
            parentEmail: "maria.gonzalez@email.com",
            phone: "+52 777 123 4567",
            registrationDate: "2023-08-15",
            adoptedChildren: [
                {
                    id: 1,
                    name: "Carlos",
                    age: 7,
                    adoptionDate: "2023-10-20",
                    status: "Adaptación exitosa",
                    progress: "Excelente"
                },
                {
                    id: 2,
                    name: "Ana",
                    age: 5,
                    adoptionDate: "2024-01-15",
                    status: "En seguimiento",
                    progress: "Bueno"
                }
            ],
            totalAdoptions: 2,
            successfulAdoptions: 2,
            visits: 8,
            lastVisit: "2024-05-15"
        };

        return mockData;
    };

    const openQRScanner = async () => {
        if (hasPermission === null) {
            Alert.alert("Permisos", "Solicitando permisos de cámara...");
            await getCameraPermissions();
            return;
        }
        if (hasPermission === false) {
            Alert.alert(
                "Sin Permisos",
                "No se tienen permisos para usar la cámara. Ve a configuración y habilita el acceso a la cámara.",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Configuración", onPress: () => {
                            // En una app real, aquí abrirías la configuración del sistema
                            console.log('Abrir configuración');
                        }}
                ]
            );
            return;
        }

        setScanned(false);
        setShowScanner(true);
    };

    const renderParentInfoModal = () => {
        if (!parentData) return null;

        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={showParentInfo}
                onRequestClose={() => setShowParentInfo(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Información del Padre Adoptivo</Text>
                        <TouchableOpacity
                            onPress={() => setShowParentInfo(false)}
                            style={styles.closeButton}
                        >
                            <MaterialIcons name="close" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {/* Información del padre */}
                        <View style={styles.infoCard}>
                            <MaterialIcons name="person" size={24} color="#3AAFA9" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitle}>Datos Personales</Text>
                                <Text style={styles.infoText}>{parentData.parentName}</Text>
                                <Text style={styles.infoSubtext}>{parentData.parentEmail}</Text>
                                <Text style={styles.infoSubtext}>{parentData.phone}</Text>
                            </View>
                        </View>

                        {/* Estadísticas */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <MaterialIcons name="family-restroom" size={24} color="#667eea" />
                                <Text style={styles.statNumber}>{parentData.totalAdoptions}</Text>
                                <Text style={styles.statLabel}>Adopciones</Text>
                            </View>
                            <View style={styles.statCard}>
                                <MaterialIcons name="check-circle" size={24} color="#4facfe" />
                                <Text style={styles.statNumber}>{parentData.successfulAdoptions}</Text>
                                <Text style={styles.statLabel}>Exitosas</Text>
                            </View>
                            <View style={styles.statCard}>
                                <MaterialIcons name="visibility" size={24} color="#a18cd1" />
                                <Text style={styles.statNumber}>{parentData.visits}</Text>
                                <Text style={styles.statLabel}>Visitas</Text>
                            </View>
                        </View>

                        {/* Hijos adoptados */}
                        <View style={styles.childrenSection}>
                            <Text style={styles.sectionTitle}>Hijos Adoptados</Text>
                            {parentData.adoptedChildren.map((child) => (
                                <View key={child.id} style={styles.childCard}>
                                    <View style={styles.childHeader}>
                                        <MaterialIcons name="child-care" size={20} color="#3AAFA9" />
                                        <Text style={styles.childName}>{child.name}</Text>
                                        <Text style={styles.childAge}>{child.age} años</Text>
                                    </View>
                                    <Text style={styles.childStatus}>Estado: {child.status}</Text>
                                    <Text style={styles.childProgress}>Progreso: {child.progress}</Text>
                                    <Text style={styles.childDate}>
                                        Adoptado: {new Date(child.adoptionDate).toLocaleDateString()}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        );
    };

    const renderQRScanner = () => {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={showScanner}
                onRequestClose={() => setShowScanner(false)}
            >
                <SafeAreaView style={styles.scannerContainer}>
                    <View style={styles.scannerHeader}>
                        <Text style={styles.scannerTitle}>Escanear Código QR</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setShowScanner(false);
                                setScanned(false);
                            }}
                            style={styles.closeButton}
                        >
                            <MaterialIcons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.scannerContent}>
                        {hasPermission && (
                            <CameraView
                                style={StyleSheet.absoluteFillObject}
                                facing="back"
                                onBarcodeScanned={handleBarcodeScanned}
                                barcodeScannerSettings={{
                                    barcodeTypes: ["qr", "pdf417"],
                                }}
                            />
                        )}

                        <View style={styles.scannerOverlay}>
                            <View style={styles.scannerFrame} />
                            <Text style={styles.scannerText}>
                                Coloca el código QR dentro del marco
                            </Text>

                            {scanned && (
                                <TouchableOpacity
                                    style={styles.scanAgainButton}
                                    onPress={() => setScanned(false)}
                                >
                                    <Text style={styles.scanAgainText}>Escanear de nuevo</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {isLoading && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color="#3AAFA9" />
                                <Text style={styles.loadingText}>Procesando...</Text>
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.simpleHeader}>
                <Text style={styles.appTitle}>Panel Trabajador Social</Text>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => Alert.alert('Perfil', 'Funcionalidad de perfil')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="badge" size={28} color="#3AAFA9" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Tarjeta de perfil del trabajador */}
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
                            <MaterialIcons name="work" size={32} color="#3AAFA9" />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.welcomeText}>{workerName}</Text>
                            <Text style={styles.userEmailCard}>{workerEmail}</Text>
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

                {/* Tarjeta principal - Scanner QR */}
                <Animated.View
                    style={[
                        styles.qrScannerCard,
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
                    <MaterialIcons name="qr-code-scanner" size={48} color="#3AAFA9" />
                    <Text style={styles.qrTitle}>Escanear Código QR</Text>
                    <Text style={styles.qrSubtitle}>
                        Escanea el código QR del padre adoptivo para ver la información de sus hijos y estadísticas
                    </Text>

                    <TouchableOpacity
                        style={styles.scanButton}
                        onPress={openQRScanner}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="qr-code-scanner" size={24} color="#fff" />
                        <Text style={styles.scanButtonText}>Iniciar Escáner</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Información adicional */}
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
                        El código QR te permitirá acceder a toda la información relevante sobre el progreso de las adopciones.
                    </Text>
                </Animated.View>
            </ScrollView>

            {/* Modales */}
            {renderQRScanner()}
            {renderParentInfoModal()}
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
        borderBottomColor: '#e2e8f0',
    },
    appTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1e293b',
    },
    profileButton: {
        padding: 8,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    profileCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0fdfa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    profileInfo: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    userEmailCard: {
        fontSize: 14,
        color: '#64748b',
    },
    logoutButton: {
        padding: 8,
    },
    qrScannerCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 30,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    qrTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginTop: 15,
        marginBottom: 10,
        textAlign: 'center',
    },
    qrSubtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 25,
    },
    scanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3AAFA9',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 12,
        shadowColor: '#3AAFA9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
        marginLeft: 12,
    },
    // Estilos del scanner
    scannerContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    scannerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    scannerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    closeButton: {
        padding: 8,
    },
    scannerContent: {
        flex: 1,
        position: 'relative',
    },
    scannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    scannerFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#3AAFA9',
        borderRadius: 12,
        backgroundColor: 'transparent',
    },
    scannerText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    scanAgainButton: {
        backgroundColor: '#3AAFA9',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 20,
    },
    scanAgainText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
    },
    // Estilos del modal de información
    modalContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    infoTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 5,
    },
    infoSubtext: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 2,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
        textAlign: 'center',
    },
    childrenSection: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 15,
    },
    childCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    childHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    childName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginLeft: 8,
        flex: 1,
    },
    childAge: {
        fontSize: 14,
        color: '#64748b',
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    childStatus: {
        fontSize: 14,
        color: '#059669',
        marginBottom: 4,
    },
    childProgress: {
        fontSize: 14,
        color: '#0369a1',
        marginBottom: 4,
    },
    childDate: {
        fontSize: 12,
        color: '#64748b',
    },
});

export default TrabajadorSocialScreen;