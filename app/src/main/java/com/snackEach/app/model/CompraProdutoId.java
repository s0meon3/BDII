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
public class CompraProdutoId implements Serializable {
    private static final long serialVersionUID = 5574985269115069010L;
    @Column(name = "compra_id", nullable = false)
    private Integer compraId;

    @Column(name = "produto_id", nullable = false)
    private Integer produtoId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        CompraProdutoId entity = (CompraProdutoId) o;
        return Objects.equals(this.produtoId, entity.produtoId) &&
                Objects.equals(this.compraId, entity.compraId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(produtoId, compraId);
    }

}