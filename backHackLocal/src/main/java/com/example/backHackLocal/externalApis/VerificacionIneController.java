package com.example.backHackLocal.externalApis;


import com.example.backHackLocal.dto.VerificacionIneRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verificacion-ine")
public class VerificacionIneController {

    @Autowired
    private VerificacionIneService verificacionIneService;

    @PostMapping
    public ResponseEntity<?> verificar(@RequestBody VerificacionIneRequest request) {
        return verificacionIneService.verificarINE(request);
    }
}
