package com.snackEach.app.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.snackEach.app.model.UsuarioTipo;

import java.time.LocalTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record RegisterRequestDTO(
        String cpf,
        String nome,
        String email,
        String senha,
        String curso,
        UsuarioTipo tipoUsuario,
        // Campos específicos de vendedor
        String nomeTenda,
        LocalTime horarioInicio,
        LocalTime horarioFim,
        Boolean fazEntrega,
        Boolean ativo,
        String telefone
) {}
