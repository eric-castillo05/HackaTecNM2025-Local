// FormularioAdopScreen.js
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
    Alert,
    KeyboardAvoidingView,
    Platform,
    Modal,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const FormularioAdopScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [currentStep, setCurrentStep] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [currentField, setCurrentField] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [curpData, setCurpData] = useState(null); // Nuevo estado para almacenar datos del CURP
    const [showConfirmation, setShowConfirmation] = useState(false); // Estado para mostrar confirmación
    const [formData, setFormData] = useState({
        // Paso 0: Verificación de Credencial
        codigo_credencial: '',

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
            title: "Verificación de CURP",
            subtitle: "Ingresa tu CURP",
            icon: "verified-user",
            iconLibrary: "MaterialIcons",
            fields: ['codigo_credencial']
        },
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

    // Función para formatear fecha
    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        const opciones = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('es-ES', opciones);
    };

    // Función para calcular edad
    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }

        return edad;
    };

    // Función para verificar CURP
    const verificarCurp = async (curp) => {
        try {
            setIsVerifying(true);

            const response = await fetch(`http://192.168.0.102:8080/api/curp/verificar?curp=${curp}`, {
                method: 'POST',
                headers: {
                    'Bearer': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZDllMGRlODU0NjI1NThjMWUzOGFkZjU4ZjZkOTE5MzBhNWU5MmZiZGNmMGYxODUzY2NhN2U5N2RjOGMwNzQxNmFiNzM2NmQ1MmJkNjIyZWYiLCJpYXQiOjE3NDg0OTk0NTQuNzQ1NjAzLCJuYmYiOjE3NDg0OTk0NTQuNzQ1NjIyLCJleHAiOjE3ODAwMzU0NTQuNzI2OCwic3ViIjoiNjE1MiIsInNjb3BlcyI6W119.blZydhhwzIR1651zOw92JQ9CO97IdsX8w_IDdb5dC5ylgNVmtUpxc8qtZjvbbPsODmZaEWnW-9c20ykf8Enpecn8RvkYD8AX4oVDk5cgtOKlzcclkiVavsmCb-niJQlMDIkl89EfDdSzj7FYcy5OejOfaBOeyd0jJ6cnoIhYyx81hZoW_i9KM1iT8MV_ohsim8UpqOBXumpbhOod5Uv0-iKD39KAzsEqMN14TJA9hjVscvcQFJTx2ycCOFrrdK6oCYJypt5Hj6CGMx88NZOsz6MwRUwtqDWjQe1To5XHepq85fOz4rPVrKDD6I2n-EJIt_cmz9AKn7E1GzaqxHahVX1yVKoCOrvteG8ycL5ACmHcva_BHwRMhuJFIoSe2KQmU3uuIabEB5NoC4g6JmJxqVGuaLvaDxFSlDoDwyR-UoV7GCAUaskPeYzy5uc0Ab3GefeU9bYdxpAke50dZt8SW9khIjaEWj67cEW_w312tdRNfoxBHrrmwB-wGfkIvHCd6tmGDR8uoB8YTnj6o0AqIih4uNswfbWmIZtT1sR0stYCbEuSswtiirAOYszQTwIKMMs_0tbIsTF0EEHv1WDIC_jRsEg6ys7OkY6G2ZrL_TVHrfXaiLMHuo-BkhuH01WqXGXWCZWQ3qJwTGsBZVpk3rB5Oz0xPINMpvs4Zth6N6Q',
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok && data.data?.citizen?.registros?.length > 0) {
                const registro = data.data.citizen.registros[0];
                setCurpData(registro);
                setShowConfirmation(true);
                return { success: true, data: registro };
            } else {
                return {
                    success: false,
                    message: data.message || 'CURP no válido o no encontrado'
                };
            }
        } catch (error) {
            console.error('Error al verificar CURP:', error);
            return {
                success: false,
                message: 'Error de conexión. Verifica tu conexión a internet.'
            };
        } finally {
            setIsVerifying(false);
        }
    };

    // Función para mostrar la confirmación de datos
    const mostrarConfirmacionDatos = (datos) => {
        const nombreCompleto = `${datos.nombres} ${datos.primerApellido} ${datos.segundoApellido}`.trim();
        const fechaFormateada = formatearFecha(datos.fechaNacimiento);
        const edad = calcularEdad(datos.fechaNacimiento);

        Alert.alert(
            "🔍 Verificar Datos del CURP",
            `Por favor confirma que los siguientes datos son correctos:\n\n` +
            `👤 Nombre: ${nombreCompleto}\n` +
            `🎂 Fecha de nacimiento: ${fechaFormateada}\n` +
            `📅 Edad: ${edad} años\n` +
            `⚧ Sexo: ${datos.sexo}\n` +
            `🌎 Nacionalidad: ${datos.nacionalidad}\n` +
            `📍 Entidad: ${datos.entidad}\n\n` +
            `¿Estos datos son correctos?`,
            [
                {
                    text: "❌ No, revisar CURP",
                    style: "cancel",
                    onPress: () => {
                        setShowConfirmation(false);
                        setCurpData(null);
                        // Limpiar el campo CURP para que el usuario pueda corregirlo
                        updateFormData('codigo_credencial', '');
                    }
                },
                {
                    text: "✅ Sí, continuar",
                    style: "default",
                    onPress: () => {
                        setShowConfirmation(false);
                        // Auto-llenar algunos campos del formulario con los datos del CURP
                        const edad = calcularEdad(datos.fechaNacimiento);
                        updateFormData('edad', edad.toString());

                        // Mapear sexo del CURP al género del formulario
                        const generoMapeado = datos.sexo.toLowerCase() === 'hombre' ? 'masculino' : 'femenino';
                        updateFormData('genero', generoMapeado);

                        // Continuar al siguiente paso
                        setCurrentStep(currentStep + 1);

                        Alert.alert(
                            "✅ CURP Verificado",
                            "Datos confirmados correctamente. Algunos campos han sido llenados automáticamente con la información de tu CURP.",
                            [{ text: "Continuar", style: "default" }]
                        );
                    }
                }
            ],
            { cancelable: false }
        );
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

    const nextStep = async () => {
        if (!validateCurrentStep()) {
            return;
        }

        // Si estamos en el paso 0 (verificación de CURP)
        if (currentStep === 0) {
            const curp = formData.codigo_credencial.trim().toUpperCase();

            // Validación básica del formato CURP (18 caracteres alfanuméricos)
            if (curp.length !== 18) {
                Alert.alert(
                    "CURP Inválido",
                    "El CURP debe tener exactamente 18 caracteres.",
                    [{ text: "Entendido", style: "default" }]
                );
                return;
            }

            // Verificar CURP con la API
            const resultado = await verificarCurp(curp);

            if (resultado.success) {
                // Mostrar confirmación de datos
                mostrarConfirmacionDatos(resultado.data);
            } else {
                Alert.alert(
                    "❌ Error de Verificación",
                    resultado.message,
                    [
                        {
                            text: "Reintentar",
                            style: "default"
                        }
                    ]
                );
            }
        } else if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
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
            ingreso_mensual: parseFloat(formData.ingreso_mensual) || 0,
            // Incluir datos del CURP verificado
            curp_verificado: curpData ? {
                curp: curpData.curp,
                nombre_completo: `${curpData.nombres} ${curpData.primerApellido} ${curpData.segundoApellido}`.trim(),
                fecha_nacimiento: curpData.fechaNacimiento,
                sexo: curpData.sexo,
                nacionalidad: curpData.nacionalidad,
                entidad: curpData.entidad
            } : null
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

    const openModal = (fieldName) => {
        setCurrentField(fieldName);
        setShowModal(true);
    };

    const handleOptionSelect = (value) => {
        updateFormData(currentField, value);
        setShowModal(false);
    };

    const getSelectedLabel = (fieldName) => {
        const fieldConfig = getFieldConfig(fieldName);
        const selected = fieldConfig.options?.find(option => option.value === formData[fieldName]);
        return selected ? selected.label : fieldConfig.placeholder;
    };

    const renderIcon = (iconName, iconLibrary, size = 20, color = "#667eea") => {
        if (iconLibrary === "MaterialCommunityIcons") {
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        }
        return <MaterialIcons name={iconName} size={size} color={color} />;
    };

    const renderField = (fieldName) => {
        const fieldConfig = getFieldConfig(fieldName);

        if (fieldConfig.type === 'picker') {
            return (
                <Animated.View
                    key={fieldName}
                    style={[
                        styles.inputGroup,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    <Text style={styles.inputLabel}>{fieldConfig.label}</Text>
                    {(fieldName === 'edad' || fieldName === 'genero') && curpData && (
                        <View style={styles.autoFilledIndicator}>
                            <MaterialIcons name="auto-awesome" size={16} color="#10b981" />
                            <Text style={styles.autoFilledText}>Auto-llenado</Text>
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.inputContainer}
                        onPress={() => openModal(fieldName)}
                        activeOpacity={0.7}
                        disabled={(fieldName === 'edad' && curpData)}
                    >
                        <Ionicons
                            name={fieldConfig.ionIcon}
                            size={20}
                            color="#3AAFA9"
                            style={styles.inputIcon}
                        />
                        <Text style={[
                            styles.selectorText,
                            { color: formData[fieldName] ? '#2C3E50' : '#A0A0A0' }
                        ]}>
                            {getSelectedLabel(fieldName)}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#7C7C7C" />
                    </TouchableOpacity>
                </Animated.View>
            );
        }

        return (
            <Animated.View
                key={fieldName}
                style={[
                    styles.inputGroup,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <Text style={styles.inputLabel}>{fieldConfig.label}</Text>
                {fieldName === 'edad' && curpData && (
                    <View style={styles.autoFilledIndicator}>
                        <MaterialIcons name="auto-awesome" size={16} color="#10b981" />
                        <Text style={styles.autoFilledText}>Auto-llenado</Text>
                    </View>
                )}
                <View style={styles.inputContainer}>
                    <Ionicons
                        name={fieldConfig.ionIcon}
                        size={20}
                        color="#3AAFA9"
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={[
                            styles.input,
                            formData[fieldName] && styles.inputFilled,
                            (fieldName === 'edad' && curpData) && styles.inputAutoFilled
                        ]}
                        placeholder={fieldConfig.placeholder}
                        placeholderTextColor="#A0A0A0"
                        value={formData[fieldName]}
                        onChangeText={(value) => updateFormData(fieldName, value)}
                        keyboardType={fieldConfig.keyboardType || 'default'}
                        multiline={fieldConfig.multiline || false}
                        numberOfLines={fieldConfig.numberOfLines || 1}
                        autoCapitalize={fieldName === 'codigo_credencial' ? 'characters' : 'sentences'}
                        maxLength={fieldName === 'codigo_credencial' ? 18 : undefined}
                        editable={!(fieldName === 'edad' && curpData)} // Deshabilitar edición de edad si viene del CURP
                    />
                </View>
            </Animated.View>
        );
    };

    const getFieldConfig = (fieldName) => {
        const configs = {
            codigo_credencial: {
                label: "CURP",
                placeholder: "Ej: XEXX010101HNEXXXA4",
                keyboardType: 'default',
                autoCapitalize: 'characters',
                ionIcon: "document-text-outline"
            },
            anios_trabajo_actual: {
                label: "Años en trabajo actual",
                placeholder: "Ej: 3",
                keyboardType: 'numeric',
                ionIcon: "briefcase-outline"
            },
            edad: {
                label: "Edad",
                placeholder: "Ej: 35",
                keyboardType: 'numeric',
                ionIcon: "calendar-outline"
            },
            genero: {
                label: "Género",
                type: 'picker',
                placeholder: "Selecciona tu género",
                ionIcon: "people-outline",
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
                ionIcon: "heart-outline",
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
                ionIcon: "people-circle-outline"
            },
            ya_ha_adoptado: {
                label: "¿Has adoptado anteriormente?",
                type: 'picker',
                placeholder: "Selecciona una opción",
                ionIcon: "heart-circle-outline",
                options: [
                    { label: "Sí", value: "si" },
                    { label: "No", value: "no" }
                ]
            },
            ingreso_mensual: {
                label: "Ingreso mensual (MXN)",
                placeholder: "Ej: 25,000",
                keyboardType: 'numeric',
                ionIcon: "cash-outline"
            },
            tipo_casa: {
                label: "Tipo de vivienda",
                type: 'picker',
                placeholder: "Selecciona tu tipo de vivienda",
                ionIcon: "home-outline",
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
                ionIcon: "school-outline",
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
                ionIcon: "location-outline"
            },
            estado: {
                label: "Estado",
                placeholder: "Ej: CDMX",
                ionIcon: "map-outline"
            }
        };

        return configs[fieldName] || {
            label: fieldName,
            placeholder: `Ingresa ${fieldName}`,
            ionIcon: "information-circle-outline"
        };
    };

    const renderModal = () => {
        if (!showModal || !currentField) return null;

        const fieldConfig = getFieldConfig(currentField);

        return (
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{fieldConfig.label}</Text>

                            {fieldConfig.options?.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.modalOption,
                                        formData[currentField] === option.value && styles.modalOptionSelected
                                    ]}
                                    onPress={() => handleOptionSelect(option.value)}
                                >
                                    <Text style={[
                                        styles.modalOptionText,
                                        formData[currentField] === option.value && styles.modalOptionTextSelected
                                    ]}>
                                        {option.label}
                                    </Text>
                                    {formData[currentField] === option.value && (
                                        <Ionicons name="checkmark" size={20} color="#3AAFA9" />
                                    )}
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setShowModal(false)}
                            >
                                <Text style={styles.modalCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="light" />

            {/* Status Bar Background View */}
            <View style={[styles.statusBarBackground, { height: insets.top }]} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
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
                    { paddingBottom: Math.max(insets.bottom, 20) + 15 },
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
                        disabled={isVerifying}
                    >
                        <View style={styles.buttonContent}>
                            <Ionicons name="arrow-back" size={20} color="#64748b" />
                            <Text style={styles.prevButtonText}>Anterior</Text>
                        </View>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[
                        styles.navButton,
                        styles.nextButton,
                        currentStep === 0 && styles.fullWidthButton,
                        currentStep === steps.length - 1 && styles.submitButton,
                        isVerifying && styles.disabledButton
                    ]}
                    onPress={nextStep}
                    activeOpacity={0.8}
                    disabled={isVerifying}
                >
                    <View style={styles.buttonContent}>
                        {isVerifying ? (
                            <>
                                <ActivityIndicator size="small" color="#fff" />
                                <Text style={styles.nextButtonText}>Verificando...</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.nextButtonText}>
                                    {currentStep === 0 ? 'Verificar' : currentStep === steps.length - 1 ? 'Enviar' : 'Siguiente'}
                                </Text>
                                {currentStep === 0 ? (
                                    <Ionicons name="shield-checkmark" size={20} color="#fff" />
                                ) : currentStep === steps.length - 1 ? (
                                    <Ionicons name="checkmark" size={20} color="#fff" />
                                ) : (
                                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                                )}
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </Animated.View>

            {/* Modal */}
            {renderModal()}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    statusBarBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#3AAFA9',
        zIndex: 1,
    },
    header: {
        backgroundColor: '#3AAFA9',
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
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
        backgroundColor: 'rgba(255,255,255,0.2)',
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
        backgroundColor: '#F8F9FA',
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
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#3AAFA9',
        minHeight: 48,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2C3E50',
        paddingVertical: 0,
    },
    inputFilled: {
        color: '#2C3E50',
    },
    inputAutoFilled: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: '#10b981',
    },
    selectorText: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 2,
    },
    autoFilledIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    autoFilledText: {
        color: '#10b981',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    navigationContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
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
        paddingVertical: 16,
        borderRadius: 12,
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
    disabledButton: {
        backgroundColor: '#94a3b8',
        opacity: 0.7,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    prevButtonText: {
        color: '#64748b',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        marginLeft: 8,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        marginRight: 8,
    },
    // Estilos del Modal (copiados del SignUp)
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    modalOptionSelected: {
        backgroundColor: '#F0F7FF',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#2C3E50',
    },
    modalOptionTextSelected: {
        color: '#3AAFA9',
        fontWeight: '600',
    },
    modalCancelButton: {
        marginTop: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    modalCancelText: {
        fontSize: 16,
        color: '#7C7C7C',
        fontWeight: '500',
    },
});

export default FormularioAdopScreen;