package com.snackEach.app.model;


public enum UsuarioTipo {
    ADMIN("admin"),
    COMPRADOR("comprador"),
    VENDEDOR("vendedor");

    private final String tipo;

    UsuarioTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getTipo() {
        return tipo;
    }

    public static UsuarioTipo fromValor(String valor) {
        for (UsuarioTipo tipo : values()) {
            if (tipo.tipo.equalsIgnoreCase(valor)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de usuário inválido: " + valor);
    }
}
