import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, TouchableWithoutFeedback, StatusBar, Keyboard, Alert, Modal } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const SignUp = ({ navigation }) => {
    const [correo, setCorreo] = useState('');
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [sexo, setSexo] = useState('');
    const [showSexoModal, setShowSexoModal] = useState(false);

    const sexoOptions = [
        { label: 'Masculino', value: 'masculino' },
        { label: 'Femenino', value: 'femenino' },
    ];

    const handleSexoSelect = (value) => {
        setSexo(value);
        setShowSexoModal(false);
    };

    const getSexoLabel = () => {
        const selected = sexoOptions.find(option => option.value === sexo);
        return selected ? selected.label : 'Seleccionar sexo';
    };

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert('', 'Las contraseñas no coinciden');
        } else if (password.length < 6) {
            Alert.alert('', 'La contraseña debe tener al menos 6 caracteres');
        } else {
            const registrationData = new FormData();
            registrationData.append('correo', correo);
            registrationData.append('nombre', nombre);
            registrationData.append('sexo', sexo);
            registrationData.append('password', password);

            try {
                const response = await fetch('http://192.168.0.106:5000/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    body: registrationData,
                });

                if (response.status === 201) {
                    Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente');
                    navigation.navigate('SignIn');
                } else {
                    const errorData = await response.json();
                    Alert.alert('Error en el registro', errorData.message || 'Hubo un problema con tu registro');
                }
            } catch (error) {
                console.error('Error en la conexión al servidor:', error);
                Alert.alert('Error', 'Error en la conexión al servidor');
            }
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.mainContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

                {/* Header con gradiente */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Crear Cuenta</Text>
                        <Text style={styles.subtitle}>¡Únete a nuestra comunidad!</Text>
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    <View style={styles.formContainer}>
                        {/* Campo Nombre */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nombre completo</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="#3AAFA9" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ingresa tu nombre"
                                    placeholderTextColor="#A0A0A0"
                                    value={nombre}
                                    onChangeText={setNombre}
                                />
                            </View>
                        </View>

                        {/* Campo Correo */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Correo electrónico</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#3AAFA9" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="ejemplo@correo.com"
                                    placeholderTextColor="#A0A0A0"
                                    value={correo}
                                    onChangeText={setCorreo}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Selector de Sexo Personalizado */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Sexo</Text>
                            <TouchableOpacity
                                style={styles.inputContainer}
                                onPress={() => setShowSexoModal(true)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="transgender-outline" size={20} color="#3AAFA9" style={styles.inputIcon} />
                                <Text style={[styles.selectorText, { color: sexo ? '#2C3E50' : '#A0A0A0' }]}>
                                    {getSexoLabel()}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#7C7C7C" />
                            </TouchableOpacity>
                        </View>

                        {/* Campo Contraseña */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Contraseña</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#3AAFA9" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mínimo 6 caracteres"
                                    placeholderTextColor="#A0A0A0"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#3AAFA9"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Campo Confirmar Contraseña */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Confirmar contraseña</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#3AAFA9" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirma tu contraseña"
                                    placeholderTextColor="#A0A0A0"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showPassword}
                                />
                            </View>
                        </View>

                        {/* Términos y condiciones */}
                        <Text style={styles.disclaimer}>
                            Al crear una cuenta, aceptas nuestros{' '}
                            <Text style={styles.linkText}>Términos y Condiciones</Text>
                            {' '}y{' '}
                            <Text style={styles.linkText}>Política de Privacidad</Text>
                        </Text>

                        {/* Botón de registro */}
                        <TouchableOpacity
                            style={styles.signUpButton}
                            onPress={handleSignUp}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.signUpButtonText}>Crear Cuenta</Text>
                        </TouchableOpacity>

                        {/* Link para iniciar sesión */}
                        <View style={styles.signInContainer}>
                            <Text style={styles.signInText}>¿Ya tienes una cuenta? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                                <Text style={styles.signInLink}>Inicia Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/* Modal para seleccionar sexo */}
                <Modal
                    visible={showSexoModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowSexoModal(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowSexoModal(false)}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Seleccionar Sexo</Text>

                                {sexoOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[
                                            styles.modalOption,
                                            sexo === option.value && styles.modalOptionSelected
                                        ]}
                                        onPress={() => handleSexoSelect(option.value)}
                                    >
                                        <Text style={[
                                            styles.modalOptionText,
                                            sexo === option.value && styles.modalOptionTextSelected
                                        ]}>
                                            {option.label}
                                        </Text>
                                        {sexo === option.value && (
                                            <Ionicons name="checkmark" size={20} color="#4A90E2" />
                                        )}
                                    </TouchableOpacity>
                                ))}

                                <TouchableOpacity
                                    style={styles.modalCancelButton}
                                    onPress={() => setShowSexoModal(false)}
                                >
                                    <Text style={styles.modalCancelText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerContainer: {
        backgroundColor: '#3AAFA9',
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerContent: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    scrollView: {
        flex: 1,
    },
    scrollContainer: {
        paddingVertical: 20,
    },
    formContainer: {
        paddingHorizontal: 20,
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
    selectorText: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 2,
    },
    disclaimer: {
        fontSize: 13,
        color: '#7C7C7C',
        textAlign: 'center',
        lineHeight: 18,
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    linkText: {
        color: '#3AAFA9',
        fontWeight: '600',
    },
    signUpButton: {
        backgroundColor: '#3AAFA9',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#3AAFA9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    signUpButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
    signInText: {
        fontSize: 14,
        color: '#7C7C7C',
    },
    signInLink: {
        fontSize: 14,
        color: '#3AAFA9',
        fontWeight: '600',
    },
    // Estilos del Modal
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
        color: '#4A90E2',
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

export default SignUp;