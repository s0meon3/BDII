package com.snackEach.app.controller;

import com.snackEach.app.dto.CategoriaDTO;
import com.snackEach.app.model.Categoria;
import com.snackEach.app.repository.CategoriaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    public CategoriaController(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @PostMapping
    public ResponseEntity<CategoriaDTO> criarCategoria(@RequestBody CategoriaDTO categoriaDTO) {
        Categoria categoria = new Categoria();
        categoria.setNome(categoriaDTO.nome());
        Categoria criada = categoriaRepository.save(categoria);
        CategoriaDTO resposta = new CategoriaDTO(criada.getNome());
        return ResponseEntity
                .created(URI.create("/categorias/" + criada.getId()))
                .body(resposta);
    }

    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> listarCategorias() {
        List<CategoriaDTO> categorias = categoriaRepository.findAll()
                .stream()
                .map(cat -> new CategoriaDTO(cat.getId(), cat.getNome()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(categorias);
    }
}