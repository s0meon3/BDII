package com.snackEach.app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class FormaPagamentoId implements Serializable {
    private static final long serialVersionUID = -2036994562433604719L;
    @Column(name = "vendedor_usuario_id", nullable = false)
    private Integer vendedorUsuarioId;

    @Column(name = "forma_pagamento", nullable = false, length = 30)
    private String formaPagamento;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        FormaPagamentoId entity = (FormaPagamentoId) o;
        return Objects.equals(this.formaPagamento, entity.formaPagamento) &&
                Objects.equals(this.vendedorUsuarioId, entity.vendedorUsuarioId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(formaPagamento, vendedorUsuarioId);
    }

}