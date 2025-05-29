// RecursosScreen.js
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
    FlatList,
    Linking,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const RecursosScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [activeCategory, setActiveCategory] = useState('guias');
    const [searchQuery, setSearchQuery] = useState('');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        animateIn();
    }, []);

    const animateIn = () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(0);

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
            })
        ]).start();
    };

    // Categorías de recursos
    const categories = [
        {
            id: 'guias',
            title: 'Guías',
            icon: 'book',
            color: '#3AAFA9'
        },
        {
            id: 'videos',
            title: 'Videos',
            icon: 'play-circle',
            color: '#4facfe'
        },
        {
            id: 'soporte',
            title: 'Soporte',
            icon: 'support-agent',
            color: '#a18cd1'
        }
    ];

    // Recursos organizados por categoría
    const resources = {
        guias: [
            {
                id: 1,
                title: 'Guía Completa del Proceso de Adopción',
                description: 'Todo lo que necesitas saber sobre el proceso paso a paso',
                type: 'PDF',
                duration: '15 min lectura',
                icon: 'menu-book',
                difficulty: 'Básico',
                isNew: true
            },
            {
                id: 2,
                title: 'Preparándote para la Paternidad/Maternidad',
                description: 'Consejos y recomendaciones para futuros padres adoptivos',
                type: 'Artículo',
                duration: '10 min lectura',
                icon: 'family-restroom',
                difficulty: 'Intermedio',
                isNew: false
            },
            {
                id: 3,
                title: 'Primeros Días en Casa',
                description: 'Cómo hacer que tu hijo/a se sienta cómodo en su nuevo hogar',
                type: 'Guía',
                duration: '12 min lectura',
                icon: 'home-filled',
                difficulty: 'Avanzado',
                isNew: false
            },
            {
                id: 4,
                title: 'Aspectos Legales de la Adopción',
                description: 'Información legal importante durante el proceso',
                type: 'PDF',
                duration: '20 min lectura',
                icon: 'gavel',
                difficulty: 'Avanzado',
                isNew: false
            },
            {
                id: 15,
                title: 'Manejo de Emociones Durante el Proceso',
                description: 'Estrategias para lidiar con la ansiedad y expectativas',
                type: 'Guía',
                duration: '8 min lectura',
                icon: 'psychology',
                difficulty: 'Intermedio',
                isNew: true
            }
        ],
        videos: [
            {
                id: 8,
                title: 'Testimonios de Familias Adoptivas',
                description: 'Experiencias reales de familias que han completado el proceso',
                type: 'Video',
                duration: '25 min',
                icon: 'video-library',
                difficulty: 'Básico',
                isNew: true
            },
            {
                id: 9,
                title: 'Preparación para la Visita al Hogar',
                description: 'Qué esperar y cómo prepararse para la evaluación domiciliaria',
                type: 'Video',
                duration: '15 min',
                icon: 'play-circle',
                difficulty: 'Intermedio',
                isNew: false
            },
            {
                id: 10,
                title: 'Webinar: Aspectos Emocionales de la Adopción',
                description: 'Charla con psicólogos especializados en adopción',
                type: 'Webinar',
                duration: '45 min',
                icon: 'psychology',
                difficulty: 'Avanzado',
                isNew: false
            },
            {
                id: 18,
                title: 'Tutorial: Cómo Preparar tu Hogar',
                description: 'Consejos prácticos para adecuar el espacio familiar',
                type: 'Tutorial',
                duration: '18 min',
                icon: 'video-camera-front',
                difficulty: 'Básico',
                isNew: true
            }
        ],
        soporte: [
            {
                id: 11,
                title: 'Centro de Ayuda',
                description: 'Preguntas frecuentes y respuestas',
                type: 'FAQ',
                duration: 'Consulta',
                icon: 'help-center',
                difficulty: 'Básico',
                isNew: false
            },
            {
                id: 12,
                title: 'Chat en Vivo',
                description: 'Habla directamente con nuestro equipo de soporte',
                type: 'Chat',
                duration: 'Inmediato',
                icon: 'chat',
                difficulty: 'Básico',
                isNew: false
            },
            {
                id: 14,
                title: 'Contacto de Emergencia',
                description: 'Línea directa para situaciones urgentes',
                type: 'Teléfono',
                duration: 'Inmediato',
                icon: 'phone',
                difficulty: 'Urgente',
                isNew: false
            },
            {
                id: 19,
                title: 'Foro de Comunidad',
                description: 'Conecta con otras familias en proceso de adopción',
                type: 'Foro',
                duration: 'Continuo',
                icon: 'forum',
                difficulty: 'Básico',
                isNew: true
            },
            {
                id: 20,
                title: 'Grupos de Apoyo',
                description: 'Sesiones grupales con familias adoptivas',
                type: 'Grupo',
                duration: '90 min',
                icon: 'groups',
                difficulty: 'Intermedio',
                isNew: false
            }
        ]
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Básico': return '#10b981';
            case 'Intermedio': return '#f59e0b';
            case 'Avanzado': return '#ef4444';
            case 'Personalizado': return '#8b5cf6';
            case 'Urgente': return '#dc2626';
            default: return '#6b7280';
        }
    };

    const handleResourcePress = (resource) => {
        if (resource.type === 'Chat') {
            Alert.alert(
                "Chat en Vivo",
                "¿Deseas iniciar una conversación con nuestro equipo de soporte?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Iniciar Chat", onPress: () => Alert.alert("Conectando...", "Te conectaremos con un agente en breve") }
                ]
            );
        } else if (resource.type === 'Teléfono') {
            Alert.alert(
                "Contacto de Emergencia",
                "Línea directa: +52 777 123 4567\n\nDisponible 24/7 para situaciones urgentes relacionadas con el proceso de adopción.",
                [
                    { text: "Cerrar", style: "cancel" },
                    { text: "Llamar", onPress: () => Alert.alert("Llamando...", "Conectando con línea de emergencia") }
                ]
            );
        } else if (resource.type === 'Foro') {
            Alert.alert(
                "Foro de Comunidad",
                "¿Te gustaría unirte al foro de familias adoptivas?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Unirse", onPress: () => Alert.alert("Accediendo...", "Redirigiendo al foro de la comunidad") }
                ]
            );
        } else if (resource.type === 'Grupo') {
            Alert.alert(
                "Grupos de Apoyo",
                "¿Deseas información sobre nuestros grupos de apoyo presenciales?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Más Info", onPress: () => Alert.alert("Información", "Te contactaremos para brindarte horarios y ubicaciones disponibles") }
                ]
            );
        } else {
            Alert.alert(
                resource.title,
                `${resource.description}\n\nTipo: ${resource.type}\nDuración estimada: ${resource.duration}`,
                [
                    { text: "Cerrar", style: "cancel" },
                    { text: "Abrir", onPress: () => Alert.alert("Abriendo...", "Cargando contenido") }
                ]
            );
        }
    };

    const renderCategoryTab = (category) => {
        const isActive = activeCategory === category.id;

        return (
            <TouchableOpacity
                key={category.id}
                style={[
                    styles.categoryTab,
                    isActive && { backgroundColor: category.color }
                ]}
                onPress={() => setActiveCategory(category.id)}
                activeOpacity={0.7}
            >
                <MaterialIcons
                    name={category.icon}
                    size={20}
                    color={isActive ? '#fff' : '#6b7280'}
                />
                <Text style={[
                    styles.categoryTabText,
                    isActive && { color: '#fff' }
                ]}>
                    {category.title}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderResourceItem = (resource, index) => {
        return (
            <Animated.View
                key={resource.id}
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
                    style={styles.resourceItem}
                    onPress={() => handleResourcePress(resource)}
                    activeOpacity={0.7}
                >
                    <View style={styles.resourceHeader}>
                        <View style={[
                            styles.resourceIcon,
                            { backgroundColor: categories.find(c => c.id === activeCategory)?.color + '20' }
                        ]}>
                            <MaterialIcons
                                name={resource.icon}
                                size={24}
                                color={categories.find(c => c.id === activeCategory)?.color}
                            />
                        </View>

                        <View style={styles.resourceContent}>
                            <View style={styles.resourceTitleRow}>
                                <Text style={styles.resourceTitle}>{resource.title}</Text>
                                {resource.isNew && (
                                    <View style={styles.newBadge}>
                                        <Text style={styles.newBadgeText}>Nuevo</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.resourceDescription}>{resource.description}</Text>

                            <View style={styles.resourceMetadata}>
                                <View style={styles.metadataItem}>
                                    <MaterialIcons name="schedule" size={14} color="#6b7280" />
                                    <Text style={styles.metadataText}>{resource.duration}</Text>
                                </View>

                                <View style={styles.metadataItem}>
                                    <MaterialIcons name="label" size={14} color="#6b7280" />
                                    <Text style={styles.metadataText}>{resource.type}</Text>
                                </View>

                                <View style={[
                                    styles.difficultyBadge,
                                    { backgroundColor: getDifficultyColor(resource.difficulty) + '20' }
                                ]}>
                                    <Text style={[
                                        styles.difficultyText,
                                        { color: getDifficultyColor(resource.difficulty) }
                                    ]}>
                                        {resource.difficulty}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <MaterialIcons
                            name="chevron-right"
                            size={20}
                            color="#9ca3af"
                        />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const currentResources = resources[activeCategory] || [];

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

                <Text style={styles.headerTitle}>Recursos y Guías</Text>

                <View style={styles.headerSpacer} />
            </View>

            {/* Categorías */}
            <Animated.View
                style={[
                    styles.categoriesContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{
                            translateY: slideAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0]
                            })
                        }]
                    }
                ]}
            >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {categories.map(category => renderCategoryTab(category))}
                </ScrollView>
            </Animated.View>

            {/* Descripción de la categoría */}
            <Animated.View
                style={[
                    styles.categoryDescription,
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
                <MaterialIcons
                    name={categories.find(c => c.id === activeCategory)?.icon}
                    size={20}
                    color={categories.find(c => c.id === activeCategory)?.color}
                />
                <Text style={styles.categoryDescriptionText}>
                    {activeCategory === 'guias' && 'Guías detalladas y artículos informativos'}
                    {activeCategory === 'videos' && 'Videos educativos y testimoniales'}
                    {activeCategory === 'soporte' && 'Canales de ayuda y contacto directo'}
                </Text>
            </Animated.View>

            {/* Lista de recursos */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View
                    style={[
                        styles.resourcesContainer,
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
                    {currentResources.map((resource, index) => renderResourceItem(resource, index))}
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
                    <MaterialIcons name="lightbulb" size={20} color="#f59e0b" />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>¿Sabías que?</Text>
                        <Text style={styles.infoText}>
                            Todos nuestros recursos están actualizados regularmente y han sido revisados por especialistas en adopción.
                        </Text>
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
    headerSpacer: {
        width: 40,
    },
    categoriesContainer: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    categoriesContent: {
        paddingHorizontal: 20,
    },
    categoryTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 12,
        borderRadius: 20,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    categoryTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
        marginLeft: 6,
    },
    categoryDescription: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    categoryDescriptionText: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 8,
        fontWeight: '500',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    resourcesContainer: {
        padding: 20,
    },
    resourceItem: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    resourceHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    resourceIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    resourceContent: {
        flex: 1,
        paddingRight: 10,
    },
    resourceTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    resourceTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        flex: 1,
        marginRight: 8,
    },
    newBadge: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    newBadgeText: {
        fontSize: 9,
        color: '#fff',
        fontWeight: '600',
    },
    resourceDescription: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 18,
        marginBottom: 12,
    },
    resourceMetadata: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    metadataItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 4,
    },
    metadataText: {
        fontSize: 12,
        color: '#6b7280',
        marginLeft: 4,
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginBottom: 4,
    },
    difficultyText: {
        fontSize: 11,
        fontWeight: '600',
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 20,
        marginTop: 0,
        padding: 16,
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
    },
});

export default RecursosScreen;