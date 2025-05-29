package com.example.backHackLocal.controllers;


import com.example.backHackLocal.model.NinoAdoptado;
import com.example.backHackLocal.services.NinoAdoptadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ninos")
public class NinoAdoptadoController {

    @Autowired
    private NinoAdoptadoService service;

    @PostMapping
    public ResponseEntity<NinoAdoptado> crear(@RequestBody NinoAdoptado nino) {
        return ResponseEntity.ok(service.crear(nino));
    }

    @GetMapping
    public List<NinoAdoptado> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NinoAdoptado> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<NinoAdoptado> actualizar(@PathVariable Long id, @RequestBody NinoAdoptado nino) {
        return ResponseEntity.ok(service.actualizar(id, nino));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
