package com.example.backHackLocal.services;

import com.example.backHackLocal.model.PadreAdoptivo;
import com.example.backHackLocal.repository.PadreAdoptivoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class PadreAdoptivoService {

    private final PadreAdoptivoRepository repository;

    public PadreAdoptivoService(PadreAdoptivoRepository repository) {
        this.repository = repository;
    }

    public List<PadreAdoptivo> getAll() {
        return repository.findAll();
    }

    public Optional<PadreAdoptivo> getById(Long id) {
        return repository.findById(id);
    }

    public PadreAdoptivo create(PadreAdoptivo padre) {
        if(repository.findPadreAdoptivoByCorreo(padre.getCorreo()).isEmpty()) {
            return repository.save(padre);
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT);
    }

    public PadreAdoptivo update(Long id, PadreAdoptivo padreNuevo) {
        return repository.findById(id).map(padreExistente -> {
            padreExistente.setNombre(padreNuevo.getNombre());
            padreExistente.setCorreo(padreNuevo.getCorreo());
            padreExistente.setSexo(padreNuevo.getSexo());
            padreExistente.setPassword(padreNuevo.getPassword());
            return repository.save(padreExistente);
        }).orElseThrow(() -> new RuntimeException("Padre no encontrado con id: " + id));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
