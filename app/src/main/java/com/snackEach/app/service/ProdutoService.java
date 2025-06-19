package com.snackEach.app.service;

import com.snackEach.app.dto.*;
import com.snackEach.app.model.Produto;
import com.snackEach.app.model.ProdutoCategoria;
import com.snackEach.app.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {
    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<ProdutoListagemDTO> listarProdutos() {
        return produtoRepository.findAll().stream().map(this::toListagemDTO).collect(Collectors.toList());
    }

    public ProdutoDetalheDTO buscarPorId(Integer id) {
        Produto produto = produtoRepository.findById(id).orElseThrow();
        return toDetalheDTO(produto);
    }

    private ProdutoListagemDTO toListagemDTO(Produto produto) {
        var categorias = produto.getProdutoCategorias().stream()
                .map(ProdutoCategoria::getCategoria)
                .map(cat -> new CategoriaDTO(cat.getNome()))
                .collect(Collectors.toList());
        var vendedor = produto.getVendedorUsuario();
        var vendedorDTO = new ProdutoListagemDTO.VendedorResumoDTO(vendedor.getNomeTenda());
        double avaliacao = produto.getAvaliacaoMedia() != null ? produto.getAvaliacaoMedia() : 5.0;
        return new ProdutoListagemDTO(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getImageUrl(),
                avaliacao,
                vendedorDTO,
                categorias
        );
    }

    private ProdutoDetalheDTO toDetalheDTO(Produto produto) {
        var categorias = produto.getProdutoCategorias().stream()
                .map(ProdutoCategoria::getCategoria)
                .map(cat -> new CategoriaDTO(cat.getNome()))
                .collect(Collectors.toList());
        var vendedor = produto.getVendedorUsuario();
        var vendedorDTO = new VendedorDTO(
                vendedor.getNomeTenda(),
                vendedor.getHorarioInicio(),
                vendedor.getHorarioFim(),
                vendedor.getAtivo() != null ? vendedor.getAtivo() : false,
                vendedor.getTelefone()
        );
        double avaliacao = produto.getAvaliacaoMedia() != null ? produto.getAvaliacaoMedia() : 5.0;
        return new ProdutoDetalheDTO(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getImageUrl(),
                avaliacao,
                vendedorDTO,
                categorias
        );
    }
}