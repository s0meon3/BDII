import psycopg2
from faker import Faker
import random
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

fake = Faker()

def popular_usuario(cursor, total_compradores, total_vendedores, total_admins):
    usuarios_inseridos = 0
    usados = set()

    def gerar_cpf_unico():
        while True:
            cpf = fake.unique.random_number(digits=11)
            if cpf not in usados:
                usados.add(cpf)
                return str(cpf)

    # Gerar compradores
    for _ in range(total_compradores):
        cpf = gerar_cpf_unico()
        nome = fake.name()[:100]
        email = fake.unique.email()[:100]
        senha = fake.password(length=7)
        curso = random.choice([
            "Engenharia de Alimentos", "Nutrição", "Engenharia de Computação",
            "Ciência da Computação", "Administração", "Economia", "Direito", "Matemática"
        ])
        cursor.execute("""
            INSERT INTO usuario (cpf, nome, email, senha, curso, tipo_usuario)
            VALUES (%s, %s, %s, %s, %s, 'comprador')
        """, (cpf, nome, email, senha, curso))
        usuarios_inseridos += 1

    # Gerar vendedores
    for _ in range(total_vendedores):
        cpf = gerar_cpf_unico()
        nome = fake.name()[:100]
        email = fake.unique.email()[:100]
        senha = fake.password(length=7)
        curso = random.choice([
            "Engenharia de Alimentos", "Nutrição", "Engenharia de Computação",
            "Ciência da Computação", "Administração", "Economia", "Direito", "Matemática"
        ])
        cursor.execute("""
            INSERT INTO usuario (cpf, nome, email, senha, curso, tipo_usuario)
            VALUES (%s, %s, %s, %s, %s, 'vendedor')
        """, (cpf, nome, email, senha, curso))
        usuarios_inseridos += 1

    # Gerar admins
    for _ in range(total_admins):
        cpf = gerar_cpf_unico()
        nome = fake.name()[:100]
        email = fake.unique.email()[:100]
        senha = fake.password(length=7)
        curso = random.choice([
            "Engenharia de Alimentos", "Nutrição", "Engenharia de Computação",
            "Ciência da Computação", "Administração", "Economia", "Direito", "Matemática"
        ])
        cursor.execute("""
            INSERT INTO usuario (cpf, nome, email, senha, curso, tipo_usuario)
            VALUES (%s, %s, %s, %s, %s, 'admin')
        """, (cpf, nome, email, senha, curso))
        usuarios_inseridos += 1

    print(f"{usuarios_inseridos} usuários inseridos.")

