package com.snackEach.app.service;

import com.snackEach.app.dto.RegisterRequestDTO;
import com.snackEach.app.model.Usuario;
import com.snackEach.app.model.UsuarioTipo;
import com.snackEach.app.repository.UsuarioRepository;
import org.apache.coyote.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.time.LocalTime;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UsuarioServiceTest {

    @Mock UsuarioRepository usuarioRepository;
    @Mock PasswordEncoder passwordEncoder;

    @InjectMocks UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registerUsuario_comprador_sucesso() throws BadRequestException {
        RegisterRequestDTO req = new RegisterRequestDTO("nome", "123", "curso", "email", "senha", UsuarioTipo.COMPRADOR, null, null, null, null, null, null);
        when(passwordEncoder.encode("senha")).thenReturn("senhaHash");
        when(usuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        var result = usuarioService.registerUsuario(req);
        assertNotNull(result);
    }

    @Test
    void registerUsuario_vendedor_sucesso() throws BadRequestException {
        RegisterRequestDTO req = new RegisterRequestDTO(
                "nome", "123", "curso", "email", "senha", UsuarioTipo.VENDEDOR,
                "Tenda", LocalTime.parse("08:00"), LocalTime.parse("18:00"), true, true, "999999999"
        );
        when(passwordEncoder.encode("senha")).thenReturn("senhaHash");
        when(usuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        var result = usuarioService.registerUsuario(req);
        assertNotNull(result);
    }

    @Test
    void findUsuarioByEmail_existente() {
        Usuario usuario = new Usuario();
        usuario.setEmail("teste@email.com");
        when(usuarioRepository.findByEmail("teste@email.com")).thenReturn(Optional.of(usuario));

        var opt = usuarioService.findUsuarioByEmail("teste@email.com");
        assertTrue(opt.isPresent());
    }

    @Test
    void findUsuarioByEmail_inexistente() {
        when(usuarioRepository.findByEmail("naoexiste@email.com")).thenReturn(Optional.empty());
        var opt = usuarioService.findUsuarioByEmail("naoexiste@email.com");
        assertFalse(opt.isPresent());
    }
}