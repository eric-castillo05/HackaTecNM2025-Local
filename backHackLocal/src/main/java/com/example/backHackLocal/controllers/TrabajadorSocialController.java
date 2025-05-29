package com.example.backHackLocal.controllers;

import com.example.backHackLocal.model.TrabajadorSocial;
import com.example.backHackLocal.services.TrabajadorSocialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trabajadores-sociales")
public class TrabajadorSocialController {

    private final TrabajadorSocialService service;

    public TrabajadorSocialController(TrabajadorSocialService service) {
        this.service = service;
    }

    @GetMapping
    public List<TrabajadorSocial> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrabajadorSocial> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    public ResponseEntity<TrabajadorSocial> create(@RequestBody TrabajadorSocial trabajador) {
        TrabajadorSocial creado = service.create(trabajador);
        return ResponseEntity.status(201).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrabajadorSocial> update(@PathVariable Long id, @RequestBody TrabajadorSocial trabajador) {
        TrabajadorSocial actualizado = service.update(id, trabajador);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}