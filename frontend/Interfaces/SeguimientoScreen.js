// SeguimientoScreen.js
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
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SeguimientoScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [userName] = useState(route?.params?.userName || 'Usuario');
    const [currentStep, setCurrentStep] = useState(2); // Paso actual simulado

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        animateIn();
    }, []);

    const animateIn = () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(0);
        progressAnim.setValue(0);

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
            Animated.timing(progressAnim, {
                toValue: currentStep / processSteps.length,
                duration: 1000,
                useNativeDriver: false,
            })
        ]).start();
    };

    // Pasos del proceso de adopción
    const processSteps = [
        {
            id: 1,
            title: 'Registro Inicial',
            description: 'Creación de cuenta y verificación de identidad',
            icon: 'person-add',
            status: 'completed',
            date: '15 May 2025',
            details: 'Tu registro ha sido completado exitosamente. Ahora puedes acceder a todas las funciones del sistema.'
        },
        {
            id: 2,
            title: 'Solicitud Inicial',
            description: 'Formulario de adopción y documentos básicos',
            icon: 'assignment',
            status: 'in-progress',
            date: 'En proceso',
            details: 'Completa el formulario de adopción con toda la información requerida y adjunta los documentos solicitados.'
        },
        {
            id: 3,
            title: 'Revisión de Solicitud',
            description: 'Evaluación y verificación de información',
            icon: 'fact-check',
            status: 'pending',
            date: 'Pendiente',
            details: 'Nuestro equipo revisará cuidadosamente tu solicitud y documentación. Te contactaremos si necesitamos información adicional.'
        },
        {
            id: 4,
            title: 'Visita al Hogar',
            description: 'Evaluación del ambiente familiar y domiciliario',
            icon: 'home',
            status: 'pending',
            date: 'Pendiente',
            details: 'Un trabajador social visitará tu hogar para evaluar las condiciones y el ambiente familiar. Esta visita es parte fundamental del proceso.'
        },
        {
            id: 5,
            title: 'Aprobación Final',
            description: 'Decisión final del comité de adopción',
            icon: 'verified',
            status: 'pending',
            date: 'Pendiente',
            details: 'El comité de adopción revisará todo tu expediente y tomará la decisión final sobre tu solicitud de adopción.'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#10b981';
            case 'in-progress': return '#3AAFA9';
            case 'pending': return '#9ca3af';
            default: return '#9ca3af';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return 'check-circle';
            case 'in-progress': return 'schedule';
            case 'pending': return 'radio-button-unchecked';
            default: return 'radio-button-unchecked';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Completado';
            case 'in-progress': return 'En Proceso';
            case 'pending': return 'Pendiente';
            default: return 'Pendiente';
        }
    };

    const renderProgressBar = () => {
        const completedSteps = processSteps.filter(step => step.status === 'completed').length;
        const progressPercentage = (completedSteps / processSteps.length) * 100;

        return (
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                    <Animated.View
                        style={[
                            styles.progressBarFill,
                            {
                                width: progressAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', `${progressPercentage}%`]
                                })
                            }
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {completedSteps} de {processSteps.length} pasos completados
                </Text>
            </View>
        );
    };

    const renderStepItem = (step, index) => {
        const isLast = index === processSteps.length - 1;

        return (
            <Animated.View
                key={step.id}
                style={[
                    {
                        opacity: fadeAnim,
                        transform: [
                            {
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [30 * (index + 1), 0]
                                })
                            }
                        ]
                    }
                ]}
            >
                <TouchableOpacity
                    style={styles.stepItem}
                    onPress={() => showStepDetails(step)}
                    activeOpacity={0.7}
                >
                    <View style={styles.stepTimeline}>
                        <View style={[
                            styles.stepIcon,
                            { backgroundColor: getStatusColor(step.status) }
                        ]}>
                            <MaterialIcons
                                name={step.status === 'completed' ? 'check' : step.icon}
                                size={20}
                                color="#fff"
                            />
                        </View>
                        {!isLast && (
                            <View style={[
                                styles.timelineLine,
                                {
                                    backgroundColor: step.status === 'completed' ||
                                    (index + 1 < currentStep) ? '#10b981' : '#e5e7eb'
                                }
                            ]} />
                        )}
                    </View>

                    <View style={styles.stepContent}>
                        <View style={styles.stepHeader}>
                            <Text style={styles.stepTitle}>{step.title}</Text>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(step.status) + '20' }
                            ]}>
                                <MaterialIcons
                                    name={getStatusIcon(step.status)}
                                    size={12}
                                    color={getStatusColor(step.status)}
                                    style={{ marginRight: 4 }}
                                />
                                <Text style={[
                                    styles.statusText,
                                    { color: getStatusColor(step.status) }
                                ]}>
                                    {getStatusText(step.status)}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.stepDescription}>{step.description}</Text>
                        <Text style={styles.stepDate}>{step.date}</Text>

                        <View style={styles.stepAction}>
                            <MaterialIcons
                                name="chevron-right"
                                size={20}
                                color="#9ca3af"
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const showStepDetails = (step) => {
        Alert.alert(
            step.title,
            step.details,
            [
                { text: "Entendido", style: "default" }
            ]
        );
    };

    const handleContactSupport = () => {
        Alert.alert(
            "Contactar Soporte",
            "¿Cómo te gustaría contactar a nuestro equipo de soporte?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Llamar", onPress: () => Alert.alert("Llamando...", "Tel: +52 777 123 4567") },
                { text: "Email", onPress: () => Alert.alert("Email", "soporte@centroadopcion.mx") }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#1f2937" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Seguimiento del Proceso</Text>

                <TouchableOpacity
                    style={styles.helpButton}
                    onPress={handleContactSupport}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="help-outline" size={24} color="#3AAFA9" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Resumen del progreso */}
                <Animated.View
                    style={[
                        styles.summaryCard,
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
                    <View style={styles.summaryHeader}>
                        <MaterialIcons name="timeline" size={24} color="#3AAFA9" />
                        <Text style={styles.summaryTitle}>Tu Progreso</Text>
                    </View>

                    {renderProgressBar()}

                    <Text style={styles.summaryDescription}>
                        ¡Hola {userName}! Aquí puedes ver el estado actual de tu proceso de adopción.
                        Cada paso completado te acerca más a tu objetivo.
                    </Text>
                </Animated.View>

                {/* Timeline de pasos */}
                <Animated.View
                    style={[
                        styles.timelineContainer,
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
                    <Text style={styles.sectionTitle}>Proceso de Adopción</Text>
                    {processSteps.map((step, index) => renderStepItem(step, index))}
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
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>¿Tienes preguntas?</Text>
                        <Text style={styles.infoText}>
                            Si tienes dudas sobre algún paso del proceso, no dudes en contactar a nuestro equipo de soporte.
                        </Text>
                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={handleContactSupport}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.contactButtonText}>Contactar Soporte</Text>
                        </TouchableOpacity>
                    </View>
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
    header: {
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
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    helpButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f9ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0f2fe',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    summaryCard: {
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
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginLeft: 10,
    },
    progressBarContainer: {
        marginBottom: 15,
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#3AAFA9',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    summaryDescription: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    timelineContainer: {
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
    stepItem: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    stepTimeline: {
        alignItems: 'center',
        marginRight: 16,
    },
    stepIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    timelineLine: {
        width: 2,
        height: 30,
        marginTop: 8,
    },
    stepContent: {
        flex: 1,
        justifyContent: 'center',
        paddingRight: 30, // Espacio para la flecha
    },
    stepHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    stepDescription: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
        lineHeight: 18,
    },
    stepDate: {
        fontSize: 12,
        color: '#9ca3af',
        fontWeight: '500',
    },
    stepAction: {
        position: 'absolute',
        right: 16,
        top: '50%',
        marginTop: -10, // Centrado vertical mejorado
        width: 24,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 20,
        marginTop: 0,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    infoContent: {
        flex: 1,
        marginLeft: 12,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        color: '#6b7280',
        lineHeight: 18,
        marginBottom: 12,
    },
    contactButton: {
        backgroundColor: '#3AAFA9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    contactButtonText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
});

export default SeguimientoScreen;