package com.example.backHackLocal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "padre_adoptivo")
public class PadreAdoptivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPadreCandidato")
    private long idPadreCandidato;

    @Column(name = "Nombre", nullable = false)
    private String nombre;

    @Column(name = "Correo", unique = true, nullable = false)
    private String correo;

    @Column(name = "Sexo", nullable = false)
    private String sexo;

    @Column(name = "Password")
    private String password;

    public PadreAdoptivo(String nombre, String correo, String sexo, String password) {
        this.nombre = nombre;
        this.correo = correo;
        this.sexo = sexo;
        this.password = password;
    }
}