def popular_vendedor(cursor, n):
    cursor.execute("SELECT cpf FROM usuario WHERE tipo_usuario = 'vendedor'")
    vendedores = cursor.fetchall()
    vendedores = [v[0] for v in vendedores]
    random.shuffle(vendedores)  # embaralha a ordem

    qtd_inseridos = 0
    for cpf in vendedores[:n]:
        nome_tenda = fake.company()[:30]
        horario_inicio = random.randint(6, 12)
        horario_fim = random.randint(horario_inicio + 1, 23)
        faz_entrega = random.choice([True, False])
        ativo = random.choice([True, False])
        try:
            cursor.execute("""
                    INSERT INTO vendedor (cpf, nome_tenda, horario_inicio, horario_fim, faz_entrega, ativo)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (cpf, nome_tenda, horario_inicio, horario_fim, faz_entrega, ativo))
            qtd_inseridos += 1
        except Exception as e:
            print(f"Erro ao inserir vendedor com CPF {cpf}: {e}")
            continue

    print(f"{qtd_inseridos} vendedores inseridos.")

def popular_comprador(cursor, n):
    cursor.execute("SELECT cpf FROM usuario WHERE tipo_usuario = 'comprador'")
    compradores = cursor.fetchall()
    compradores = [c[0] for c in compradores]
    random.shuffle(compradores)

    qtd_inseridos = 0
    for cpf in compradores[:n]:
        dinheiro_disponivel = round(random.uniform(1, 20), 2)
        try:
            cursor.execute("""
                    INSERT INTO comprador (cpf, dinheiro_disponivel)
                    VALUES (%s, %s)
                """, (cpf, dinheiro_disponivel))
            qtd_inseridos += 1
        except Exception as e:
            print(f"Erro ao inserir comprador com CPF {cpf}: {e}")
            continue

    print(f"{qtd_inseridos} compradores inseridos.")

def popular_admin(cursor, n):
    cursor.execute("SELECT cpf FROM usuario WHERE tipo_usuario = 'admin'")
    admins = cursor.fetchall()
    admins = [a[0] for a in admins]
    random.shuffle(admins)

    qtd_inseridos = 0
    for cpf in admins[:n]:
        try:
            cursor.execute("""
                INSERT INTO admin (cpf) VALUES (%s)
            """, (cpf,))
            qtd_inseridos += 1
        except Exception as e:
            print(f"Erro ao inserir admin com CPF {cpf}: {e}")
            continue

    print(f"{qtd_inseridos} admins inseridos.")


def popular_categoria(cursor, n):
    categorias = ['Salgado', 'Doce', 'Bebida', 'Fitness/Natural', 'Lanche', 'Vegano', 'Vegetariano', 'Sem Lactose', 'Sem glúten']

    for i in range(n):
        id_cat = fake.unique.random_int(min=1, max=9999)
        nome_cat = categorias[i]
        cursor.execute("""
            INSERT INTO categoria (id_cat, nome_cat)
            VALUES (%s, %s)
        """, (id_cat, nome_cat))
    print(f"{n} categorias inseridas.")

def popular_produto(cursor):
    cursor.execute("SELECT cpf FROM vendedor")
    vendedores = [v[0] for v in cursor.fetchall()]

    if not vendedores:
        print("Nenhum vendedor disponível.")
        return

    nomes_produtos = [
        "Coxinha", "Pão de Queijo", "Refrigerante", "Suco Natural", "Sanduíche Natural",
        "Bolo de Cenoura", "Brigadeiro", "Pastel", "Tapioca", "Barra de Cereal",
        "Água Mineral", "Smoothie", "Wrap", "Brownie", "Torta de Frango",
        "Empada", "Salada de Frutas", "Iogurte", "Picolé", "Café Gelado"
    ]

    id_prod_gerado = set()

    for cpf in vendedores:
        qtd_produtos = random.randint(1, 5)
        for _ in range(qtd_produtos):
            while True:
                id_prod = fake.unique.random_int(min=1, max=99999)
                if id_prod not in id_prod_gerado:
                    id_prod_gerado.add(id_prod)
                    break

            nome = random.choice(nomes_produtos)
            descricao = fake.sentence(nb_words=8)[:100]
            preco = round(random.uniform(5, 15), 2)

            try:
                cursor.execute("""
                    INSERT INTO produto (ID_Prod, Nome, Descricao, Preco, CPF_vendedor)
                    VALUES (%s, %s, %s, %s, %s)
                """, (id_prod, nome, descricao, preco, cpf))
            except Exception as e:
                print(f"Erro ao inserir produto para vendedor {cpf}: {e}")
                cursor.connection.rollback()
                continue

    print("Produtos inseridos para todos os vendedores.")


def popular_produto_categoria(cursor):
    cursor.execute("SELECT ID_Prod FROM produto")
    produtos = [p[0] for p in cursor.fetchall()]
    cursor.execute("SELECT id_cat FROM categoria")
    categorias = [c[0] for c in cursor.fetchall()]

    for id_prod in produtos:
        num_categorias = random.randint(1, 3)
        escolhidas = random.sample(categorias, num_categorias)
        for id_cat in escolhidas:
            try:
                cursor.execute("""
                        INSERT INTO produto_categoria (id_prod, id_cat)
                        VALUES (%s, %s)
                    """, (id_prod, id_cat))
            except psycopg2.errors.UniqueViolation:
                continue
            except Exception as e:
                print(f"Erro ao associar produto {id_prod} com categoria {id_cat}: {e}")
                cursor.connection.rollback()
    print("Associação produto_categoria concluída.")


def popular_alimentos_preferidos(cursor):
    cursor.execute("SELECT cpf FROM comprador")
    compradores = [c[0] for c in cursor.fetchall()]

    cursor.execute("SELECT id_cat, nome_cat FROM categoria")
    categorias = cursor.fetchall()  # lista de tuplas (id_cat, nome_cat)

    if not compradores or not categorias:
        print("Não há compradores ou categorias cadastradas.")
        return

    for cpf in compradores:
        qtd_alimentos = random.randint(1, len(categorias))  # de 1 a 9, assumindo 9 categorias
        preferidas = random.sample(categorias, qtd_alimentos)  # evita duplicidade

        for id_cat, nome_cat in preferidas:
            try:
                cursor.execute("""
                    INSERT INTO alimentos_preferidos (CPF_comprador, ID_Cat, Alimento)
                    VALUES (%s, %s, %s)
                """, (cpf, id_cat, nome_cat))
            except psycopg2.errors.UniqueViolation:
                continue
            except Exception as e:
                print(f"Erro ao inserir alimento preferido para {cpf}: {e}")
                cursor.connection.rollback()
                continue

    print(f"Alimentos preferidos inseridos para {len(compradores)} compradores.")

def popular_forma_pagamento(cursor):
    cursor.execute("SELECT cpf FROM vendedor")
    vendedores = [v[0] for v in cursor.fetchall()]

    formas = ['Dinheiro', 'Cartão Crédito', 'Cartão Débito', 'PIX']

    if not vendedores:
        print("Nenhum vendedor encontrado.")
        return

    for cpf in vendedores:
        qtd_formas = random.randint(1, len(formas))  # 1 a 4
        formas_escolhidas = random.sample(formas, qtd_formas)

        for forma in formas_escolhidas:
            try:
                cursor.execute("""
                    INSERT INTO forma_pagamento (CPF_vendedor, Forma_pagamento)
                    VALUES (%s, %s)
                """, (cpf, forma))
            except psycopg2.errors.UniqueViolation:
                continue
            except Exception as e:
                print(f"Erro ao inserir forma de pagamento para {cpf}: {e}")
                cursor.connection.rollback()
                continue

    print(f"Formas de pagamento inseridas para {len(vendedores)} vendedores.")


def popular_local_venda(cursor, n):
    for i in range(1, n+1):
        nome = fake.city()[:30]
        latitude = round(random.uniform(-90, 90), 8)
        longitude = round(random.uniform(-180, 180), 8)
        cursor.execute("""
            INSERT INTO local_venda (ID_Local, Nome, Latitude, Longitude)
            VALUES (%s, %s, %s, %s)
        """, (i, nome, latitude, longitude))
    print(f"{n} locais de venda inseridos.")

def popular_vendedor_local(cursor):
    cursor.execute("SELECT ID_Local FROM local_venda")
    locais = [l[0] for l in cursor.fetchall()]
    cursor.execute("SELECT cpf FROM vendedor")
    vendedores = [v[0] for v in cursor.fetchall()]

    if not locais or not vendedores:
        print("Locais ou vendedores insuficientes para associação.")
        return

    for cpf in vendedores:
        qtd_locais = random.randint(1, min(5, len(locais)))
        locais_escolhidos = random.sample(locais, qtd_locais)

        for id_local in locais_escolhidos:
            try:
                cursor.execute("""
                    INSERT INTO vendedor_local (ID_Local, CPF_vendedor)
                    VALUES (%s, %s)
                """, (id_local, cpf))
            except psycopg2.errors.UniqueViolation:
                continue
            except Exception as e:
                print(f"Erro ao associar vendedor {cpf} ao local {id_local}: {e}")
                cursor.connection.rollback()
                continue

    print(f"Vendedores associados a locais de venda.")


from datetime import date

def popular_compra(cursor, n):
    cursor.execute("SELECT ID_Prod FROM produto")
    produtos = [p[0] for p in cursor.fetchall()]
    cursor.execute("SELECT cpf FROM comprador")
    compradores = [c[0] for c in cursor.fetchall()]

    # Datas como objetos date
    start_date = date(2025, 1, 1)
    end_date = date(2025, 5, 18)

    for i in range(1, n + 1):
        id_prod = random.choice(produtos)
        cpf_comprador = random.choice(compradores)
        data = fake.date_between(start_date=start_date, end_date=end_date)

        quantidade = random.randint(1, 10)
        cursor.execute("SELECT preco FROM produto WHERE ID_Prod = %s", (id_prod,))
        preco_unitario = cursor.fetchone()[0]
        preco_total = round(preco_unitario * quantidade, 2)

        cursor.execute("""
            INSERT INTO compra (ID, ID_Prod, CPF_comprador, Data, Quantidade_Produtos, Preco_total)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (i, id_prod, cpf_comprador, data, quantidade, preco_total))

    print(f"{n} compras inseridas.")



