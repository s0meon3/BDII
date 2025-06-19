package com.snackEach.app.dto;

import java.time.LocalTime;

public record VendedorDTO(
        String nomeTenda,
        LocalTime horarioInicio,
        LocalTime horarioFim,
        boolean ativo,
        String telefone
) {}
