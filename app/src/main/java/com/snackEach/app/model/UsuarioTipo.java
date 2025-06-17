package com.snackEach.app.model;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UsuarioTipo {
    ADMIN("admin"),
    COMPRADOR("comprador"),
    VENDEDOR("vendedor");

    private final String tipo;

    UsuarioTipo(String tipo) {
        this.tipo = tipo;
    }

    @JsonValue
    public String getTipo() {
        return tipo;
    }

    @JsonCreator
    public static UsuarioTipo fromValor(String valor) {
        for (UsuarioTipo tipo : values()) {
            if (tipo.tipo.equalsIgnoreCase(valor) || tipo.name().equalsIgnoreCase(valor)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de usuário inválido: " + valor);
    }
}
