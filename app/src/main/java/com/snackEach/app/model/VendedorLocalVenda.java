package com.snackEach.app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "vendedor_local_venda", indexes = {
        @Index(name = "idx_vlv_vendedor_id", columnList = "vendedor_usuario_id"),
        @Index(name = "idx_vlv_local_id", columnList = "local_venda_id")
})
public class VendedorLocalVenda {
    @EmbeddedId
    private VendedorLocalVendaId id;

    @MapsId("vendedorUsuarioId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "vendedor_usuario_id", nullable = false)
    private Vendedor vendedorUsuario;

    @MapsId("localVendaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "local_venda_id", nullable = false)
    private LocalVenda localVenda;

}