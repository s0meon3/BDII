package com.snackEach.app.controller;

import com.snackEach.app.dto.ProdutoCreateUpdateDTO;
import com.snackEach.app.dto.ProdutoDetalheDTO;
import com.snackEach.app.dto.ProdutoListagemDTO;
import com.snackEach.app.service.ProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {
    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @PostMapping
    public ResponseEntity<ProdutoDetalheDTO> criarProduto(@RequestBody ProdutoCreateUpdateDTO dto) {
        ProdutoDetalheDTO criado = produtoService.criarProduto(dto);
        return ResponseEntity
                .created(URI.create("/produtos/" + criado.id()))
                .body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoDetalheDTO> atualizarProduto(@PathVariable Integer id, @RequestBody ProdutoCreateUpdateDTO dto) {
        ProdutoDetalheDTO atualizado = produtoService.atualizarProduto(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removerProduto(@PathVariable Integer id) {
        produtoService.removerProduto(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/procurar")
    public ResponseEntity<List<ProdutoListagemDTO>> listarProdutos() {
        List<ProdutoListagemDTO> produtos = produtoService.listarProdutos();
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDetalheDTO> buscarPorId(@PathVariable Integer id) {
        ProdutoDetalheDTO produto = produtoService.buscarPorId(id);
        return ResponseEntity.ok(produto);
    }
}
