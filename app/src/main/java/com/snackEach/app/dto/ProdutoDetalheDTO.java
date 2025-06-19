package com.snackEach.app.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProdutoDetalheDTO(
        Integer id,
        String nome,
        String descricao,
        BigDecimal preco,
        String imageUrl,
        double avaliacaoMedia,
        VendedorDTO vendedor,
        List<CategoriaDTO> categorias
) {}
