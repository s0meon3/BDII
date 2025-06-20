package com.snackEach.app.controller;

import com.snackEach.app.dto.RegisterRequestDTO;
import com.snackEach.app.dto.RegisterResponseDTO;
import com.snackEach.app.model.*;
import com.snackEach.app.security.JwtUtil;
import com.snackEach.app.service.*;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
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
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO request) throws BadRequestException {
        Object result = authService.register(request);

        if (result instanceof Vendedor vendedor) {
            return ResponseEntity.ok(new RegisterResponseDTO(
                    vendedor.getId(),
                    vendedor.getUsuario().getEmail(),
                    vendedor.getUsuario().getTipoUsuario().name(),
                    vendedor.getNomeTenda(),
                    vendedor.getHorarioInicio().toString(), // outros campos conforme necessário
                    vendedor.getHorarioFim().toString(),
                    vendedor.getFazEntrega(),
                    true,
                    new BigDecimal("0.0")
            ));
        } else if (result instanceof Admin admin) {
            return ResponseEntity.ok(new RegisterResponseDTO(
                    admin.getId(),
                    admin.getUsuario().getEmail(),
                    admin.getUsuario().getTipoUsuario().name(),
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
            ));
        } else if (result instanceof Comprador comprador) {
            return ResponseEntity.ok(new RegisterResponseDTO(
                    comprador.getId(),
                    comprador.getUsuario().getEmail(),
                    comprador.getUsuario().getTipoUsuario().name(),
                    null,
                    null,
                    null,
                    null,
                    null,
                    comprador.getDinheiroDisponivel()
            ));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) throws BadRequestException {
        Optional<Usuario> usuarioOpt = usuarioService.findUsuarioByEmail(request.get("email"));

        if (request.get("email") == null || request.get("senha") == null) {
            throw new BadRequestException("Email e senha são obrigatórios");
        }

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            if (passwordEncoder.matches(request.get("senha"), usuario.getSenhaHash())) {
                String token = JwtUtil.generateToken(usuario.getEmail());
                String userID = usuario.getId().toString();
                String vendedorID = usuario.getVendedor().getId().toString();
                // Crie um mapa para a resposta
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                response.put("userId", userID);
                response.put("vendedorID", vendedorID);

                // Retorne o ResponseEntity com o mapa
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(401).body("Email ou senha inválidos.");
    }
}
