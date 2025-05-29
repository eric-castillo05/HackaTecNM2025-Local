package com.example.backHackLocal.controllers;

import com.example.backHackLocal.model.EncuestaSeguimiento;
import com.example.backHackLocal.services.EncuestaSeguimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/encuestas")
public class EncuestaSeguimientoController {

    private final EncuestaSeguimientoService service;

    @Autowired
    public EncuestaSeguimientoController(EncuestaSeguimientoService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EncuestaSeguimiento crear(@RequestBody EncuestaSeguimiento encuesta) {
        return service.crear(encuesta);
    }

    @GetMapping
    public List<EncuestaSeguimiento> obtenerTodas() {
        return service.obtenerTodas();
    }

    @GetMapping("/{id}")
    public EncuestaSeguimiento obtenerPorId(@PathVariable Long idEncuesta) {
        return service.obtenerPorId(idEncuesta);
    }

    @PutMapping("/{id}")
    public EncuestaSeguimiento actualizar(@PathVariable Long idEncuesta, @RequestBody EncuestaSeguimiento encuesta) {
        return service.actualizar(idEncuesta, encuesta);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long idEncuesta) {
        service.eliminar(idEncuesta);
    }

}
