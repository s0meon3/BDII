package com.snackEach.app.model;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public BigDecimal getDinheiroDisponivel() {
        return dinheiroDisponivel;
    }

    public void setDinheiroDisponivel(BigDecimal dinheiroDisponivel) {
        this.dinheiroDisponivel = dinheiroDisponivel;
    }

}