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
public class ProdutoCategoriaId implements Serializable {
    private static final long serialVersionUID = -3131304710700952358L;
    @Column(name = "produto_id", nullable = false)
    private Integer produtoId;

    @Column(name = "categoria_id", nullable = false)
    private Integer categoriaId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ProdutoCategoriaId entity = (ProdutoCategoriaId) o;
        return Objects.equals(this.produtoId, entity.produtoId) &&
                Objects.equals(this.categoriaId, entity.categoriaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(produtoId, categoriaId);
    }

}