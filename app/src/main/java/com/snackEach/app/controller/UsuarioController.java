package com.snackEach.app.controller;

import com.snackEach.app.dto.UsuarioPerfilDTO;
import com.snackEach.app.dto.UsuarioUpdateDTO;
import com.snackEach.app.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioPerfilDTO> getPerfil(Authentication authentication) {
        String userEmail = authentication.getName();
        System.out.println("authentication = " + userEmail);
        UsuarioPerfilDTO perfil = usuarioService.getUsuarioProfile(userEmail);
        return ResponseEntity.ok(perfil);
    }

    @PutMapping("/atualizar")
    public ResponseEntity<UsuarioPerfilDTO> updatePerfil(@RequestBody UsuarioUpdateDTO updateDTO, Authentication authentication) {
        String userEmail = authentication.getName();
        UsuarioPerfilDTO perfilAtualizado = usuarioService.updateUsuarioProfile(userEmail, updateDTO);
        return ResponseEntity.ok(perfilAtualizado);
    }
}