def popular_avalia(cursor, n):
    cursor.execute("SELECT ID, CPF_comprador FROM compra")
    compras = cursor.fetchall()  # lista de tuplas (ID, CPF_comprador)

    avaliacoes_inseridas = 0
    avaliada = set()

    while avaliacoes_inseridas < n and len(avaliada) < len(compras):
        id_compra, _ = random.choice(compras)

        if id_compra in avaliada:
            continue  # essa compra já foi avaliada, pula

        nota = random.randint(1, 5)
        comentario = fake.sentence(nb_words=12)

        try:
            cursor.execute("""
                INSERT INTO avalia (ID_compra, Nota, Comentario)
                VALUES (%s, %s, %s)
            """, (id_compra, nota, comentario))
            avaliada.add(id_compra)
            avaliacoes_inseridas += 1
        except psycopg2.errors.UniqueViolation:
            pass

    print(f"{avaliacoes_inseridas} avaliações inseridas.")


if __name__ == "__main__":
    load_dotenv()

    conn = psycopg2.connect(
        dbname=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT')
    )
    cursor = conn.cursor()

    popular_usuario(cursor, 255, 45, 0)

    popular_vendedor(cursor, 1645)
    popular_comprador(cursor, 18255)
    popular_admin(cursor, 100)
    conn.commit()

    popular_categoria(cursor, 9)
    conn.commit()

    popular_produto(cursor)
    conn.commit()

    popular_produto_categoria(cursor)
    conn.commit()

    popular_alimentos_preferidos(cursor)
    conn.commit()

    popular_forma_pagamento(cursor)
    conn.commit()

    popular_local_venda(cursor, 100)
    conn.commit()

    popular_vendedor_local(cursor)
    conn.commit()

    popular_compra(cursor, 182550)
    conn.commit()

    popular_avalia(cursor, 170000)
    conn.commit()

    cursor.close()
    conn.close()
