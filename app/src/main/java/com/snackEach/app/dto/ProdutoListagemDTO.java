package com.snackEach.app.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProdutoListagemDTO(
        Integer id,
        String nome,
        String descricao,
        BigDecimal preco,
        String imageUrl,
        double avaliacaoMedia,
        VendedorResumoDTO vendedor,
        List<CategoriaDTO> categorias
) {
    public record VendedorResumoDTO(String nomeTenda) {}
}