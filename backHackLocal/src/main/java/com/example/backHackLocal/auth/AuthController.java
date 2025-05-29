package com.example.backHackLocal.auth;


import com.example.backHackLocal.dto.LoginRequest;
import com.example.backHackLocal.dto.LoginResponse;
import com.example.backHackLocal.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
