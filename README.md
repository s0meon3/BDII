# Projeto SnackEach

Bem-vindo ao repositório do projeto! Este documento contém todas as instruções necessárias para configurar e executar a aplicação localmente. O projeto é composto por um backend desenvolvido em Spring Boot e um frontend universal criado com Expo (React Native).

## 📝 Descrição

Este projeto é uma aplicação completa que consiste em:
* **API (Backend):** Um serviço RESTful construído com Java e Spring Boot, responsável por toda a lógica de negócio, gestão de dados e comunicação com a base de dados.
* **Aplicação (Frontend):** Uma interface de utilizador desenvolvida com Expo, que consome os dados da API e os apresenta de forma interativa. A versão compilada para a web está disponível na pasta `front`.

---

## 📂 Estrutura de Pastas

O repositório está organizado da seguinte forma:

```
├── ☕ app/                   # Código-fonte do projeto backend Spring Boot
├── 📱 frontend-universal/     # Código-fonte do projeto frontend Expo
├── 🌐 front/                 # Build estático do frontend para a web
├── 🚀 api.jar                # Executável da API (Backend)
├── 💾 DBSnackEach - Modelo Fisico.sql # Script SQL do modelo da base de dados
└── 📄 README.md              
```
---

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de que tem o seguinte software instalado na sua máquina.

### 1. Java Development Kit (JDK)
A API Spring Boot requer o Java Development Kit (JDK), **versão 21 ou superior**.

* **Verificação:** Abra o terminal/CMD e execute:
    ```bash
    java -version
    ```
* **Instalação:** Se não tiver o Java instalado, pode fazer o download a partir do site oficial da Oracle:
    * **[Oracle JDK 21](https://www.oracle.com/br/java/technologies/downloads/#jdk21)**
    * Na página de download, escolha o seu sistema operativo (Windows, macOS ou Linux) e descarregue o instalador apropriado (ex: x64 Installer para Windows). Siga as instruções do instalador.

### 2. Node.js e npm
O frontend requer Node.js para executar o servidor que servirá os ficheiros estáticos. O `npm` (Node Package Manager) é instalado automaticamente com o Node.js.

* **Verificação:** Abra o terminal/CMD e execute:
    ```bash
    node -v
    npm -v
    ```
* **Instalação (Passo a Passo):**
    1.  Acesse ao site oficial do **[Node.js](https://nodejs.org/pt-br)**.
    2.  Faça o download da versão **LTS** (Long-Term Support), que é a mais recomendada pela sua estabilidade.
    3. Siga as instruções do assistente de instalação. Pode aceitar todas as opções padrão, pois elas são adequadas para a maioria dos utilizadores.
    4. Após a conclusão da instalação, feche e reabra o seu terminal/CMD para garantir que os novos comandos sejam reconhecidos.
    5. Execute novamente os comandos `node -v` e `npm -v` para confirmar que a instalação foi bem-sucedida.

---

## 🚀 Como Executar a Aplicação

Siga estes passos na ordem para executar a aplicação completa.

### Passo 1: Executar o Backend (API)

A API precisa de estar a rodar para que o frontend possa comunicar com ela.

1.  **Abra um terminal** ou Command Prompt.
2.  Navegue até à pasta raiz do projeto, onde o ficheiro `api.jar` está localizado.
3.  Execute o seguinte comando para iniciar o servidor Spring Boot:

    ```bash
    java -jar api.jar
    ```
4.  O terminal deverá indicar que o servidor Tomcat foi iniciado na porta **8080**. Mantenha este terminal aberto enquanto usa a aplicação.

### Passo 2: Executar o Frontend (Aplicação Web)

O frontend é uma aplicação web estática (localizada na pasta `front`) e precisa de ser "servida" por um servidor HTTP local. Usaremos um pacote simples chamado `serve` para isso.

1.  **Instalar o `serve`:** Abra um **novo terminal** (deixe o da API a rodar!) e execute o seguinte comando para instalar o `serve` globalmente na sua máquina. Só precisa de fazer isto uma vez.

    ```bash
    npm install -g serve
    ```

2.  **Navegar para a pasta do frontend:** No mesmo terminal, entre na pasta `front`.

    ```bash
    cd front
    ```

3.  **Iniciar o servidor do frontend:** Agora, execute o comando `serve`.

    ```bash
    serve
    ```

4.  O terminal mostrará as URLs onde a sua aplicação está acessível. Geralmente, será algo como:

    ```
       ┌──────────────────────────────────────────────────┐
       │                                                  │
       │   Serving!                                       │
       │                                                  │
       │   - Local:            http://localhost:3000      │
       │                                                  │
       │   Copied local address to clipboard!             │
       │                                                  │
       └──────────────────────────────────────────────────┘
    ```

---

## 🖥️ Acessar à Aplicação

Com ambos os terminais (backend e frontend) rodando, a sua aplicação está pronta!

* Abra o seu navegador de internet (Google Chrome, Edge, etc.).
* Acesse ao endereço fornecido pelo `serve`, que normalmente é: **[http://localhost:3000](http://localhost:3000)**

A interface do projeto deverá carregar e comunicar-se com a API que está rodando na porta 8080.
