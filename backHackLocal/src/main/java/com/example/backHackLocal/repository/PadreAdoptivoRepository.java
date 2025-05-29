package com.example.backHackLocal.repository;

import com.example.backHackLocal.model.PadreAdoptivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PadreAdoptivoRepository extends JpaRepository<PadreAdoptivo, Long> {
    Optional<PadreAdoptivo> findPadreAdoptivoByIdPadreCandidato(long idPadreCandidato);
    public Optional<PadreAdoptivo> findPadreAdoptivoByCorreo(String correo);

}
