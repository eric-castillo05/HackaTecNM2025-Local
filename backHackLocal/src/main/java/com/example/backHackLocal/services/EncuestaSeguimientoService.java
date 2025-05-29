package com.example.backHackLocal.services;

import com.example.backHackLocal.model.EncuestaSeguimiento;
import com.example.backHackLocal.repository.EncuestaSeguimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EncuestaSeguimientoService {

    private final EncuestaSeguimientoRepository repository;

    @Autowired
    public EncuestaSeguimientoService(EncuestaSeguimientoRepository repository) {
        this.repository = repository;
    }

    public EncuestaSeguimiento crear(EncuestaSeguimiento encuesta) {
        return repository.save(encuesta);
    }

    public List<EncuestaSeguimiento> obtenerTodas() {
        return repository.findAll();
    }

    public EncuestaSeguimiento obtenerPorId(Long idEncuesta) {
        return repository.findById(idEncuesta).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Encuesta no encontrada")
        );
    }

    public EncuestaSeguimiento actualizar(Long idEncuesta, EncuestaSeguimiento actualizada) {
        return repository.findById(idEncuesta).map(encuesta -> {
            encuesta.setFechaEncuesta(actualizada.getFechaEncuesta());
            encuesta.setTipo(actualizada.getTipo());
            encuesta.setPreguntasJson(actualizada.getPreguntasJson());
            encuesta.setObservaciones(actualizada.getObservaciones());
            encuesta.setAlertaGenerada(actualizada.isAlertaGenerada());
            encuesta.setNino(actualizada.getNino());
            return repository.save(encuesta);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Encuesta no encontrada"));
    }

    public void eliminar(Long idEncuesta) {
        if (!repository.existsById(idEncuesta)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Encuesta no encontrada");
        }
        repository.deleteById(idEncuesta);
    }
}
