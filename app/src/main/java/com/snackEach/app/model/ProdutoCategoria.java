package com.snackEach.app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "produto_categoria", indexes = {
        @Index(name = "idx_pc_produto_id", columnList = "produto_id"),
        @Index(name = "idx_pc_categoria_id", columnList = "categoria_id")
})
public class ProdutoCategoria {
    @EmbeddedId
    private ProdutoCategoriaId id;

    @MapsId("produtoId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @MapsId("categoriaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

}