package com.example.backHackLocal.services;

import com.example.backHackLocal.model.EvaluacionCandidato;
import com.example.backHackLocal.repository.EvaluacionCandidatoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.View;

import java.util.List;
import java.util.Optional;

@Service
public class EvaluacionCandidatoService {

    private final EvaluacionCandidatoRepository repository;

    public EvaluacionCandidatoService(EvaluacionCandidatoRepository repository, View error) {
        this.repository = repository;
    }

    public EvaluacionCandidato crear(EvaluacionCandidato candidato) {
        if(repository.findById(candidato.getIdPadreCandidato()).isPresent()){
            return repository.save(candidato);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    public List<EvaluacionCandidato> obtenerTodos() {
        return repository.findAll();
    }

    public Optional<EvaluacionCandidato> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    public Optional<EvaluacionCandidato> actualizar(Long id, EvaluacionCandidato nuevo) {
        return repository.findById(id).map(actual -> {
            actual.setGenero(nuevo.getGenero());
            actual.setEdad(nuevo.getEdad());
            actual.setAntecedentesText(nuevo.getAntecedentesText());
            actual.setEstadoCivil(nuevo.getEstadoCivil());
            actual.setYaHaAdoptado(nuevo.isYaHaAdoptado());
            actual.setHijosBiologicos(nuevo.getHijosBiologicos());
            actual.setUltimoGradoEstudios(nuevo.getUltimoGradoEstudios());
            actual.setIngresoMensual(nuevo.getIngresoMensual());
            actual.setAniosTrabajoActual(nuevo.getAniosTrabajoActual());
            actual.setTipoCasa(nuevo.getTipoCasa());
            actual.setCiudad(nuevo.getCiudad());
            actual.setEstado(nuevo.getEstado());
            actual.setPsychometricScore(nuevo.getPsychometricScore());
            actual.setHistorialPsiquiatrico(nuevo.isHistorialPsiquiatrico());
            actual.setViolenciaDomesticaText(nuevo.getViolenciaDomesticaText());
            actual.setSuitabilityLabel(nuevo.getSuitabilityLabel());

            // Heredados
            actual.setNombre(nuevo.getNombre());
            actual.setCorreo(nuevo.getCorreo());
            actual.setSexo(nuevo.getSexo());
            actual.setPassword(nuevo.getPassword());

            return repository.save(actual);
        });
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
