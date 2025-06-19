package com.snackEach.app.repository;

import com.snackEach.app.model.ProdutoCategoria;
import com.snackEach.app.model.ProdutoCategoriaId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoCategoriaRepository extends JpaRepository<ProdutoCategoria, ProdutoCategoriaId> {}
