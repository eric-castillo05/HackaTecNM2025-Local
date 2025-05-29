// CitasEntrevistasScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Alert,
    SafeAreaView,
    Modal,
    TextInput,
    FlatList
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const CitasEntrevistasScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    // Estados
    const [activeTab, setActiveTab] = useState('pendientes'); // 'pendientes', 'agendar', 'historial'
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [notes, setNotes] = useState('');

    // Datos de ejemplo
    const [citasPendientes] = useState([
        {
            id: 1,
            tipo: 'Entrevista Inicial',
            fecha: '2025-06-02',
            hora: '10:00 AM',
            ubicacion: 'Oficina Principal',
            psicólogo: 'Dra. María González',
            estado: 'confirmada',
            notas: 'Traer documentos de identidad'
        },
        {
            id: 2,
            tipo: 'Evaluación Psicológica',
            fecha: '2025-06-05',
            hora: '2:00 PM',
            ubicacion: 'Consultorio 2',
            psicólogo: 'Dr. Carlos Mendez',
            estado: 'pendiente',
            notas: 'Evaluación individual de 2 horas'
        },
        {
            id: 3,
            tipo: 'Visita Domiciliaria',
            fecha: '2025-06-08',
            hora: '9:00 AM',
            ubicacion: 'Domicilio del solicitante',
            psicólogo: 'Lic. Ana Torres',
            estado: 'programada',
            notas: 'Evaluación del entorno familiar'
        }
    ]);

    const [historialCitas] = useState([
        {
            id: 4,
            tipo: 'Orientación Pre-Adoptiva',
            fecha: '2025-05-15',
            hora: '11:00 AM',
            ubicacion: 'Aula 1',
            psicólogo: 'Lic. Pedro Ruiz',
            estado: 'completada',
            notas: 'Sesión grupal completada exitosamente'
        }
    ]);

    const tiposCitas = [
        { id: 'inicial', nombre: 'Entrevista Inicial', duracion: '1 hora' },
        { id: 'psicologica', nombre: 'Evaluación Psicológica', duracion: '2 horas' },
        { id: 'domiciliaria', nombre: 'Visita Domiciliaria', duracion: '1.5 horas' },
        { id: 'seguimiento', nombre: 'Cita de Seguimiento', duracion: '45 min' }
    ];

    const horariosDisponibles = [
        '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'
    ];

    useEffect(() => {
        animateIn();
    }, []);

    const animateIn = () => {
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

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'confirmada': return '#10b981';
            case 'pendiente': return '#f59e0b';
            case 'programada': return '#3b82f6';
            case 'completada': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const getStatusText = (estado) => {
        switch (estado) {
            case 'confirmada': return 'Confirmada';
            case 'pendiente': return 'Pendiente de confirmación';
            case 'programada': return 'Programada';
            case 'completada': return 'Completada';
            default: return estado;
        }
    };

    const handleAgendarCita = () => {
        if (!selectedDate || !selectedTime || !selectedType) {
            Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
            return;
        }

        Alert.alert(
            'Cita Agendada',
            `Tu solicitud de cita ha sido enviada.\n\nTipo: ${tiposCitas.find(t => t.id === selectedType)?.nombre}\nFecha: ${selectedDate}\nHora: ${selectedTime}\n\nRecibirás una confirmación pronto.`,
            [{ text: 'OK', onPress: () => {
                    setModalVisible(false);
                    setSelectedDate('');
                    setSelectedTime('');
                    setSelectedType('');
                    setNotes('');
                }}]
        );
    };

    const renderCitaCard = (cita) => (
        <View key={cita.id} style={styles.citaCard}>
            <View style={styles.citaHeader}>
                <View style={styles.citaInfo}>
                    <Text style={styles.citaTipo}>{cita.tipo}</Text>
                    <View style={[styles.estadoBadge, { backgroundColor: getStatusColor(cita.estado) }]}>
                        <Text style={styles.estadoText}>{getStatusText(cita.estado)}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.menuButton}>
                    <MaterialIcons name="more-vert" size={20} color="#6b7280" />
                </TouchableOpacity>
            </View>

            <View style={styles.citaDetalles}>
                <View style={styles.detalleRow}>
                    <MaterialIcons name="calendar-today" size={16} color="#6b7280" />
                    <Text style={styles.detalleText}>{cita.fecha}</Text>
                </View>
                <View style={styles.detalleRow}>
                    <MaterialIcons name="access-time" size={16} color="#6b7280" />
                    <Text style={styles.detalleText}>{cita.hora}</Text>
                </View>
                <View style={styles.detalleRow}>
                    <MaterialIcons name="location-on" size={16} color="#6b7280" />
                    <Text style={styles.detalleText}>{cita.ubicacion}</Text>
                </View>
                <View style={styles.detalleRow}>
                    <MaterialIcons name="person" size={16} color="#6b7280" />
                    <Text style={styles.detalleText}>{cita.psicólogo}</Text>
                </View>
            </View>

            {cita.notas && (
                <View style={styles.notasContainer}>
                    <Text style={styles.notasLabel}>Notas:</Text>
                    <Text style={styles.notasText}>{cita.notas}</Text>
                </View>
            )}

            <View style={styles.citaActions}>
                {cita.estado === 'pendiente' && (
                    <TouchableOpacity style={styles.confirmarButton}>
                        <Text style={styles.confirmarButtonText}>Confirmar</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.reprogramarButton}>
                    <Text style={styles.reprogramarButtonText}>Reprogramar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderAgendarForm = () => (
        <View style={styles.agendarContainer}>
            <Text style={styles.formTitle}>Solicitar Nueva Cita</Text>

            <View style={styles.formSection}>
                <Text style={styles.formLabel}>Tipo de Cita *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tiposContainer}>
                    {tiposCitas.map((tipo) => (
                        <TouchableOpacity
                            key={tipo.id}
                            style={[
                                styles.tipoButton,
                                selectedType === tipo.id && styles.tipoButtonSelected
                            ]}
                            onPress={() => setSelectedType(tipo.id)}
                        >
                            <Text style={[
                                styles.tipoButtonText,
                                selectedType === tipo.id && styles.tipoButtonTextSelected
                            ]}>
                                {tipo.nombre}
                            </Text>
                            <Text style={styles.duracionText}>({tipo.duracion})</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.formSection}>
                <Text style={styles.formLabel}>Fecha Preferida *</Text>
                <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => Alert.alert('Calendario', 'Aquí iría un selector de fecha')}
                >
                    <MaterialIcons name="calendar-today" size={20} color="#6b7280" />
                    <Text style={[styles.dateText, !selectedDate && styles.placeholderText]}>
                        {selectedDate || 'Seleccionar fecha'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.quickDateButton}
                    onPress={() => setSelectedDate('2025-06-10')}
                >
                    <Text style={styles.quickDateText}>Próxima semana disponible</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
                <Text style={styles.formLabel}>Horario Preferido *</Text>
                <View style={styles.horariosGrid}>
                    {horariosDisponibles.map((hora) => (
                        <TouchableOpacity
                            key={hora}
                            style={[
                                styles.horarioButton,
                                selectedTime === hora && styles.horarioButtonSelected
                            ]}
                            onPress={() => setSelectedTime(hora)}
                        >
                            <Text style={[
                                styles.horarioButtonText,
                                selectedTime === hora && styles.horarioButtonTextSelected
                            ]}>
                                {hora}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.formSection}>
                <Text style={styles.formLabel}>Notas Adicionales</Text>
                <TextInput
                    style={styles.notesInput}
                    multiline
                    numberOfLines={3}
                    placeholder="Información adicional o solicitudes especiales..."
                    value={notes}
                    onChangeText={setNotes}
                />
            </View>

            <TouchableOpacity style={styles.agendarButton} onPress={handleAgendarCita}>
                <MaterialIcons name="event" size={20} color="#fff" />
                <Text style={styles.agendarButtonText}>Solicitar Cita</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#1f2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Citas y Entrevistas</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'pendientes' && styles.activeTab]}
                    onPress={() => setActiveTab('pendientes')}
                >
                    <MaterialIcons
                        name="schedule"
                        size={20}
                        color={activeTab === 'pendientes' ? '#3AAFA9' : '#6b7280'}
                    />
                    <Text style={[
                        styles.tabText,
                        activeTab === 'pendientes' && styles.activeTabText
                    ]}>
                        Pendientes ({citasPendientes.length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'agendar' && styles.activeTab]}
                    onPress={() => setActiveTab('agendar')}
                >
                    <MaterialIcons
                        name="add-circle-outline"
                        size={20}
                        color={activeTab === 'agendar' ? '#3AAFA9' : '#6b7280'}
                    />
                    <Text style={[
                        styles.tabText,
                        activeTab === 'agendar' && styles.activeTabText
                    ]}>
                        Agendar
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'historial' && styles.activeTab]}
                    onPress={() => setActiveTab('historial')}
                >
                    <MaterialIcons
                        name="history"
                        size={20}
                        color={activeTab === 'historial' ? '#3AAFA9' : '#6b7280'}
                    />
                    <Text style={[
                        styles.tabText,
                        activeTab === 'historial' && styles.activeTabText
                    ]}>
                        Historial
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{
                            translateY: slideAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [30, 0]
                            })
                        }]
                    }}
                >
                    {activeTab === 'pendientes' && (
                        <View>
                            <Text style={styles.sectionTitle}>Próximas Citas</Text>
                            {citasPendientes.map(cita => renderCitaCard(cita))}
                        </View>
                    )}

                    {activeTab === 'agendar' && renderAgendarForm()}

                    {activeTab === 'historial' && (
                        <View>
                            <Text style={styles.sectionTitle}>Historial de Citas</Text>
                            {historialCitas.map(cita => renderCitaCard(cita))}
                        </View>
                    )}
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
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        flex: 1,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 40,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginHorizontal: 4,
    },
    activeTab: {
        backgroundColor: '#f0f9ff',
    },
    tabText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        marginLeft: 6,
    },
    activeTabText: {
        color: '#3AAFA9',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1f2937',
        marginBottom: 20,
    },
    citaCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    citaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    citaInfo: {
        flex: 1,
    },
    citaTipo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 6,
    },
    estadoBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    estadoText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#fff',
    },
    menuButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    citaDetalles: {
        marginBottom: 12,
    },
    detalleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    detalleText: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 8,
        flex: 1,
    },
    notasContainer: {
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    notasLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 4,
    },
    notasText: {
        fontSize: 13,
        color: '#374151',
        lineHeight: 18,
    },
    citaActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    confirmarButton: {
        backgroundColor: '#3AAFA9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    confirmarButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    reprogramarButton: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    reprogramarButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    agendarContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 20,
        textAlign: 'center',
    },
    formSection: {
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    tiposContainer: {
        marginBottom: 8,
    },
    tipoButton: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 12,
        marginRight: 12,
        minWidth: 140,
        alignItems: 'center',
    },
    tipoButtonSelected: {
        backgroundColor: '#3AAFA9',
        borderColor: '#3AAFA9',
    },
    tipoButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        textAlign: 'center',
    },
    tipoButtonTextSelected: {
        color: '#fff',
    },
    duracionText: {
        fontSize: 10,
        color: '#9ca3af',
        marginTop: 2,
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
    },
    dateText: {
        fontSize: 14,
        color: '#374151',
        marginLeft: 12,
        flex: 1,
    },
    placeholderText: {
        color: '#9ca3af',
    },
    quickDateButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#eff6ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    quickDateText: {
        fontSize: 12,
        color: '#3b82f6',
        fontWeight: '500',
    },
    horariosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    horarioButton: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minWidth: 80,
    },
    horarioButtonSelected: {
        backgroundColor: '#3AAFA9',
        borderColor: '#3AAFA9',
    },
    horarioButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        textAlign: 'center',
    },
    horarioButtonTextSelected: {
        color: '#fff',
    },
    notesInput: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 16,
        fontSize: 14,
        color: '#374151',
        textAlignVertical: 'top',
        minHeight: 80,
    },
    agendarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3AAFA9',
        borderRadius: 12,
        padding: 16,
        marginTop: 10,
    },
    agendarButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginLeft: 8,
    },
});

export default CitasEntrevistasScreen;