package com.snackEach.app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "compra")
public class Compra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "comprador_usuario_id", nullable = false)
    private Comprador compradorUsuario;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "data_compra", nullable = false)
    private Instant dataCompra;

    @Column(name = "preco_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoTotal;

    @Column(name = "nota_avaliacao")
    private Integer notaAvaliacao;

    @Column(name = "comentario_avaliacao", length = Integer.MAX_VALUE)
    private String comentarioAvaliacao;

    @OneToMany(mappedBy = "compra")
    private Set<CompraProduto> compraProdutos = new LinkedHashSet<>();

}