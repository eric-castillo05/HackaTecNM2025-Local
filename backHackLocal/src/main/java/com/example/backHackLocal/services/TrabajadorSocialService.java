package com.example.backHackLocal.services;

import com.example.backHackLocal.model.TrabajadorSocial;
import com.example.backHackLocal.repository.TrabajadorSocialRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class TrabajadorSocialService {

    private final TrabajadorSocialRepository repository;

    public TrabajadorSocialService(TrabajadorSocialRepository repository) {
        this.repository = repository;
    }

    public List<TrabajadorSocial> getAll() {
        return repository.findAll();
    }

    public Optional<TrabajadorSocial> getById(Long id) {
        return repository.findById(id);
    }

    public TrabajadorSocial create(TrabajadorSocial trabajadorSocial) {
        if (repository.findByCorreo(trabajadorSocial.getCorreo()).isEmpty()) {
            return repository.save(trabajadorSocial);
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un trabajador social con ese correo.");
    }

    public TrabajadorSocial update(Long id, TrabajadorSocial nuevoTrabajador) {
        return repository.findById(id).map(existente -> {
            existente.setNombre(nuevoTrabajador.getNombre());
            existente.setCorreo(nuevoTrabajador.getCorreo());
            existente.setPassword(nuevoTrabajador.getPassword());
            existente.setSexo(nuevoTrabajador.getSexo());
            return repository.save(existente);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trabajador social no encontrado con id: " + id));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Trabajador social no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }
}
