package com.example.backHackLocal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrabajadorSocial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTrabajadorSocial")
    private long idTrabajadorSocial;

    @Column(name = "Nombre", nullable = false)
    private String nombre;

    @Column(name = "Correo", unique = true, nullable = false)
    private String correo;

    @Column(name = "Sexo", nullable = false)
    private String sexo;

    @Column(name = "Password")
    private String password;

}
