import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const FormularioAdopScreen = ({ navigation }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        // Paso 1: Información Personal
        anios_trabajo_actual: '',
        edad: '',
        genero: '',
        estado_civil: '',

        // Paso 2: Información Familiar y Social
        hijos_biologicos: '',
        ya_ha_adoptado: '',

        // Paso 3: Información Económica y Vivienda
        ingreso_mensual: '',
        tipo_casa: '',

        // Paso 4: Información Educativa y Ubicación
        ultimo_grado_estudios: '',
        ciudad: '',
        estado: ''
    });

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const steps = [
        {
            title: "Información Personal",
            subtitle: "Cuéntanos sobre ti",
            icon: "person",
            iconLibrary: "MaterialIcons",
            fields: ['anios_trabajo_actual', 'edad', 'genero', 'estado_civil']
        },
        {
            title: "Información Familiar",
            subtitle: "Tu situación familiar actual",
            icon: "family-restroom",
            iconLibrary: "MaterialIcons",
            fields: ['hijos_biologicos', 'ya_ha_adoptado']
        },
        {
            title: "Situación Económica",
            subtitle: "Información sobre ingresos y vivienda",
            icon: "home",
            iconLibrary: "MaterialIcons",
            fields: ['ingreso_mensual', 'tipo_casa']
        },
        {
            title: "Educación y Ubicación",
            subtitle: "Estudios y lugar de residencia",
            icon: "school",
            iconLibrary: "MaterialIcons",
            fields: ['ultimo_grado_estudios', 'ciudad', 'estado']
        }
    ];

    useEffect(() => {
        animateIn();
        animateProgress();
    }, [currentStep]);

    const animateIn = () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(0);
        scaleAnim.setValue(0.9);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            })
        ]).start();
    };

    const animateProgress = () => {
        Animated.timing(progressAnim, {
            toValue: (currentStep + 1) / steps.length,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateCurrentStep = () => {
        const currentFields = steps[currentStep].fields;
        const emptyFields = currentFields.filter(field => {
            const value = formData[field];
            if (field === 'hijos_biologicos' || field === 'edad' || field === 'anios_trabajo_actual' || field === 'ingreso_mensual') {
                return value === '' || value === null || value === undefined;
            }
            return !value || value.trim() === '';
        });

        if (emptyFields.length > 0) {
            Alert.alert(
                "Campos incompletos",
                "Por favor completa todos los campos antes de continuar.",
                [{ text: "Entendido", style: "default" }]
            );
            return false;
        }
        return true;
    };

    const nextStep = () => {
        if (validateCurrentStep()) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                handleSubmit();
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        const processedData = {
            ...formData,
            hijos_biologicos: parseInt(formData.hijos_biologicos) || 0,
            edad: parseInt(formData.edad) || 0,
            anios_trabajo_actual: parseInt(formData.anios_trabajo_actual) || 0,
            ingreso_mensual: parseFloat(formData.ingreso_mensual) || 0
        };

        console.log('Datos a enviar:', processedData);

        Alert.alert(
            "¡Formulario Enviado!",
            "Gracias por tu información. Nos pondremos en contacto contigo pronto para continuar con el proceso.",
            [
                {
                    text: "Perfecto",
                    style: "default",
                    onPress: () => navigation.goBack()
                }
            ]
        );
    };

    const renderIcon = (iconName, iconLibrary, size = 20, color = "#667eea") => {
        if (iconLibrary === "MaterialCommunityIcons") {
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        }
        return <Icon name={iconName} size={size} color={color} />;
    };

    const renderField = (fieldName) => {
        const fieldConfig = getFieldConfig(fieldName);

        if (fieldConfig.type === 'picker') {
            return (
                <Animated.View
                    key={fieldName}
                    style={[
                        styles.fieldContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    <View style={styles.labelContainer}>
                        {renderIcon(fieldConfig.icon, fieldConfig.iconLibrary, 18, "#3AAFA9")}
                        <Text style={styles.label}>{fieldConfig.label}</Text>
                    </View>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData[fieldName]}
                            onValueChange={(value) => updateFormData(fieldName, value)}
                            style={styles.picker}
                        >
                            <Picker.Item label={fieldConfig.placeholder} value="" />
                            {fieldConfig.options.map((option, index) => (
                                <Picker.Item key={index} label={option.label} value={option.value} />
                            ))}
                        </Picker>
                    </View>
                </Animated.View>
            );
        }

        return (
            <Animated.View
                key={fieldName}
                style={[
                    styles.fieldContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <View style={styles.labelContainer}>
                    {renderIcon(fieldConfig.icon, fieldConfig.iconLibrary, 18, "#3AAFA9")}
                    <Text style={styles.label}>{fieldConfig.label}</Text>
                </View>
                <TextInput
                    style={[
                        styles.input,
                        formData[fieldName] && styles.inputFilled
                    ]}
                    placeholder={fieldConfig.placeholder}
                    placeholderTextColor="#999"
                    value={formData[fieldName]}
                    onChangeText={(value) => updateFormData(fieldName, value)}
                    keyboardType={fieldConfig.keyboardType || 'default'}
                    multiline={fieldConfig.multiline || false}
                    numberOfLines={fieldConfig.numberOfLines || 1}
                />
            </Animated.View>
        );
    };

    const getFieldConfig = (fieldName) => {
        const configs = {
            anios_trabajo_actual: {
                label: "Años en trabajo actual",
                placeholder: "Ej: 3",
                keyboardType: 'numeric',
                icon: "work",
                iconLibrary: "MaterialIcons"
            },
            edad: {
                label: "Edad",
                placeholder: "Ej: 35",
                keyboardType: 'numeric',
                icon: "cake",
                iconLibrary: "MaterialIcons"
            },
            genero: {
                label: "Género",
                type: 'picker',
                placeholder: "Selecciona tu género",
                icon: "people",
                iconLibrary: "MaterialIcons",
                options: [
                    { label: "Masculino", value: "masculino" },
                    { label: "Femenino", value: "femenino" },
                    { label: "Otro", value: "otro" }
                ]
            },
            estado_civil: {
                label: "Estado Civil",
                type: 'picker',
                placeholder: "Selecciona tu estado civil",
                icon: "favorite",
                iconLibrary: "MaterialIcons",
                options: [
                    { label: "Soltero/a", value: "soltero" },
                    { label: "Casado/a", value: "casado" },
                    { label: "Divorciado/a", value: "divorciado" },
                    { label: "Viudo/a", value: "viudo" },
                    { label: "Unión libre", value: "union_libre" }
                ]
            },
            hijos_biologicos: {
                label: "Número de hijos biológicos",
                placeholder: "Ej: 0, 1, 2, 3...",
                keyboardType: 'numeric',
                icon: "child-care",
                iconLibrary: "MaterialIcons"
            },
            ya_ha_adoptado: {
                label: "¿Has adoptado anteriormente?",
                type: 'picker',
                placeholder: "Selecciona una opción",
                icon: "volunteer-activism",
                iconLibrary: "MaterialIcons",
                options: [
                    { label: "Sí", value: "si" },
                    { label: "No", value: "no" }
                ]
            },
            ingreso_mensual: {
                label: "Ingreso mensual (MXN)",
                placeholder: "Ej: 25,000",
                keyboardType: 'numeric',
                icon: "attach-money",
                iconLibrary: "MaterialIcons"
            },
            tipo_casa: {
                label: "Tipo de vivienda",
                type: 'picker',
                placeholder: "Selecciona tu tipo de vivienda",
                icon: "home",
                iconLibrary: "MaterialIcons",
                options: [
                    { label: "Casa propia", value: "casa_propia" },
                    { label: "Casa rentada", value: "casa_rentada" },
                    { label: "Departamento propio", value: "depto_propio" },
                    { label: "Departamento rentado", value: "depto_rentado" },
                    { label: "Casa familiar", value: "casa_familiar" }
                ]
            },
            ultimo_grado_estudios: {
                label: "Último grado de estudios",
                type: 'picker',
                placeholder: "Selecciona tu nivel educativo",
                icon: "school",
                iconLibrary: "MaterialIcons",
                options: [
                    { label: "Primaria", value: "primaria" },
                    { label: "Secundaria", value: "secundaria" },
                    { label: "Bachillerato", value: "bachillerato" },
                    { label: "Técnico", value: "tecnico" },
                    { label: "Licenciatura", value: "licenciatura" },
                    { label: "Maestría", value: "maestria" },
                    { label: "Doctorado", value: "doctorado" }
                ]
            },
            ciudad: {
                label: "Ciudad",
                placeholder: "Ej: Ciudad de México",
                icon: "location-city",
                iconLibrary: "MaterialIcons"
            },
            estado: {
                label: "Estado",
                placeholder: "Ej: CDMX",
                icon: "place",
                iconLibrary: "MaterialIcons"
            }
        };

        return configs[fieldName] || {
            label: fieldName,
            placeholder: `Ingresa ${fieldName}`,
            icon: "info",
            iconLibrary: "MaterialIcons"
        };
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />

            {/* Header */}
            <View style={styles.header}>
                <Animated.View
                    style={[
                        styles.headerContent,
                        {
                            opacity: fadeAnim,
                            transform: [{
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-30, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <View style={styles.headerIcon}>
                        {renderIcon(steps[currentStep].icon, steps[currentStep].iconLibrary, 32, "#fff")}
                    </View>

                    <Text style={styles.headerTitle}>
                        {steps[currentStep].title}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        {steps[currentStep].subtitle}
                    </Text>

                    {/* Progress indicator */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <Animated.View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: progressAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%']
                                        })
                                    }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            Paso {currentStep + 1} de {steps.length}
                        </Text>
                    </View>
                </Animated.View>
            </View>

            {/* Form Content */}
            <Animated.View
                style={[
                    styles.formContainer,
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
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.fieldsContainer}>
                        {steps[currentStep].fields.map(fieldName => renderField(fieldName))}
                    </View>
                </ScrollView>
            </Animated.View>

            {/* Navigation Buttons */}
            <Animated.View
                style={[
                    styles.navigationContainer,
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
                {currentStep > 0 && (
                    <TouchableOpacity
                        style={[styles.navButton, styles.prevButton]}
                        onPress={prevStep}
                        activeOpacity={0.8}
                    >
                        <View style={styles.buttonContent}>
                            <Icon name="arrow-back" size={20} color="#64748b" />
                            <Text style={styles.prevButtonText}>Anterior</Text>
                        </View>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[
                        styles.navButton,
                        styles.nextButton,
                        currentStep === 0 && styles.fullWidthButton,
                        currentStep === steps.length - 1 && styles.submitButton
                    ]}
                    onPress={nextStep}
                    activeOpacity={0.8}
                >
                    <View style={styles.buttonContent}>
                        <Text style={styles.nextButtonText}>
                            {currentStep === steps.length - 1 ? 'Enviar' : 'Siguiente'}
                        </Text>
                        {currentStep === steps.length - 1 ? (
                            <Icon name="check" size={20} color="#fff" />
                        ) : (
                            <Icon name="arrow-forward" size={20} color="#fff" />
                        )}
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#3AAFA9',
        paddingTop: StatusBar.currentHeight || 44,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#3AAFA9',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 12,
    },
    headerContent: {
        alignItems: 'center',
    },
    headerIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#3AAFA9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '400',
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
    },
    progressBar: {
        width: '85%',
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 3,
        marginBottom: 10,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 3,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    progressText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        fontWeight: '600',
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
        marginTop: -15,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 140,
        paddingTop: 10,
    },
    fieldsContainer: {
        padding: 20,
    },
    fieldContainer: {
        marginBottom: 25,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 17,
        fontWeight: '700',
        color: '#2d3748',
        marginLeft: 8,
        letterSpacing: 0.3,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#3AAFA9',
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        fontWeight: '500',
        color: '#2d3748',
    },
    inputFilled: {
        borderColor: '#3AAFA9',
        backgroundColor: '#f7faff',
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#3AAFA9',
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    picker: {
        height: 55,
        color: '#2d3748',
        fontWeight: '500',
    },
    navigationContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingBottom: 35,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    navButton: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    prevButton: {
        backgroundColor: '#f1f5f9',
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#e2e8f0',
    },
    nextButton: {
        backgroundColor: '#3AAFA9',
        marginLeft: 12,
    },
    submitButton: {
        backgroundColor: '#3AAFA9',
    },
    fullWidthButton: {
        marginLeft: 0,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    prevButtonText: {
        color: '#64748b',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginLeft: 8,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginRight: 8,
    },
});

export default FormularioAdopScreen;