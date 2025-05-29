package com.example.backHackLocal.repository;

import com.example.backHackLocal.model.TrabajadorSocial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrabajadorSocialRepository extends JpaRepository<TrabajadorSocial, Long> {
    Optional<TrabajadorSocial> findByCorreo(String correo);
}
