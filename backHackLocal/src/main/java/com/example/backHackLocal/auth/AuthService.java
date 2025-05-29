package com.example.backHackLocal.auth;

import com.example.backHackLocal.dto.LoginRequest;
import com.example.backHackLocal.dto.LoginResponse;
import com.example.backHackLocal.model.PadreAdoptivo;
import com.example.backHackLocal.repository.PadreAdoptivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class AuthService {

    private final PadreAdoptivoRepository padreRepo;

    @Autowired
    public AuthService(PadreAdoptivoRepository padreRepo) {
        this.padreRepo = padreRepo;
    }

    public LoginResponse login(LoginRequest request) {
        var padre = padreRepo.findPadreAdoptivoByCorreo(request.getCorreo())
                .orElse(null);

        if (padre != null) {
            if (padre.getPassword().equals(request.getPassword())) {
                return new LoginResponse(padre.getIdPadreCandidato(), "PADRE", "/padre/dashboard");
            } else {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Contraseña incorrecta");
            }
        }

        // Futuro: TrabajadorSocial
    /*
    var trabajador = trabajadorRepo.findByCorreo(request.getCorreo()).orElse(null);
    if (trabajador != null) {
        if (trabajador.getPassword().equals(request.getPassword())) {
            return new LoginResponse(trabajador.getId(), "TRABAJADOR", "/trabajador/dashboard");
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Contraseña incorrecta");
        }
    }
    */

        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
    }
}