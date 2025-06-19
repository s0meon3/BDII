package com.snackEach.app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "alimentos_preferidos")
public class AlimentosPreferido {
    @EmbeddedId
    private AlimentosPreferidoId id;

    @MapsId("compradorUsuarioId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "comprador_usuario_id", nullable = false)
    private Comprador compradorUsuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

}