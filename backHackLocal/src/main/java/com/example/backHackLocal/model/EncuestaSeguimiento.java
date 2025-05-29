package com.example.backHackLocal.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "encuesta_seguimiento")
public class EncuestaSeguimiento {

    public enum TipoEncuesta {
        PADRE, NINO, TRABAJADORA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "nino_id")
    private NinoAdoptado nino;

    @Enumerated(EnumType.STRING)
    @Column(unique = true)
    private TipoEncuesta tipo;

    @Column
    private LocalDate fechaEncuesta;

    @Lob
    @Column(columnDefinition = "TEXT") // Alternativa si no hay soporte para JSON directamente
    private String preguntasJson;

    @Lob
    @Column
    private String observaciones;

    @Column
    private boolean alertaGenerada;

    // Getters, setters, constructor vacío
}
