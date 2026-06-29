# Configurações do Sistema — Vercel + Supabase

Este projeto tem 3 partes:
- `index.html` — o site (a aplicação que você já conhece)
- `api/kv.js` — uma função serverless que guarda/lê dados no Supabase
- `supabase_setup.sql` — o script para criar a tabela no Supabase

Os dados ficam centralizados no Supabase: qualquer pessoa que acessar o site
vê e edita os mesmos dados.

---

## Passo 1 — Criar o projeto no Supabase

1. Acesse https://supabase.com e crie uma conta (ou faça login).
2. Crie um novo projeto (escolha uma senha de banco qualquer — não vai precisar dela aqui).
3. Espere o projeto terminar de provisionar (1–2 minutos).
4. No menu lateral, vá em **SQL Editor** → **New query**.
5. Cole o conteúdo do arquivo `supabase_setup.sql` (deste pacote) e clique em **Run**.
   Isso cria a tabela `kv_store` que vai guardar todos os dados do sistema.
6. Vá em **Project Settings** (ícone de engrenagem) → **API**.
   Você vai precisar de dois valores dessa página:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **service_role key** (em "Project API keys" — é a chave secreta, NÃO a "anon public")

   ⚠️ A `service_role key` dá acesso total ao banco. Ela só deve ir para as
   variáveis de ambiente do Vercel (passo 3), nunca para o código do site.

---

## Passo 2 — Subir o projeto no Vercel

### Opção A — pelo terminal (mais rápido)

1. Extraia este zip numa pasta.
2. Instale a CLI do Vercel (se ainda não tiver):
   ```
   npm install -g vercel
   ```
3. Dentro da pasta extraída, rode:
   ```
   vercel
   ```
4. Faça login quando for solicitado e aceite as opções padrão.
5. Ainda não acesse a URL gerada — falta configurar as variáveis de ambiente (passo 3).

### Opção B — pelo GitHub (melhor para manter atualizações)

1. Crie um repositório no GitHub e envie todos os arquivos deste zip para ele
   (`index.html`, a pasta `api/`, `package.json`).
2. No vercel.com, clique **Add New** → **Project** → importe esse repositório.
3. Deixe as configurações padrão e clique **Deploy** (ainda vai faltar configurar
   as variáveis de ambiente — você pode fazer isso antes ou depois do primeiro deploy).

---

## Passo 3 — Configurar as variáveis de ambiente no Vercel

1. No painel do projeto no Vercel, vá em **Settings** → **Environment Variables**.
2. Adicione duas variáveis:
   - `SUPABASE_URL` → cole o **Project URL** do Supabase
   - `SUPABASE_SERVICE_KEY` → cole a **service_role key** do Supabase
3. Clique em **Save**.
4. Vá em **Deployments**, clique nos "..." do último deploy e escolha **Redeploy**
   (as variáveis de ambiente só valem a partir do próximo deploy).

---

## Passo 4 — Testar

1. Acesse a URL que o Vercel gerou (ex: `https://seu-projeto.vercel.app`).
2. Ative o modo de edição, crie uma categoria e uma configuração de teste.
3. Abra o mesmo link em outro navegador (ou aba anônima) — a configuração
   de teste deve aparecer lá também. Isso confirma que os dados estão
   realmente centralizados no Supabase.

---

## Observações de segurança

- A tabela `kv_store` fica com Row Level Security ativada e **sem políticas
  públicas** — ou seja, só a função `/api/kv.js` (rodando no servidor do
  Vercel, com a `service_role key`) consegue acessá-la. O navegador do
  usuário nunca fala diretamente com o Supabase.
- A função `/api/kv.js` hoje não exige autenticação própria — ela responde
  a qualquer requisição que chegue até ela. A proteção de quem pode *editar*
  continua sendo a senha do modo de edição dentro do próprio site. Se um dia
  você quiser uma camada extra de segurança (por exemplo, exigir uma chave
  de API nas requisições, ou usar autenticação de usuários do Supabase),
  isso pode ser adicionado depois — me avise quando quiser evoluir isso.
