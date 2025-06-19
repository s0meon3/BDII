package com.snackEach.app.repository;

import com.snackEach.app.model.Produto;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
    @Query("SELECT p FROM Produto p WHERE p.id = :id")
    @EntityGraph(attributePaths = {
            "vendedorUsuario",          // Para carregar os dados do vendedor
            "produtoCategorias",        // Para a tabela de junção produto-categoria
            "produtoCategorias.categoria", // Para carregar os dados da categoria em si
            "compraProdutos",           // Para carregar a lista de CompraProduto
            "compraProdutos.compra"     // ESSENCIAL: Para carregar a Compra de cada CompraProduto (onde está a nota!)
    })
    Optional<Produto> findByIdWithAllDetails(@Param("id") Integer id);

    @Override
    @EntityGraph(attributePaths = {
            "vendedorUsuario",
            "produtoCategorias",
            "produtoCategorias.categoria",
            "compraProdutos",
            "compraProdutos.compra"
    })
    List<Produto> findAll();
}
