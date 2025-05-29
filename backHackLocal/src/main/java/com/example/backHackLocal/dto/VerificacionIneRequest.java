package com.example.backHackLocal.dto;
import lombok.Data;

@Data
public class VerificacionIneRequest {
    private String ineFront;  // Base64 de la imagen frontal
    private String ineBack;   // Base64 de la imagen trasera
    private String selfie;    // Base64 de la selfie
    private String model = "D"; // Por defecto 'D'
}
