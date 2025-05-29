package com.example.backHackLocal.controllers;


import com.example.backHackLocal.model.EvaluacionCandidato;
import com.example.backHackLocal.services.EvaluacionCandidatoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluaciones")
public class EvaluacionCandidatoController {

    private final EvaluacionCandidatoService service;

    public EvaluacionCandidatoController(EvaluacionCandidatoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<EvaluacionCandidato> crear(@RequestBody EvaluacionCandidato candidato) {
        return ResponseEntity.ok(service.crear(candidato));
    }

    @GetMapping
    public ResponseEntity<List<EvaluacionCandidato>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvaluacionCandidato> obtenerPorId(@PathVariable Long id) {
        return service.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EvaluacionCandidato> actualizar(@PathVariable Long id, @RequestBody EvaluacionCandidato actualizado) {
        return service.actualizar(id, actualizado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
