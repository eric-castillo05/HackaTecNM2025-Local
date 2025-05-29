package com.example.backHackLocal.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String tipoUsuario; // PADRE o TRABAJADOR
}
