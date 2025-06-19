package com.snackEach.app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "comprador")
public class Comprador {
    @Id
    @Column(name = "usuario_id", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ColumnDefault("0.00")
    @Column(name = "dinheiro_disponivel", nullable = false, precision = 10, scale = 2)
    private BigDecimal dinheiroDisponivel;

    @OneToMany(mappedBy = "compradorUsuario")
    private Set<AlimentosPreferido> alimentosPreferidos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "compradorUsuario")
    private Set<Compra> compras = new LinkedHashSet<>();

    public Comprador (){
        this.dinheiroDisponivel = BigDecimal.ZERO;
    }
}