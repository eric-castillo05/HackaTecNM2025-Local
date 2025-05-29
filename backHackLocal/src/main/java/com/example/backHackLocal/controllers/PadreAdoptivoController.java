package com.example.backHackLocal.controllers;

import com.example.backHackLocal.model.PadreAdoptivo;
import com.example.backHackLocal.services.PadreAdoptivoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/padres")
public class PadreAdoptivoController {

    private final PadreAdoptivoService service;

    public PadreAdoptivoController(PadreAdoptivoService service) {
        this.service = service;
    }

    @GetMapping
    public List<PadreAdoptivo> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PadreAdoptivo> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PadreAdoptivo create(@RequestBody PadreAdoptivo padre) {
        return service.create(padre);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PadreAdoptivo> update(@PathVariable Long id, @RequestBody PadreAdoptivo padre) {
        try {
            return ResponseEntity.ok(service.update(id, padre));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
