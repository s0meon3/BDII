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
public class AlimentosPreferidoId implements Serializable {
    private static final long serialVersionUID = -6169447651692065044L;
    @Column(name = "comprador_usuario_id", nullable = false)
    private Integer compradorUsuarioId;

    @Column(name = "alimento", nullable = false, length = 50)
    private String alimento;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        AlimentosPreferidoId entity = (AlimentosPreferidoId) o;
        return Objects.equals(this.alimento, entity.alimento) &&
                Objects.equals(this.compradorUsuarioId, entity.compradorUsuarioId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(alimento, compradorUsuarioId);
    }

}