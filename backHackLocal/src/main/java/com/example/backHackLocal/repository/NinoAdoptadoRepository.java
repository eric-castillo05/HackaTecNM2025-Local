package com.example.backHackLocal.repository;

import com.example.backHackLocal.model.NinoAdoptado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NinoAdoptadoRepository extends JpaRepository<NinoAdoptado, Long> {

}
