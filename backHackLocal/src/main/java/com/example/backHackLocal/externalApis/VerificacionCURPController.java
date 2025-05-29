package com.example.backHackLocal.externalApis;


import com.example.backHackLocal.dto.VerificacionIneRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/curp")
public class VerificacionCURPController {

    @Autowired
    private VerificacionCURPService verificacionCURPService;

    @PostMapping("/verificar")
    public ResponseEntity<?> verificar(@RequestParam String curp) {
        return verificacionCURPService.verificarCURP(curp);
    }
}
