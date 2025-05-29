package com.example.backHackLocal.repository;

import com.example.backHackLocal.model.EncuestaSeguimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EncuestaSeguimientoRepository extends JpaRepository<EncuestaSeguimiento, Long> {

}
