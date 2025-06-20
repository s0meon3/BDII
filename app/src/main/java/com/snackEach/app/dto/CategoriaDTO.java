package com.snackEach.app.dto;


public record CategoriaDTO(int id, String nome) {
    public CategoriaDTO(String nome) {
        this(-1, nome);
    }

}
