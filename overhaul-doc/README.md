# OVER HAUL - DOC (Protótipo Acadêmico)

Aplicativo mobile/web simples em **React Native + Expo** para simular a
conferência de itens de insumos na linha de produção. Feito para o projeto
acadêmico do programa ENIAC (proponente: Thomas Gleisson Gomes Queiroz da
Silva, Alltak Adesivos).

## Escopo (protótipo)

- Sem banco de dados
- Sem login
- Sem API/backend
- Sem câmera real (leitura de código é simulada por digitação)
- Dados simulados localmente (arrays fixos no código)

## Fluxo de telas

```
Login → Home → Conference → Scanner → Quantity
  ↓                                      ↑
Cadastro                     "Nova Conferência" volta para Conference
  ↑
  (link "Entrar" volta para Login)
```

0. **Login (`LoginScreen.js`)** — tela inicial do app. Campos de e-mail e
   senha e botão "Entrar": se ambos estiverem preenchidos, navega para a
   Home. Link "Ainda não possui cadastro? Cadastre-se" leva para a tela de
   Cadastro. Não há autenticação real — é apenas uma validação de campos
   preenchidos.
1. **Cadastro (`CadastroScreen.js`)** — campos de nome, e-mail, senha e
   confirmação de senha. O botão "Cadastrar" valida se os campos estão
   preenchidos e se as senhas coincidem, mostrando uma mensagem de sucesso.
   Link "Já possui uma conta? Entrar" volta para o Login.
2. **Início (`HomeScreen.js`)** — apresentação do app e botão para iniciar a
   conferência.
3. **Conferência de Itens (`ConferenceScreen.js`)** — lista de itens
   simulados; ao tocar em um item, navega para o Scanner.
4. **Leitor de Código (`ScannerScreen.js`)** — mostra o produto selecionado e
   o código esperado, exibe uma área visual simulando um scanner de
   QR Code/código de barras, e tem um campo para digitar o código lido.
   - Código correto → avança para a tela de Quantidade.
   - Código incorreto → mostra mensagem de erro e permite tentar novamente.
5. **Quantidade Disponível (`QuantityScreen.js`)** — mostra produto, código,
   status "Produto identificado" e a quantidade em estoque (simulada). Botão
   "Nova Conferência" volta para a tela de Conferência.

A tela **Resultado (`ResultScreen.js`)** foi mantida no projeto (rota
`Result` registrada em `App.js`), mas não faz parte do fluxo principal
disparado pela seleção de produtos.

## Como rodar (Web)

Pré-requisitos: Node.js instalado.

```bash
# 1. Instalar dependências
npm install

# 2. Rodar no navegador
npx expo start --web
```

O Expo abrirá automaticamente uma aba no navegador com o app rodando.

## Códigos e estoque simulado para testar

| Item                  | Código   | Quantidade |
|-----------------------|----------|-----------:|
| Cola Branca 500ml     | COL-500  | 150        |
| Fita Adesiva 50mm     | FIT-050  | 80         |
| Verniz PU             | VER-PU1  | 45         |
| Solvente X            | SOL-X01  | 120        |
| Etiqueta Padrão       | ETQ-STD  | 500        |

Na tela do Scanner, digite o código correspondente ao item selecionado (ou
um código errado, para testar o cenário de falha) e toque em **Ler Código**.

## Estrutura de arquivos

```
overhaul-doc/
├── App.js
├── app.json
├── package.json
└── screens/
    ├── LoginScreen.js
    ├── CadastroScreen.js
    ├── HomeScreen.js
    ├── ConferenceScreen.js
    ├── ScannerScreen.js
    ├── QuantityScreen.js
    └── ResultScreen.js
```

## Compatibilidade

Projeto validado com **Expo SDK 54** (expo 54.0.37, React Native 0.81.5,
React 19.1.0). As versões das dependências em `package.json` foram
conferidas e instaladas sem conflitos de peer dependencies.
