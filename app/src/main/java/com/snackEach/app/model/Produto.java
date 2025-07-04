package com.snackEach.app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.OptionalDouble;
import java.util.Set;

@Getter
@Setter
@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Table(name = "produto")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "vendedor_usuario_id", nullable = false)
    private Vendedor vendedorUsuario;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "descricao", length = Integer.MAX_VALUE)
    private String descricao;

    @Column(name = "preco", nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(name = "image_url", length = Integer.MAX_VALUE)
    private String imageUrl;

    @OneToMany(mappedBy = "produto")
    private Set<CompraProduto> compraProdutos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "produto")
    private Set<ProdutoCategoria> produtoCategorias = new LinkedHashSet<>();

    @Transient
    public Double getAvaliacaoMedia() {
        Set<Compra> compras = new LinkedHashSet<>();
        for (CompraProduto cp : this.compraProdutos) {
            compras.add(cp.getCompra());
        }

        OptionalDouble average = compras.stream()
                .filter(compra -> compra.getNotaAvaliacao() != null)
                .mapToInt(Compra::getNotaAvaliacao)
                .average();

        return average.isPresent() ? average.getAsDouble() : null;
    }
}