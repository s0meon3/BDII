package com.snackEach.app.controller;

import com.snackEach.app.dto.RegisterDTO;
import com.snackEach.app.model.*;
import com.snackEach.app.security.JwtUtil;
import com.snackEach.app.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    public AuthController(UsuarioService usuarioService, PasswordEncoder passwordEncoder, AuthService authService) {
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO request) {
        Object result = authService.register(request);

        if (result instanceof Vendedor vendedor) {
            return ResponseEntity.ok(Map.of(
                    "id", vendedor.getId(),
                    "email", vendedor.getUsuario().getEmail(),
                    "tipoUsuario", vendedor.getUsuario().getTipoUsuario().name(),
                    "nomeTenda", vendedor.getNomeTenda()
            ));
        } else if (result instanceof Admin admin) {
            return ResponseEntity.ok(Map.of(
                    "id", admin.getId(),
                    "email", admin.getUsuario().getEmail(),
                    "tipoUsuario", admin.getUsuario().getTipoUsuario().name()
            ));
        } else if (result instanceof Comprador comprador) {
            return ResponseEntity.ok(Map.of(
                    "id", comprador.getId(),
                    "email", comprador.getUsuario().getEmail(),
                    "tipoUsuario", comprador.getUsuario().getTipoUsuario().name(),
                    "dinheiroDisponivel", comprador.getDinheiroDisponivel()
            ));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        Optional<Usuario> usuarioOpt = usuarioService.findUsuarioByEmail(request.get("email"));

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            if (passwordEncoder.matches(request.get("senha"), usuario.getSenhaHash())) {
                String token = JwtUtil.generateToken(usuario.getEmail());
                return ResponseEntity.ok(Map.of("token", token));
            }
        }

        return ResponseEntity.status(401).body("Email ou senha inválidos.");
    }
}
