# TCC — Sistema de Locação de Veículos

Projeto desenvolvido como Trabalho de Conclusão de Curso. A ideia é uma plataforma onde donos de veículos conseguem anunciar seus carros e quem precisa pode fazer uma reserva diretamente pelo site.

## O que tem no projeto

- Cadastro e login com JWT
- Dois tipos de usuário: locatário (quem aluga) e locador (dono do veículo)
- Anúncio de veículos com foto, preço da diária, cidade e outras informações
- Sistema de reservas com verificação de conflito de datas
- Aprovação ou recusa da reserva pelo dono do veículo
- Painel admin para gerenciar usuários e veículos

## Tecnologias

**API:** Node.js, Express, MySQL, JWT, Multer

**Frontend:** React, Vite, Tailwind CSS

**Banco de dados:** MySQL

## Como rodar

Você vai precisar do Node.js e de um banco MySQL rodando.

**1. Sobe o banco**

Importe os três arquivos `.sql` que estão na raiz do projeto no seu MySQL:

```
tcc_locacao_users.sql
tcc_locacao_vehicles.sql
tcc_locacao_reservations.sql
```

**2. Configura o `.env` da API**

Dentro de `api/`, crie um arquivo `.env` com:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=tcc_locacao
JWT_SECRET=qualquer_string_secreta
PORT=3001
```

**3. Instala e roda a API**

```bash
cd api
npm install
npm run dev
```

**4. Instala e roda o frontend**

```bash
cd web
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173` e a API em `http://localhost:3001`.
