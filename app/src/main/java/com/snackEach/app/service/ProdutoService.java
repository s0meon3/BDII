package com.snackEach.app.service;

import com.snackEach.app.dto.*;
import com.snackEach.app.model.*;
import com.snackEach.app.repository.CategoriaRepository;
import com.snackEach.app.repository.ProdutoCategoriaRepository;
import com.snackEach.app.repository.ProdutoRepository;
import com.snackEach.app.repository.VendedorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {
    private final ProdutoRepository produtoRepository;
    private final VendedorRepository vendedorRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProdutoCategoriaRepository produtoCategoriaRepository;


    public ProdutoService(ProdutoRepository produtoRepository, VendedorRepository vendedorRepository, CategoriaRepository categoriaRepository, ProdutoCategoriaRepository produtoCategoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.vendedorRepository = vendedorRepository;
        this.categoriaRepository = categoriaRepository;
        this.produtoCategoriaRepository = produtoCategoriaRepository;
    }

    public List<ProdutoListagemDTO> listarProdutos() {
        return produtoRepository.findAll().stream().map(this::toListagemDTO).collect(Collectors.toList());
    }

    public ProdutoDetalheDTO buscarPorId(Integer id) {
        System.out.println("--- DEBUG: Entrando no ProdutoService.buscarPorId ---");

        Produto produto = produtoRepository.findByIdWithAllDetails(id).orElseThrow(() -> new RuntimeException("Produto não encontrado com findByIdWithAllDetails"));

        System.out.println("--- DEBUG: Produto encontrado com sucesso pelo método correto. Nome: " + produto.getNome());

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

    public ProdutoDetalheDTO criarProduto(ProdutoCreateUpdateDTO dto) {
        Produto produto = new Produto();
        produto.setNome(dto.nome);
        produto.setDescricao(dto.descricao);
        produto.setPreco(dto.preco);
        produto.setImageUrl(dto.imageUrl);

        // Buscar vendedor
        Vendedor vendedor = vendedorRepository.findById(dto.vendedorUsuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Vendedor não encontrado"));
        produto.setVendedorUsuario(vendedor);

        // Salvar produto para gerar ID
        produto = produtoRepository.save(produto);

        // Adicionar categorias
        adicionarCategorias(dto, produto);

        return buscarPorId(produto.getId());
    }


    public ProdutoDetalheDTO atualizarProduto(Integer id, ProdutoCreateUpdateDTO dto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
        produto.setNome(dto.nome);
        produto.setDescricao(dto.descricao);
        produto.setPreco(dto.preco);
        produto.setImageUrl(dto.imageUrl);

        // Atualizar vendedor se necessário
        if (dto.vendedorUsuarioId != null && !dto.vendedorUsuarioId.equals(produto.getVendedorUsuario().getId())) {
            Vendedor vendedor = vendedorRepository.findById(dto.vendedorUsuarioId)
                    .orElseThrow(() -> new IllegalArgumentException("Vendedor não encontrado"));
            produto.setVendedorUsuario(vendedor);
        }

        // Atualizar categorias
        produtoCategoriaRepository.deleteAll(produto.getProdutoCategorias());
        adicionarCategorias(dto, produto);

        produtoRepository.save(produto);
        return buscarPorId(produto.getId());
    }

    private void adicionarCategorias(ProdutoCreateUpdateDTO dto, Produto produto) {
        for (Integer categoriaId : dto.categoriaIds) {
            Categoria categoria = categoriaRepository.findById(categoriaId)
                    .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
            ProdutoCategoria pc = new ProdutoCategoria();
            pc.setProduto(produto);
            pc.setCategoria(categoria);
            pc.setId(new ProdutoCategoriaId());
            pc.getId().setProdutoId(produto.getId());
            pc.getId().setCategoriaId(categoria.getId());
            produtoCategoriaRepository.save(pc);
        }
    }

    public void removerProduto(Integer id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
        produtoRepository.delete(produto);
    }
}