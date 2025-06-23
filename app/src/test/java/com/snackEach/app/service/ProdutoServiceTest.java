package com.snackEach.app.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.snackEach.app.dto.ProdutoCreateUpdateDTO;
import com.snackEach.app.model.Categoria;
import com.snackEach.app.model.UsuarioTipo;
import com.snackEach.app.repository.CategoriaRepository;
import com.snackEach.app.repository.UsuarioRepository;
import com.snackEach.app.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProdutoServiceTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private Integer vendedorId;
    private Integer categoriaId;
    private String jwtToken;

    @BeforeEach
    void setUp() throws Exception {
        usuarioRepository.deleteAll();
        // Cria categoria
        Categoria categoria = new Categoria();
        categoria.setNome("Lanches");
        categoria = categoriaRepository.save(categoria);
        categoriaId = categoria.getId();

        // Cria usuário vendedor via endpoint (simula fluxo real)
        Map<String, Object> vendedorPayload = new java.util.HashMap<>();
        vendedorPayload.put("cpf", "99988877766");
        vendedorPayload.put("nome", "Vendedor Teste");
        vendedorPayload.put("email", "vend1@email.com");
        vendedorPayload.put("senha", "senha123");
        vendedorPayload.put("curso", "Vendas");
        vendedorPayload.put("tipoUsuario", "vendedor");
        vendedorPayload.put("nomeTenda", "Tenda do Teste");
        vendedorPayload.put("horarioInicio", "08:00");
        vendedorPayload.put("horarioFim", "18:00");
        vendedorPayload.put("fazEntrega", true);
        vendedorPayload.put("ativo", true);
        vendedorPayload.put("telefone", "999999999");
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vendedorPayload)))
                .andExpect(status().isOk());

        // Login para obter token e id do vendedor
        var loginResp = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "vend1@email.com",
                                "senha", "senha123"
                        ))))
                .andExpect(status().isOk())
                .andReturn();

        var loginMap = objectMapper.readValue(loginResp.getResponse().getContentAsString(), Map.class);
        jwtToken = "Bearer " + loginMap.get("token");
        vendedorId = Integer.parseInt(loginMap.get("vendedorID").toString());
    }

    @Test
    void criarProduto_com_autenticacao() throws Exception {
        ProdutoCreateUpdateDTO dto = new ProdutoCreateUpdateDTO();
        dto.nome = "Coxinha";
        dto.descricao = "Coxinha de frango";
        dto.preco = new BigDecimal("5.00");
        dto.imageUrl = "http://img.com/coxinha.jpg";
        dto.vendedorUsuarioId = vendedorId;
        dto.categoriaIds = List.of(categoriaId);

        mockMvc.perform(post("/produtos")
                        .header("Authorization", jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Coxinha"))
                .andExpect(jsonPath("$.vendedor.nomeTenda").value("Tenda do Teste"))
                .andExpect(jsonPath("$.categorias[0].nome").value("Lanches"));
    }

    @Test
    void criarProduto_sem_token_rejeitado() throws Exception {
        ProdutoCreateUpdateDTO dto = new ProdutoCreateUpdateDTO();
        dto.nome = "Coxinha";
        dto.descricao = "Coxinha de frango";
        dto.preco = new BigDecimal("5.00");
        dto.imageUrl = "http://img.com/coxinha.jpg";
        dto.vendedorUsuarioId = vendedorId;
        dto.categoriaIds = List.of(categoriaId);

        mockMvc.perform(post("/produtos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden());
    }
}