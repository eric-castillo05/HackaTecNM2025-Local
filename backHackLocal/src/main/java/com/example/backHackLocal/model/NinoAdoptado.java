package com.example.backHackLocal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "nino_adoptado")
public class NinoAdoptado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idNinoAdoptado;

    @Column
    private String nombre;

    @Column
    private int edad;

    @Column(length = 10)
    private String genero;

    @Column
    private LocalDate fechaAdopcion;


    @Column
    private int estado;

    @ManyToOne
    @JoinColumn(name = "padre_id")
    private PadreAdoptivo padre;

}
