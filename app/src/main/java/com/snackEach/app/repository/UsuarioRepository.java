package com.snackEach.app.repository;

import com.snackEach.app.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    Optional<Usuario> findUsuarioByNome(String nome);

    Optional<Usuario> findByEmail(String email);

    List<Usuario> getUsuariosByEmail(String email);
}
