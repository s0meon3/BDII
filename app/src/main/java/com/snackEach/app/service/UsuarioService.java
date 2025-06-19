package com.snackEach.app.service;

import com.snackEach.app.dto.RegisterRequestDTO;
import com.snackEach.app.dto.UsuarioPerfilDTO;
import com.snackEach.app.dto.UsuarioUpdateDTO;
import com.snackEach.app.model.*;
import com.snackEach.app.repository.UsuarioRepository;
import org.apache.coyote.BadRequestException;
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

    public Object registerUsuario(RegisterRequestDTO request) throws BadRequestException {
        String senhaCriptografada = passwordEncoder.encode(request.senha());

        if (request.email() == null || request.senha() == null) {
            throw new BadRequestException("Email e senha são obrigatórios");
        }

        Usuario novoUsuario = new Usuario(request.nome(), request.cpf(), request.curso(), request.email(), senhaCriptografada, request.tipoUsuario());
        switch (request.tipoUsuario()) {
            case COMPRADOR:
                Comprador novoComprador = new Comprador();
                novoComprador.setUsuario(novoUsuario);
                novoUsuario.setComprador(novoComprador);
                usuarioRepository.save(novoUsuario);
                return novoComprador;
            case VENDEDOR:
                Vendedor novoVendedor = new Vendedor(request.nomeTenda(), request.horarioInicio(), request.horarioFim(), request.fazEntrega(), request.ativo(), request.telefone());
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

    public UsuarioPerfilDTO getUsuarioProfile(String emailDoUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailDoUsuario).orElseThrow();
        return new UsuarioPerfilDTO(usuario.getNome(), usuario.getCpf(), usuario.getCurso(), usuario.getEmail());
    }

    public UsuarioPerfilDTO updateUsuarioProfile(String emailDoUsuario, UsuarioUpdateDTO updateDTO) {
            Usuario usuario = usuarioRepository.findByEmail(emailDoUsuario).orElseThrow();

            usuario.setNome(updateDTO.getNome());
            usuario.setCurso(updateDTO.getCurso());
            if (updateDTO.getSenha() != null && !updateDTO.getSenha().isEmpty()) {
                usuario.setSenhaHash(passwordEncoder.encode(updateDTO.getSenha()));
            }
            usuarioRepository.save(usuario);
            return new UsuarioPerfilDTO(usuario.getNome(), usuario.getCpf(), usuario.getCurso(), usuario.getEmail());
    }

    public Optional<Usuario> findUsuarioByEmail(String email){
        return usuarioRepository.findByEmail(email);
    }
    


}
