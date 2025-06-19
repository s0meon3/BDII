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
public class VendedorLocalVendaId implements Serializable {
    private static final long serialVersionUID = 2122033079067528944L;
    @Column(name = "vendedor_usuario_id", nullable = false)
    private Integer vendedorUsuarioId;

    @Column(name = "local_venda_id", nullable = false)
    private Integer localVendaId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        VendedorLocalVendaId entity = (VendedorLocalVendaId) o;
        return Objects.equals(this.localVendaId, entity.localVendaId) &&
                Objects.equals(this.vendedorUsuarioId, entity.vendedorUsuarioId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(localVendaId, vendedorUsuarioId);
    }

}