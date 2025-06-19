package com.snackEach.app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "vendedor")
@Setter
@Getter
@NoArgsConstructor
public class Vendedor {
    @Id
    @Column(name = "usuario_id", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "nome_tenda", nullable = false, length = 50)
    private String nomeTenda;

    @Column(name = "horario_inicio")
    private LocalTime horarioInicio;

    @Column(name = "horario_fim")
    private LocalTime horarioFim;

    @ColumnDefault("false")
    @Column(name = "faz_entrega", nullable = false)
    private Boolean fazEntrega = false;

    @ColumnDefault("true")
    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    @Column(name = "telefone", length = 20)
    private String telefone;

    @OneToMany(mappedBy = "vendedorUsuario")
    private Set<FormaPagamento> formaPagamentos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "vendedorUsuario")
    private Set<Produto> produtos = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(name = "vendedor_local_venda",
            joinColumns = @JoinColumn(name = "vendedor_usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "local_venda_id"))
    private Set<LocalVenda> localVendas = new LinkedHashSet<>();

    public Vendedor(String nomeTenda, LocalTime horarioInicio, LocalTime horarioFim, Boolean fazEntrega, Boolean ativo, String telefone){
        this.nomeTenda = nomeTenda;
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
        this.fazEntrega = fazEntrega;
        this.ativo = ativo;
        this.telefone = telefone;
    }

}