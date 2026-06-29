-- Execute este script no SQL Editor do Supabase (Project > SQL Editor > New query)

create table if not exists kv_store (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- Mantém a Row Level Security ativada e SEM políticas públicas.
-- Isso significa que só a service_role key (usada apenas no servidor,
-- dentro da função /api/kv.js) consegue ler ou escrever nesta tabela.
-- O navegador do usuário nunca acessa o Supabase diretamente.
alter table kv_store enable row level security;
