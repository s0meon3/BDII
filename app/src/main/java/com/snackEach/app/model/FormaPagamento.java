package com.snackEach.app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "forma_pagamento", indexes = {
        @Index(name = "idx_fp_vendedor_id", columnList = "vendedor_usuario_id")
})
public class FormaPagamento {
    @EmbeddedId
    private FormaPagamentoId id;

    @MapsId("vendedorUsuarioId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "vendedor_usuario_id", nullable = false)
    private Vendedor vendedorUsuario;

}