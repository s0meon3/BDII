package com.snackEach.app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "categoria")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "nome", nullable = false, length = 50)
    private String nome;

    @OneToMany(mappedBy = "categoria")
    private Set<AlimentosPreferido> alimentosPreferidos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "categoria")
    private Set<ProdutoCategoria> produtoCategorias = new LinkedHashSet<>();

}