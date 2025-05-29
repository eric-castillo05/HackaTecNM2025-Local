import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    StatusBar
} from 'react-native';

const { width, height } = Dimensions.get('window');

const AdopcionScreen = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const buttonScaleAnim = useRef(new Animated.Value(1)).current;

    const slides = [
        {
            title: "¿Quieres Adoptar?",
            subtitle: "Estamos aquí para ayudarte a encontrar la familia adecuada para tu hijo.",
            image: require('../../assets/familia.png')
        },
        {
            title: "Un Hogar Lleno de Amor",
            subtitle: "Miles de niños esperan una oportunidad de crecer en una familia.",
            image: require('../../assets/niño.png')
        },
        {
            title: "Proceso Simplificado",
            subtitle: "Te acompañamos en cada paso del proceso de adopción.",
            image: require('../../assets/proceso.png')
        },
        {
            title: "Apoyo Continuo",
            subtitle: "Brindamos seguimiento y apoyo durante todo el proceso.",
            image: require('../../assets/apoyo.png')
        }
    ];

    useEffect(() => {
        // Animación de entrada
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleButtonPress = () => {
        Animated.sequence([
            Animated.timing(buttonScaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();
        // Aquí iría la navegación
        console.log('Navegando...');
    };

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a8b82" />

            {/* Header con gradiente */}
            <View style={styles.header}>
                <Animated.View
                    style={[
                        styles.headerContent,
                        {
                            opacity: fadeAnim,
                            transform: [{
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-50, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <Image
                        source={slides[currentSlide].image}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />
                    <View style={styles.overlay}>
                        <Text style={styles.headerTitle}>
                            {slides[currentSlide].title}
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            {slides[currentSlide].subtitle}
                        </Text>
                    </View>
                </Animated.View>

                {/* Controles de navegación */}
                <View style={styles.navigationControls}>
                    <TouchableOpacity
                        style={[styles.navButton, currentSlide === 0 && styles.navButtonDisabled]}
                        onPress={prevSlide}
                        disabled={currentSlide === 0}
                    >
                        <Text style={styles.navButtonText}>‹</Text>
                    </TouchableOpacity>

                    <View style={styles.dotsContainer}>
                        {slides.map((_, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dot,
                                    index === currentSlide ? styles.activeDot : styles.inactiveDot
                                ]}
                                onPress={() => setCurrentSlide(index)}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.navButton, currentSlide === slides.length - 1 && styles.navButtonDisabled]}
                        onPress={nextSlide}
                        disabled={currentSlide === slides.length - 1}
                    >
                        <Text style={styles.navButtonText}>›</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Contenido principal */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <Animated.View
                    style={[
                        styles.infoSection,
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
                    {/* Estadísticas destacadas */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>30,000+</Text>
                            <Text style={styles.statLabel}>Niños esperando</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>85%</Text>
                            <Text style={styles.statLabel}>Éxito en adopción</Text>
                        </View>
                    </View>

                    {/* Información principal */}
                    <View style={styles.textSection}>
                        <View style={styles.iconTextRow}>
                            <View style={styles.icon}>
                                <Text style={styles.iconText}>❤️</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Nuestra Misión</Text>
                        </View>
                        <Text style={styles.description}>
                            En México, miles de niñas y niños esperan la oportunidad de crecer en un hogar lleno de amor, cuidado y estabilidad. Nuestra misión es facilitar este proceso de manera transparente y humana.
                        </Text>
                    </View>

                    <View style={styles.textSection}>
                        <View style={styles.iconTextRow}>
                            <View style={styles.icon}>
                                <Text style={styles.iconText}>🛡️</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Proceso Seguro</Text>
                        </View>
                        <Text style={styles.description}>
                            La adopción es un acto de amor que cambia vidas. Te acompañamos en cada paso, brindando información verificada, seguimiento personalizado y herramientas para facilitar la conexión entre familias y autoridades.
                        </Text>
                    </View>

                    <View style={styles.textSection}>
                        <View style={styles.iconTextRow}>
                            <View style={styles.icon}>
                                <Text style={styles.iconText}>👨‍👩‍👧‍👦</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Para Todos</Text>
                        </View>
                        <Text style={styles.description}>
                            Ya seas padre o madre en formación, servidor público o persona interesada, aquí encontrarás un espacio confiable para informarte, avanzar y apoyar en el proceso de adopción.
                        </Text>
                    </View>

                    {/* Características destacadas */}
                    <View style={styles.featuresContainer}>
                        <Text style={styles.featuresTitle}>¿Por qué elegirnos?</Text>
                        <View style={styles.featureItem}>
                            <View style={styles.checkIcon}>
                                <Text style={styles.checkText}>✓</Text>
                            </View>
                            <Text style={styles.featureText}>Proceso simplificado y transparente</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <View style={styles.checkIcon}>
                                <Text style={styles.checkText}>✓</Text>
                            </View>
                            <Text style={styles.featureText}>Seguimiento personalizado</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <View style={styles.checkIcon}>
                                <Text style={styles.checkText}>✓</Text>
                            </View>
                            <Text style={styles.featureText}>Apoyo continuo y profesional</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <View style={styles.checkIcon}>
                                <Text style={styles.checkText}>✓</Text>
                            </View>
                            <Text style={styles.featureText}>Información verificada y actualizada</Text>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Botón flotante mejorado */}
            <Animated.View
                style={[
                    styles.buttonContainer,
                    { transform: [{ scale: buttonScaleAnim }] }
                ]}
            >
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleButtonPress}
                    activeOpacity={0.9}
                >
                    <View style={styles.buttonGradient}>
                        <Text style={styles.buttonText}>Comenzar mi proceso</Text>
                        <Text style={styles.buttonIcon}>→</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8faf9',
    },
    header: {
        height: height * 0.45,
        position: 'relative',
        backgroundColor: '#2aa198',
    },
    headerContent: {
        flex: 1,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 22,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    navigationControls: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButtonDisabled: {
        opacity: 0.3,
    },
    navButtonText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#fff',
        transform: [{ scale: 1.2 }],
    },
    inactiveDot: {
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 100,
    },
    infoSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    statCard: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        minWidth: width * 0.35,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: '#2aa198',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    textSection: {
        marginBottom: 25,
    },
    iconTextRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginLeft: 10,
    },
    icon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 20,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: '#555',
        textAlign: 'justify',
    },
    featuresContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    featuresTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    featureText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 12,
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    button: {
        borderRadius: 25,
        shadowColor: '#2aa198',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonGradient: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
        marginRight: 8,
    },
    buttonIcon: {
        marginLeft: 4,
    },
});

export default AdopcionScreen;