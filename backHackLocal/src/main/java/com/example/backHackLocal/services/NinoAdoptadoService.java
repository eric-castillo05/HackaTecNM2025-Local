package com.example.backHackLocal.services;


import com.example.backHackLocal.model.NinoAdoptado;
import com.example.backHackLocal.repository.NinoAdoptadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NinoAdoptadoService {

    @Autowired
    private NinoAdoptadoRepository repository;

    public NinoAdoptado crear(NinoAdoptado nino) {
        return repository.save(nino);
    }

    public List<NinoAdoptado> listarTodos() {
        return repository.findAll();
    }

    public Optional<NinoAdoptado> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public NinoAdoptado actualizar(Long id, NinoAdoptado actualizado) {
        return repository.findById(id).map(ninoExistente -> {
            ninoExistente.setNombre(actualizado.getNombre());
            ninoExistente.setEdad(actualizado.getEdad());
            ninoExistente.setGenero(actualizado.getGenero());
            ninoExistente.setFechaAdopcion(actualizado.getFechaAdopcion());
            ninoExistente.setEstado(actualizado.getEstado());
            ninoExistente.setPadre(actualizado.getPadre());
            return repository.save(ninoExistente);
        }).orElseThrow(() -> new RuntimeException("Niño adoptado con ID " + id + " no encontrado"));
    }


    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
