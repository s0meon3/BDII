-- DBSnackEach - Modelo Fisico
-- #####################################################################
-- # TABELAS DE USUÁRIOS E ESPECIALIZAÇÃO
-- #####################################################################

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL, -- Armazena o HASH da senha
    curso VARCHAR(100),
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('VENDEDOR', 'COMPRADOR', 'ADMIN'))
);

-- Tabela de Vendedores, com uma relação 1-para-1 com usuário.
CREATE TABLE vendedor (
    usuario_id INT PRIMARY KEY,
    nome_tenda VARCHAR(50) NOT NULL,
    horario_inicio TIME,
    horario_fim TIME,
    faz_entrega BOOLEAN NOT NULL DEFAULT FALSE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    telefone VARCHAR(20) NOT NULL,
    CONSTRAINT fk_vendedor_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE comprador (
    usuario_id INT PRIMARY KEY,
    dinheiro_disponivel DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- Tipo DECIMAL é preciso para valores monetários.
    CONSTRAINT fk_comprador_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE admin (
    usuario_id INT PRIMARY KEY,
    CONSTRAINT fk_admin_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- #####################################################################
-- # TABELAS DE PRODUTOS E CATEGORIAS
-- #####################################################################

CREATE TABLE categoria (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE produto (
    id SERIAL PRIMARY KEY,
    vendedor_usuario_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    CONSTRAINT fk_produto_vendedor FOREIGN KEY (vendedor_usuario_id) REFERENCES vendedor(usuario_id) ON DELETE SET NULL
);

CREATE TABLE produto_categoria (
    produto_id INT NOT NULL,
    categoria_id INT NOT NULL,
    CONSTRAINT pk_produto_categoria PRIMARY KEY (produto_id, categoria_id),
    CONSTRAINT fk_pc_produto FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE CASCADE,
    CONSTRAINT fk_pc_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE CASCADE
);

-- #####################################################################
-- # TABELAS DE COMPRAS E TRANSAÇÕES
-- #####################################################################

CREATE TABLE compra (
    id SERIAL PRIMARY KEY,
    comprador_usuario_id INT NOT NULL,
    data_compra TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- TIMESTAMP armazena data e hora da transação.
    preco_total DECIMAL(10, 2) NOT NULL,
    nota_avaliacao INT CHECK (nota_avaliacao BETWEEN 1 AND 5),
    comentario_avaliacao TEXT,
    CONSTRAINT fk_compra_comprador FOREIGN KEY (comprador_usuario_id) REFERENCES comprador(usuario_id)
);

CREATE TABLE compra_produto (
    compra_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10, 2) NOT NULL, -- Armazena o preço no momento da compra, para histórico.
    CONSTRAINT pk_compra_produto PRIMARY KEY (compra_id, produto_id),
    CONSTRAINT fk_cp_compra FOREIGN KEY (compra_id) REFERENCES compra(id) ON DELETE CASCADE,
    CONSTRAINT fk_cp_produto FOREIGN KEY (produto_id) REFERENCES produto(id)
);

-- #####################################################################
-- # TABELAS COMPLEMENTARES
-- #####################################################################

CREATE TABLE alimentos_preferidos (
    comprador_usuario_id INT NOT NULL,
    categoria_id INT NOT NULL,
    alimento VARCHAR(50) NOT NULL,
    CONSTRAINT pk_alimentos_preferidos PRIMARY KEY (comprador_usuario_id, alimento),
    CONSTRAINT fk_ap_comprador FOREIGN KEY (comprador_usuario_id) REFERENCES comprador(usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_ap_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE CASCADE
);

CREATE TABLE forma_pagamento (
    vendedor_usuario_id INT NOT NULL,
    forma_pagamento VARCHAR(30) NOT NULL,
    CONSTRAINT pk_forma_pagamento PRIMARY KEY (vendedor_usuario_id, forma_pagamento),
    CONSTRAINT fk_fp_vendedor FOREIGN KEY (vendedor_usuario_id) REFERENCES vendedor(usuario_id) ON DELETE CASCADE
);

CREATE TABLE local_venda (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL
);

CREATE TABLE vendedor_local_venda (
    vendedor_usuario_id INT NOT NULL,
    local_venda_id INT NOT NULL,
    CONSTRAINT pk_vendedor_local PRIMARY KEY (vendedor_usuario_id, local_venda_id),
    CONSTRAINT fk_vlv_vendedor FOREIGN KEY (vendedor_usuario_id) REFERENCES vendedor(usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_vlv_local FOREIGN KEY (local_venda_id) REFERENCES local_venda(id) ON DELETE CASCADE
);

-- #####################################################################
-- # ÍNDICES PARA OTIMIZAÇÃO DE CONSULTAS
-- #####################################################################

-- Índices para tabelas de produtos e categorias
CREATE INDEX idx_produto_vendedor_id ON produto(vendedor_usuario_id);
CREATE INDEX idx_pc_produto_id ON produto_categoria(produto_id);
CREATE INDEX idx_pc_categoria_id ON produto_categoria(categoria_id);

-- Índices para tabelas de compras
CREATE INDEX idx_compra_comprador_id ON compra(comprador_usuario_id);
CREATE INDEX idx_compra_data ON compra(data_compra);
CREATE INDEX idx_cp_compra_id ON compra_produto(compra_id);
CREATE INDEX idx_cp_produto_id ON compra_produto(produto_id);

-- Índices para tabelas complementares
CREATE INDEX idx_ap_comprador_id ON alimentos_preferidos(comprador_usuario_id);
CREATE INDEX idx_ap_categoria_id ON alimentos_preferidos(categoria_id);
CREATE INDEX idx_fp_vendedor_id ON forma_pagamento(vendedor_usuario_id);
CREATE INDEX idx_vlv_vendedor_id ON vendedor_local_venda(vendedor_usuario_id);
CREATE INDEX idx_vlv_local_id ON vendedor_local_venda(local_venda_id);