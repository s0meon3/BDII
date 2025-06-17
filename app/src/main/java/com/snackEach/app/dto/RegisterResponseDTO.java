package com.snackEach.app.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record RegisterResponseDTO(
        Integer id,
        String email,
        String tipoUsuario,
        // Campos de vendedor
        String nomeTenda,
        String horarioInicio,
        String horarioFim,
        Boolean fazEntrega,
        Boolean ativo,
        // Campos de comprador
        BigDecimal dinheiroDisponivel
) {}