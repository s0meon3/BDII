package com.snackEach.app.controller;

import com.snackEach.app.dto.ProdutoDetalheDTO;
import com.snackEach.app.dto.ProdutoListagemDTO;
import com.snackEach.app.service.ProdutoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {
    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping("/procurar")
    public List<ProdutoListagemDTO> listarProdutos() {
        return produtoService.listarProdutos();
    }

    @GetMapping("/{id}")
    public ProdutoDetalheDTO buscarPorId(@PathVariable Integer id) {
        return produtoService.buscarPorId(id);
    }
}
