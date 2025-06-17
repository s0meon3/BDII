
package com.snackEach.app.service;

import com.snackEach.app.dto.RegisterRequestDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class AuthService {

    private final UsuarioService usuarioService;

    public AuthService(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Transactional
    public Object register(RegisterRequestDTO request) {
        return usuarioService.registerUsuario(request);
    }
}