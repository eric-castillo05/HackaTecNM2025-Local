package com.example.backHackLocal.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Table(name = "evaluacion_candidato")
public class EvaluacionCandidato extends PadreAdoptivo {

    @Column(length = 10)
    private String genero;

    private int edad;

    @Lob
    private String antecedentesText;

    @Column(length = 20)
    private String estadoCivil;

    private boolean yaHaAdoptado;

    private int hijosBiologicos;

    @Column(length = 50)
    private String ultimoGradoEstudios;

    @Column(precision = 10, scale = 2)
    private BigDecimal ingresoMensual;

    private int aniosTrabajoActual;

    @Column(length = 20)
    private String tipoCasa;

    @Column(length = 100)
    private String ciudad;

    @Column(length = 100)
    private String estado;

    private int psychometricScore;

    private boolean historialPsiquiatrico;

    @Lob
    private String violenciaDomesticaText;

    @Column(length = 10)
    private String suitabilityLabel;

    public EvaluacionCandidato(){
        super();
    }

    public EvaluacionCandidato(String nombre, String correo, String sexo, String password){
        super(nombre, correo, sexo, password);
    }
}




