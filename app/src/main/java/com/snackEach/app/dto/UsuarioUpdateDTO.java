package com.snackEach.app.dto;

import lombok.Data;

@Data
public class UsuarioUpdateDTO {
    private String nome;
    private String curso;
    private String email;
    private String senha;
}
