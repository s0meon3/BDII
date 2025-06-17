package com.snackEach.app.service;

import com.snackEach.app.dto.RegisterRequestDTO;
import com.snackEach.app.model.*;
import com.snackEach.app.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Object registerUsuario(RegisterRequestDTO request){
        String senhaCriptografada = passwordEncoder.encode(request.senha());

        Usuario novoUsuario = new Usuario(request.nome(), request.cpf(), request.curso(), request.email(), senhaCriptografada, request.tipoUsuario());
        switch (request.tipoUsuario()) {
            case COMPRADOR:
                Comprador novoComprador = new Comprador();
                novoComprador.setUsuario(novoUsuario);
                novoUsuario.setComprador(novoComprador);
                usuarioRepository.save(novoUsuario);
                return novoComprador;
            case VENDEDOR:
                Vendedor novoVendedor = new Vendedor(request.nomeTenda(), request.horarioInicio(), request.horarioFim(), request.fazEntrega(), request.ativo());
                novoVendedor.setId(novoUsuario.getId());
                novoVendedor.setUsuario(novoUsuario);
                novoUsuario.setVendedor(novoVendedor);
                usuarioRepository.save(novoUsuario);
                return novoVendedor;
            case ADMIN:
                Admin novoAdmin = new Admin();
                novoAdmin.setUsuario(novoUsuario);
                novoUsuario.setAdmin(novoAdmin);
                usuarioRepository.save(novoUsuario);
                return novoAdmin;
            default:
                throw new IllegalArgumentException("Tipo de usuário inválido");
        }
    }

    public Optional<Usuario> findUsuarioByEmail(String email){
        return usuarioRepository.findByEmail(email);
    }
    


}
