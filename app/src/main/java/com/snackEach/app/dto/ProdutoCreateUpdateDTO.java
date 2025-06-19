package com.snackEach.app.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoCreateUpdateDTO {
    public String nome;
    public String descricao;
    public BigDecimal preco;
    public String imageUrl;
    public Integer vendedorUsuarioId;
    public List<Integer> categoriaIds;
}
