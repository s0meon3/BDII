package com.snackEach.app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "local_venda")
public class LocalVenda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "nome", nullable = false, length = 50)
    private String nome;

    @Column(name = "latitude", nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;

    @ManyToMany
    @JoinTable(name = "vendedor_local_venda",
            joinColumns = @JoinColumn(name = "local_venda_id"),
            inverseJoinColumns = @JoinColumn(name = "vendedor_usuario_id"))
    private Set<Vendedor> vendedors = new LinkedHashSet<>();

}