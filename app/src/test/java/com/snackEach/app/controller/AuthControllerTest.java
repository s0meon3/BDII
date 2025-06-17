package com.snackEach.app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testRegister() throws Exception {
        Map<String, String> user = Map.of(
                "cpf", "12345678901",
                "nome", "Teste",
                "email", "teste@email.com",
                "senha", "senha123",
                "curso", "Engenharia",
                "tipoUsuario", "comprador"
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("teste@email.com"));
    }

    @Test
    void testLogin() throws Exception {
        // Primeiro, registre o usuário
        Map<String, String> user = Map.of(
                "cpf", "12345678901",
                "nome", "Teste",
                "email", "login@email.com",
                "senha", "senha123",
                "curso", "Engenharia",
                "tipoUsuario", "comprador"
        );
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk());

        // Agora, faça login
        Map<String, String> login = Map.of(
                "email", "login@email.com",
                "senha", "senha123"
        );
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void testRegisterAdmin() throws Exception {
        Map<String, String> user = Map.of(
                "cpf", "11122233344",
                "nome", "Admin Teste",
                "email", "admin@email.com",
                "senha", "senha123",
                "curso", "Administração",
                "tipoUsuario", "admin"
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("admin@email.com"))
                .andExpect(jsonPath("$.tipoUsuario").value("ADMIN"));
    }

    @Test
    void testRegisterVendedor() throws Exception {
        Map<String, String> user = Map.ofEntries(
                Map.entry("cpf", "22233344455"),
                Map.entry("nome", "Vendedor Teste"),
                Map.entry("email", "vendedor@email.com"),
                Map.entry("senha", "senha123"),
                Map.entry("curso", "Vendas"),
                Map.entry("tipoUsuario", "vendedor"),
                Map.entry("nomeTenda", "Tenda do Teste"),
                Map.entry("horarioInicio", "08:00"),
                Map.entry("horarioFim", "18:00"),
                Map.entry("fazEntrega", "true"),
                Map.entry("ativo", "true")
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("vendedor@email.com"))
                .andExpect(jsonPath("$.tipoUsuario").value("VENDEDOR"));
    }
}