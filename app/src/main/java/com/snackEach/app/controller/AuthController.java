package com.snackEach.app.controller;

import com.snackEach.app.model.Usuario;
import com.snackEach.app.model.UsuarioTipo;
import com.snackEach.app.security.JwtUtil;
import com.snackEach.app.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        Usuario usuario = usuarioService.registerUsuario(request.get("cpf"), request.get("nome"), request.get("email"),
                request.get("senha"), request.get("curso"), UsuarioTipo.fromValor(request.get("tipoUsuario")));
        return ResponseEntity.ok(usuario);
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
