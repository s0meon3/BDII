package com.snackEach.app.service;

import com.snackEach.app.model.Usuario;
import com.snackEach.app.model.UsuarioTipo;
import com.snackEach.app.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario registerUsuario(String cpf, String nome, String email, String senha, String curso, UsuarioTipo tipoUsuario){
        String senhaCriptografada = passwordEncoder.encode(senha);
        Usuario novoUsuario = new Usuario(nome, cpf, curso, email, senhaCriptografada, tipoUsuario);
        return usuarioRepository.save(novoUsuario);
    }

    public Optional<Usuario> findUsuarioByEmail(String email){
        return usuarioRepository.findByEmail(email);
    }
    


}
