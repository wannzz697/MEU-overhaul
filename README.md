# OVER HAUL - DOC (projeto completo)

Este é o pacote com os dois projetos juntos:

```
overhaul-doc-completo/
├── package.json          <- comandos únicos para rodar tudo
├── overhaul-doc/          (frontend: React Native + Expo)
└── overhaul-doc-server/   (backend: Node.js + Express + Prisma/SQLite)
```

Backend e frontend continuam sendo dois projetos separados (stacks
diferentes, cada um com seu próprio `node_modules`), mas agora dá pra
instalar, configurar o banco e rodar os dois **a partir da pasta raiz**,
sem precisar abrir dois terminais manualmente.

## Primeira vez (configuração inicial)

Rode estes três comandos, nessa ordem, **na pasta raiz**
(`overhaul-doc-completo`):

```powershell
npm install
npm run install:all
npm run db:setup
```

- `npm install` → instala o `concurrently` (a ferramenta que roda os dois
  projetos ao mesmo tempo).
- `npm run install:all` → instala as dependências de dentro de
  `overhaul-doc-server` e de `overhaul-doc`.
- `npm run db:setup` → gera o Prisma Client, cria o `prisma/dev.db` e roda
  o seed (1 usuário + 5 insumos de exemplo).

## Todo dia (rodar o projeto)

Depois da configuração inicial, é só isso, sempre na pasta raiz:

```powershell
npm run dev
```

Um único terminal vai mostrar os logs dos dois lados, prefixados com
`[BACKEND]` (em azul) e `[FRONTEND]` (em verde). O Expo abre a aba do
navegador automaticamente (ou aperte `w` no terminal se não abrir sozinho).

Para parar os dois de uma vez, aperte `Ctrl+C` uma única vez nesse
terminal.

## Se quiser rodar separado (como antes)

Continua funcionando normalmente, entrando em cada pasta:

```powershell
cd overhaul-doc-server
npm run dev
```
```powershell
cd overhaul-doc
npm run web
```

## Resetar o banco de dados

Se quiser apagar tudo e recomeçar o banco do zero:

```powershell
cd overhaul-doc-server
npm run seed
```

(O `seed` já limpa as tabelas antes de inserir os dados de novo.)
