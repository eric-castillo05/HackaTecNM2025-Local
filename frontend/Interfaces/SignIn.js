import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Keyboard, TextInput, TouchableOpacity, StatusBar, TouchableWithoutFeedback, Alert } from 'react-native';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = async () => {
        if (!email.trim()) {
            Alert.alert('', 'Por favor ingresa tu email');
            return;
        }
        if (!password.trim()) {
            Alert.alert('', 'Por favor ingresa tu contraseña');
            return;
        }

        try {
            const response = await axios.post(
                'http://192.168.0.102:8080/api/auth/login',
                JSON.stringify({
                    correo: email.trim(), // <-- CAMPO CORRECTO
                    password: password.trim(),
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(response);

            if (response.status === 200) {
                const { localId, isFirstTime } = response.data;

                await AsyncStorage.setItem('userUID', localId);

                Alert.alert('¡Bienvenido!', 'Inicio de sesión exitoso');

                if (isFirstTime) {
                    navigation.navigate('Formulario');
                } else {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Main' }],
                        })
                    );
                }
            } else {
                Alert.alert('Error de autenticación', 'No se pudo iniciar sesión. Intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            if (error.response && error.response.status === 401) {
                Alert.alert('Error', 'Email o contraseña incorrectos');
            } else {
                Alert.alert('Error', 'Ocurrió un error en el servidor');
            }
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.mainContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Iniciar Sesión</Text>
                        <Text style={styles.subtitle}>¡Bienvenido de vuelta!</Text>
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    <View style={styles.formContainer}>
                        {/* Icon */}
                        <View style={styles.iconContainer}>
                            <Ionicons name="person-circle-outline" size={80} color="#4A90E2" />
                        </View>

                        {/* Email Field */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#7C7C7C" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: example@gmail.com"
                                    placeholderTextColor="#A0A0A0"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        {/* Password Field */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Contraseña</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#7C7C7C" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ingresa tu contraseña"
                                    placeholderTextColor="#A0A0A0"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#7C7C7C"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={styles.signInButton}
                            onPress={handleSignIn}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.signInButtonText}>Iniciar Sesión</Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>o</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Sign Up Link */}
                        <View style={styles.signUpContainer}>
                            <Text style={styles.signUpText}>¿No tienes una cuenta? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={styles.signUpLink}>Crear Cuenta</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
    iconContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
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
        borderColor: '#E8ECEF',
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
    helperText: {
        fontSize: 12,
        color: '#7C7C7C',
        marginTop: 6,
        fontStyle: 'italic',
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 30,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#3AAFA9',
        fontWeight: '600',
    },
    signInButton: {
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
    signInButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E8ECEF',
    },
    dividerText: {
        marginHorizontal: 15,
        fontSize: 14,
        color: '#7C7C7C',
        fontWeight: '500',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
    signUpText: {
        fontSize: 14,
        color: '#7C7C7C',
    },
    signUpLink: {
        fontSize: 14,
        color: '#3AAFA9',
        fontWeight: '600',
    },
});

export default SignIn;