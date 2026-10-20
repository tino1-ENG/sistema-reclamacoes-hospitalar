# HospitalCare — Arquitetura Técnica e Base de Dados

**Versão:** 1.0 | **Âmbito:** hospital piloto em Moçambique  
**Frontend:** Quasar Framework, Vue 3, TypeScript  
**Backend:** Node.js, Express, TypeScript  
**Base de dados:** PostgreSQL

## 1. Objetivo

Este documento especifica a arquitetura técnica proposta para o HospitalCare, a hierarquia de pastas, as tecnologias e o modelo de dados. É uma proposta inicial para validação com o hospital; categorias, estados, prazos, permissões e políticas de conservação devem ser aprovados antes da produção.

## 2. Arquitetura geral

```text
Paciente / Colaborador / Supervisor / Administrador
                         |
                         v
          Frontend: Quasar + Vue 3 + TypeScript
                         |
                    HTTPS / JSON
                         |
                         v
           Backend: Node.js + Express + JavaScript
             | autenticação e autorização
             | regras de negócio e validação
             | auditoria e notificações
                         |
                         v
                    mongodb
```

O frontend nunca liga diretamente à base de dados. O backend é responsável por validar pedidos, aplicar permissões e executar consultas SQL parametrizadas.

## 3. Tecnologias

### 3.1 Frontend

| Tecnologia | Função |
|---|---|
| Quasar Framework | Componentes, layouts e interface responsiva. |
| Vue 3 | Componentes e reatividade. |
| TypeScript | Tipagem estática. |
| Vite | Desenvolvimento e compilação. |
| Vue Router | Navegação e rotas. |
| Pinia | Estado partilhado, incluindo sessão. |
| Axios | Chamadas à API REST. |
| Sass/SCSS | Estilos. |
| ESLint + Prettier | Qualidade e formatação. |
| Vitest + Vue Test Utils | Testes unitários de componentes. |
| Playwright (opcional) | Testes de ponta a ponta. |

### 3.2 Backend

| Tecnologia | Função |
|---|---|
| Node.js | Execução do servidor. |
| Express | API HTTP REST. |
| TypeScript | Tipagem e manutenção. |
| `pg` | Ligação ao PostgreSQL. |
| Zod | Validação dos pedidos e configurações. |
| `argon2` ou `bcrypt` | Hash de palavras-passe; escolher uma biblioteca. |
| `jose` ou biblioteca JWT mantida | Tokens, se essa estratégia for escolhida. |
| `helmet` | Cabeçalhos HTTP de segurança. |
| `cors` | Controlo de origens permitidas. |
| `express-rate-limit` | Limites para login e verificação. |
| `pino` ou `winston` | Logging estruturado. |
| `dotenv` | Variáveis de ambiente em desenvolvimento. |
| `node-pg-migrate` ou equivalente | Migrações da base de dados. |
| Vitest/Jest + Supertest | Testes unitários e HTTP. |
| ESLint + Prettier | Qualidade e formatação. |

### 3.3 Dados, ferramentas e infraestrutura

| Tecnologia | Função |
|---|---|
| PostgreSQL | Base de dados relacional. |
| SQL | Tabelas, relações, restrições e consultas. |
| pgAdmin ou DBeaver | Administração da base de dados. |
| Git + GitHub/GitLab | Versionamento e colaboração. |
| Docker Compose (opcional) | Ambiente local reproduzível. |
| CI (opcional) | Executar lint e testes automaticamente. |
| Serviço SMS (opcional) | Confirmação do telefone e avisos. |
| Serviço de email (opcional) | Notificações. |
| Armazenamento privado (opcional) | Ficheiros anexados a processos. |

Escolher versões estáveis e compatíveis e guardar os ficheiros de lock. Não instalar várias bibliotecas concorrentes para a mesma função sem motivo.

## 4. Perfis de utilizador

| Código | Perfil | Permissões principais |
|---|---|---|
| `PATIENT` | Paciente | Criar e acompanhar os próprios processos. |
| `STAFF` | Colaborador | Tratar processos autorizados ou atribuídos. |
| `SUPERVISOR` | Supervisor | Distribuir, acompanhar e escalar processos da sua área. |
| `ADMIN` | Administrador | Gerir contas internas e configurações autorizadas. |

As permissões devem ser verificadas no backend por perfil, ação e recurso. Esconder um botão no frontend não é uma medida de segurança suficiente.

## 5. Hierarquia de pastas

```text
hospitalcare/
├── README.md
├── .gitignore
├── .editorconfig
├── docs/
│   ├── requisitos.md
│   ├── arquitetura-tecnica.md
│   ├── modelo-base-dados.md
│   ├── dicionario-dados.md
│   ├── api/
│   │   ├── autenticacao.md
│   │   ├── pacientes.md
│   │   ├── processos.md
│   │   ├── mensagens.md
│   │   ├── administracao.md
│   │   └── relatorios.md
│   └── decisoes/
│       └── ADR-001-arquitetura.md
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── quasar.config.ts
│   ├── .env.example
│   ├── public/
│   └── src/
│       ├── App.vue
│       ├── boot/api.ts
│       ├── assets/styles/
│       │   ├── app.scss
│       │   └── variables.scss
│       ├── components/
│       │   ├── common/
│       │   ├── forms/
│       │   ├── processes/
│       │   └── layout/
│       ├── layouts/
│       │   ├── PublicLayout.vue
│       │   ├── AuthLayout.vue
│       │   ├── PatientLayout.vue
│       │   └── StaffLayout.vue
│       ├── pages/
│       │   ├── public/
│       │   ├── auth/
│       │   ├── patient/
│       │   ├── staff/
│       │   ├── supervisor/
│       │   ├── admin/
│       │   └── errors/
│       ├── router/
│       │   ├── index.ts
│       │   └── routes.ts
│       ├── stores/
│       │   ├── auth.store.ts
│       │   ├── notifications.store.ts
│       │   └── app.store.ts
│       ├── services/
│       │   ├── api-client.ts
│       │   ├── auth.service.ts
│       │   ├── patients.service.ts
│       │   ├── processes.service.ts
│       │   ├── messages.service.ts
│       │   ├── notifications.service.ts
│       │   ├── users.service.ts
│       │   ├── departments.service.ts
│       │   ├── categories.service.ts
│       │   └── reports.service.ts
│       ├── composables/
│       ├── types/
│       ├── utils/
│       └── css/quasar.variables.scss
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── migrations/
│   │   ├── 001_core.sql
│   │   ├── 002_processes.sql
│   │   ├── 003_messages_notifications.sql
│   │   ├── 004_audit_sla.sql
│   │   └── 005_indexes.sql
│   ├── seeds/
│   │   ├── roles.sql
│   │   ├── statuses.sql
│   │   └── reference-data.sql
│   ├── src/
│   │   ├── server.ts
│   │   ├── app.ts
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   ├── database.ts
│   │   │   └── logger.ts
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   │   ├── authenticate.ts
│   │   │   ├── authorize.ts
│   │   │   ├── validate.ts
│   │   │   └── error-handler.ts
│   │   ├── validators/
│   │   ├── policies/
│   │   ├── integrations/
│   │   │   ├── sms/
│   │   │   ├── email/
│   │   │   └── file-storage/
│   │   ├── jobs/
│   │   ├── utils/
│   │   └── types/
│   └── tests/
│       ├── unit/
│       ├── integration/
│       ├── fixtures/
│       └── helpers/
├── database/
│   ├── README.md
│   ├── schema.sql
│   ├── indexes.sql
│   ├── seed-reference-data.sql
│   └── diagrams/erd.mmd
├── infra/
│   ├── docker-compose.yml
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── nginx/hospitalcare.conf
└── scripts/
    ├── dev.ps1
    ├── backup-db.ps1
    └── restore-db.ps1
```

### Responsabilidade das principais pastas

- `pages/`: páginas completas da interface.
- `components/`: elementos reutilizáveis.
- `layouts/`: estruturas partilhadas entre páginas.
- `stores/`: estado partilhado da interface.
- `services/` no frontend: comunicação com a API.
- `routes/`: endpoints HTTP.
- `controllers/`: traduzem pedidos HTTP em respostas.
- `services/` no backend: regras de negócio.
- `repositories/`: acesso à base de dados.
- `middlewares/`: autenticação, autorização, validação e erros.
- `validators/`: esquemas de validação.
- `policies/`: autorização por recurso.
- `migrations/`: alterações versionadas ao esquema.
- `seeds/`: dados de referência não secretos.
- `tests/`: testes automatizados.
- `docs/`: documentação funcional e técnica.

Esta é uma estrutura-alvo. Criar os ficheiros à medida que forem necessários, em vez de manter muitos ficheiros vazios.

## 6. Convenções da base de dados

- Tabelas e colunas em `snake_case`; tabelas em plural.
- Chaves primárias `UUID`, salvo tabelas de referência pequenas que podem usar `SMALLSERIAL`.
- Datas e horas com `TIMESTAMPTZ`.
- Chaves estrangeiras para manter integridade.
- Consultas SQL parametrizadas.
- Índices para consultas frequentes, validados com dados de teste.
- Desativar logicamente contas/categorias quando necessário preservar histórico.
- Não recolher dados clínicos que não sejam necessários ao tratamento administrativo.
- Anexos ficam em armazenamento privado; a base de dados guarda metadados e a chave interna do ficheiro.

## 7. Inventário das tabelas

São propostas **30 tabelas**. Algumas são opcionais conforme a estratégia escolhida e o âmbito do MVP.

| Nº | Tabela | Finalidade |
|---:|---|---|
| 1 | `hospitals` | Dados institucionais do hospital. |
| 2 | `users` | Contas de pacientes e utilizadores internos. |
| 3 | `roles` | Perfis de acesso. |
| 4 | `user_roles` | Associação entre contas e perfis. |
| 5 | `departments` | Departamentos e serviços. |
| 6 | `user_departments` | Associação de colaboradores a departamentos. |
| 7 | `patient_profiles` | Dados específicos do perfil de paciente. |
| 8 | `phone_verification_codes` | Códigos temporários de confirmação de telefone. |
| 9 | `password_reset_tokens` | Tokens temporários de recuperação. |
| 10 | `process_types` | Tipos de processo. |
| 11 | `categories` | Categorias de reclamações e pedidos. |
| 12 | `process_statuses` | Estados do fluxo. |
| 13 | `priorities` | Níveis de prioridade. |
| 14 | `processes` | Registo principal de cada caso. |
| 15 | `process_assignments` | Histórico de atribuições. |
| 16 | `process_status_history` | Histórico das mudanças de estado. |
| 17 | `process_messages` | Mensagens públicas e notas internas. |
| 18 | `process_attachments` | Metadados de anexos. |
| 19 | `process_watchers` | Acompanhantes internos opcionais. |
| 20 | `notifications` | Notificações dentro do sistema. |
| 21 | `notification_deliveries` | Tentativas de envio por SMS/email. |
| 22 | `faqs` | Perguntas frequentes. |
| 23 | `system_settings` | Configurações gerais não secretas. |
| 24 | `audit_logs` | Eventos de auditoria. |
| 25 | `sla_policies` | Políticas de prazo. |
| 26 | `process_sla_events` | Eventos de prazos e incumprimentos. |
| 27 | `feedback` | Avaliação opcional do atendimento. |
| 28 | `sessions` | Sessões revogáveis, se forem usadas. |
| 29 | `login_attempts` | Tentativas de autenticação. |
| 30 | `api_idempotency_keys` | Prevenção de submissões duplicadas. |

## 8. Dicionário completo das tabelas

### 8.1 `hospitals`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `name` | VARCHAR(180) | NOT NULL, nome oficial |
| `code` | VARCHAR(40) | UNIQUE, NOT NULL |
| `address` | TEXT | Opcional |
| `phone` | VARCHAR(30) | Contacto institucional opcional |
| `email` | VARCHAR(254) | Email institucional opcional |
| `timezone` | VARCHAR(60) | NOT NULL, default `Africa/Maputo` |
| `is_active` | BOOLEAN | NOT NULL, default TRUE |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

### 8.2 `users`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `hospital_id` | UUID | FK → `hospitals.id`, NOT NULL |
| `full_name` | VARCHAR(180) | NOT NULL |
| `phone` | VARCHAR(30) | Telefone normalizado; unicidade conforme política |
| `email` | VARCHAR(254) | Opcional |
| `password_hash` | TEXT | Hash seguro, nunca palavra-passe em texto simples |
| `phone_verified_at` | TIMESTAMPTZ | Opcional |
| `email_verified_at` | TIMESTAMPTZ | Opcional |
| `is_active` | BOOLEAN | NOT NULL, default TRUE |
| `last_login_at` | TIMESTAMPTZ | Opcional |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |
| `deleted_at` | TIMESTAMPTZ | Desativação lógica opcional |

A política de unicidade do telefone/email deve ser decidida. O registo público nunca pode atribuir perfis internos.

### 8.3 `roles`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | SMALLSERIAL | PK |
| `code` | VARCHAR(30) | UNIQUE: PATIENT, STAFF, SUPERVISOR, ADMIN |
| `name` | VARCHAR(80) | NOT NULL |
| `description` | TEXT | Opcional |
| `is_system_role` | BOOLEAN | NOT NULL, default TRUE |
| `created_at` | TIMESTAMPTZ | NOT NULL |

### 8.4 `user_roles`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `user_id` | UUID | PK composta, FK → `users.id` |
| `role_id` | SMALLINT | PK composta, FK → `roles.id` |
| `assigned_by` | UUID | FK → `users.id`, opcional |
| `assigned_at` | TIMESTAMPTZ | NOT NULL |

PK composta: (`user_id`, `role_id`).

### 8.5 `departments`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `hospital_id` | UUID | FK → `hospitals.id`, NOT NULL |
| `name` | VARCHAR(120) | NOT NULL |
| `code` | VARCHAR(40) | NOT NULL |
| `description` | TEXT | Opcional |
| `is_active` | BOOLEAN | NOT NULL, default TRUE |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

UNIQUE recomendado: (`hospital_id`, `code`).

### 8.6 `user_departments`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `user_id` | UUID | PK composta, FK → `users.id` |
| `department_id` | UUID | PK composta, FK → `departments.id` |
| `is_primary` | BOOLEAN | NOT NULL, default FALSE |
| `created_at` | TIMESTAMPTZ | NOT NULL |

PK composta: (`user_id`, `department_id`).

### 8.7 `patient_profiles`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `user_id` | UUID | PK e FK → `users.id` |
| `preferred_contact_channel` | VARCHAR(20) | NOT NULL, default `IN_APP` |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

Evitar campos clínicos, documento de identificação e endereço sem justificação aprovada.

### 8.8 `phone_verification_codes`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | FK → `users.id`, NOT NULL |
| `code_hash` | TEXT | NOT NULL, hash do código |
| `expires_at` | TIMESTAMPTZ | NOT NULL |
| `consumed_at` | TIMESTAMPTZ | Opcional |
| `attempt_count` | SMALLINT | NOT NULL, default 0 |
| `created_at` | TIMESTAMPTZ | NOT NULL |

Limitar tentativas e reenvios, expirar rapidamente e nunca escrever o código nos logs.

### 8.9 `password_reset_tokens`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | FK → `users.id`, NOT NULL |
| `token_hash` | TEXT | NOT NULL |
| `expires_at` | TIMESTAMPTZ | NOT NULL |
| `used_at` | TIMESTAMPTZ | Opcional |
| `created_at` | TIMESTAMPTZ | NOT NULL |

### 8.10 `process_types`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | SMALLSERIAL | PK |
| `code` | VARCHAR(40) | UNIQUE: `COMPLAINT`, `CLARIFICATION` |
| `name` | VARCHAR(100) | NOT NULL |
| `description` | TEXT | Opcional |
| `is_active` | BOOLEAN | NOT NULL, default TRUE |

### 8.11 `categories`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `hospital_id` | UUID | FK → `hospitals.id`, NOT NULL |
| `name` | VARCHAR(120) | NOT NULL |
| `code` | VARCHAR(50) | NOT NULL |
| `description` | TEXT | Opcional |
| `default_department_id` | UUID | FK → `departments.id`, opcional |
| `is_active` | BOOLEAN | NOT NULL, default TRUE |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

UNIQUE recomendado: (`hospital_id`, `code`).

### 8.12 `process_statuses`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | SMALLSERIAL | PK |
| `code` | VARCHAR(40) | UNIQUE, código estável |
| `name` | VARCHAR(100) | NOT NULL |
| `description` | TEXT | Opcional |
| `is_final` | BOOLEAN | NOT NULL, default FALSE |
| `is_patient_visible` | BOOLEAN | NOT NULL, default TRUE |
| `sort_order` | SMALLINT | NOT NULL, default 0 |
| `is_active` | BOOLEAN | NOT NULL, default TRUE |

Estados iniciais sugeridos: `SUBMITTED`, `TRIAGE`, `ASSIGNED`, `IN_REVIEW`, `WAITING_PATIENT`, `WAITING_DEPARTMENT`, `ANSWERED`, `CLOSED`, `REOPENED`. Validar a lista e as transições com o hospital.

### 8.13 `priorities`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | SMALLSERIAL | PK |
| `code` | VARCHAR(30) | UNIQUE, por exemplo LOW, NORMAL, HIGH |
| `name` | VARCHAR(60) | NOT NULL |
| `weight` | SMALLINT | NOT NULL |
| `is_active` | BOOLEAN | NOT NULL, default TRUE |

Prioridade administrativa não deve ser apresentada como classificação clínica.

### 8.14 `processes`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `reference_code` | VARCHAR(40) | UNIQUE, NOT NULL |
| `hospital_id` | UUID | FK → `hospitals.id`, NOT NULL |
| `patient_id` | UUID | FK → `users.id`, NOT NULL |
| `process_type_id` | SMALLINT | FK → `process_types.id`, NOT NULL |
| `category_id` | UUID | FK → `categories.id`, NOT NULL |
| `department_id` | UUID | FK → `departments.id`, opcional |
| `status_id` | SMALLINT | FK → `process_statuses.id`, NOT NULL |
| `priority_id` | SMALLINT | FK → `priorities.id`, NOT NULL |
| `subject` | VARCHAR(180) | NOT NULL |
| `description` | TEXT | NOT NULL |
| `incident_date` | DATE | Opcional |
| `assigned_to` | UUID | FK → `users.id`, opcional |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |
| `first_response_at` | TIMESTAMPTZ | Opcional |
| `closed_at` | TIMESTAMPTZ | Opcional |
| `closed_by` | UUID | FK → `users.id`, opcional |
| `closure_reason` | TEXT | Opcional |
| `deleted_at` | TIMESTAMPTZ | Desativação lógica opcional |

O código de referência não substitui autenticação. Validar no backend que o paciente, hospital, categoria e departamento são compatíveis. Criar o processo e o primeiro evento histórico na mesma transação.

### 8.15 `process_assignments`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `process_id` | UUID | FK → `processes.id`, NOT NULL |
| `assigned_to` | UUID | FK → `users.id`, NOT NULL |
| `assigned_by` | UUID | FK → `users.id`, NOT NULL |
| `department_id` | UUID | FK → `departments.id`, opcional |
| `assignment_note` | TEXT | Nota interna opcional |
| `assigned_at` | TIMESTAMPTZ | NOT NULL |
| `ended_at` | TIMESTAMPTZ | Opcional |

Preservar as atribuições anteriores; não substituir o histórico.

### 8.16 `process_status_history`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `process_id` | UUID | FK → `processes.id`, NOT NULL |
| `from_status_id` | SMALLINT | FK → `process_statuses.id`, opcional |
| `to_status_id` | SMALLINT | FK → `process_statuses.id`, NOT NULL |
| `changed_by` | UUID | FK → `users.id`, opcional apenas para evento de sistema identificado |
| `reason` | TEXT | Justificação opcional |
| `created_at` | TIMESTAMPTZ | NOT NULL |

### 8.17 `process_messages`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `process_id` | UUID | FK → `processes.id`, NOT NULL |
| `author_id` | UUID | FK → `users.id`, NOT NULL |
| `message_type` | VARCHAR(30) | `PUBLIC_REPLY`, `PATIENT_MESSAGE`, `INTERNAL_NOTE`, `INFO_REQUEST` |
| `body` | TEXT | NOT NULL |
| `is_visible_to_patient` | BOOLEAN | NOT NULL, default FALSE |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `edited_at` | TIMESTAMPTZ | Opcional |
| `deleted_at` | TIMESTAMPTZ | Ocultação lógica opcional |

Regra crítica: o backend deve impedir que notas internas sejam incluídas em respostas destinadas ao paciente.

### 8.18 `process_attachments`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `process_id` | UUID | FK → `processes.id`, NOT NULL |
| `uploaded_by` | UUID | FK → `users.id`, NOT NULL |
| `message_id` | UUID | FK → `process_messages.id`, opcional |
| `original_filename` | VARCHAR(255) | NOT NULL |
| `storage_key` | TEXT | UNIQUE, NOT NULL; chave privada |
| `mime_type` | VARCHAR(120) | NOT NULL, tipo validado |
| `size_bytes` | BIGINT | NOT NULL, CHECK > 0 |
| `sha256_hash` | CHAR(64) | Opcional |
| `scan_status` | VARCHAR(20) | NOT NULL, default PENDING |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `deleted_at` | TIMESTAMPTZ | Opcional |

Guardar o conteúdo em armazenamento privado. Validar o ficheiro e verificar autorização antes do download.

### 8.19 `process_watchers` (opcional)

| Campo | Tipo | Regras / significado |
|---|---|---|
| `process_id` | UUID | PK composta, FK → `processes.id` |
| `user_id` | UUID | PK composta, FK → `users.id` |
| `added_by` | UUID | FK → `users.id`, NOT NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL |

PK composta: (`process_id`, `user_id`). O observador continua sujeito às permissões.

### 8.20 `notifications`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | FK → `users.id`, NOT NULL |
| `process_id` | UUID | FK → `processes.id`, opcional |
| `event_type` | VARCHAR(60) | NOT NULL |
| `title` | VARCHAR(160) | NOT NULL |
| `body` | TEXT | NOT NULL; conteúdo mínimo |
| `read_at` | TIMESTAMPTZ | Opcional |
| `created_at` | TIMESTAMPTZ | NOT NULL |

### 8.21 `notification_deliveries`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `notification_id` | UUID | FK → `notifications.id`, NOT NULL |
| `channel` | VARCHAR(20) | SMS, EMAIL ou canal aprovado |
| `provider` | VARCHAR(80) | Opcional |
| `status` | VARCHAR(20) | PENDING, SENT, FAILED, DELIVERED |
| `provider_reference` | VARCHAR(180) | Opcional |
| `attempt_count` | SMALLINT | NOT NULL, default 0 |
| `last_error_code` | VARCHAR(80) | Opcional, sem segredos |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `sent_at` | TIMESTAMPTZ | Opcional |
| `delivered_at` | TIMESTAMPTZ | Opcional |

### 8.22 `faqs`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `hospital_id` | UUID | FK → `hospitals.id`, NOT NULL |
| `question` | VARCHAR(300) | NOT NULL |
| `answer` | TEXT | NOT NULL |
| `sort_order` | INTEGER | NOT NULL, default 0 |
| `is_published` | BOOLEAN | NOT NULL, default FALSE |
| `created_by` | UUID | FK → `users.id`, opcional |
| `updated_by` | UUID | FK → `users.id`, opcional |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

### 8.23 `system_settings`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `key` | VARCHAR(100) | PK |
| `value_json` | JSONB | NOT NULL |
| `description` | TEXT | Opcional |
| `updated_by` | UUID | FK → `users.id`, opcional |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

Não guardar palavras-passe, chaves de API ou segredos nesta tabela.

### 8.24 `audit_logs`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `actor_user_id` | UUID | FK → `users.id`, opcional |
| `action` | VARCHAR(100) | NOT NULL |
| `entity_type` | VARCHAR(80) | NOT NULL |
| `entity_id` | UUID | Opcional |
| `request_id` | VARCHAR(100) | Opcional |
| `ip_address` | INET | Opcional, conforme política de privacidade |
| `metadata` | JSONB | NOT NULL, default `{}` |
| `created_at` | TIMESTAMPTZ | NOT NULL |

Nunca guardar palavras-passe, tokens ou códigos de verificação em `metadata`. Restringir a leitura e definir retenção.

### 8.25 `sla_policies`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `hospital_id` | UUID | FK → `hospitals.id`, NOT NULL |
| `name` | VARCHAR(120) | NOT NULL |
| `process_type_id` | SMALLINT | FK → `process_types.id`, opcional |
| `category_id` | UUID | FK → `categories.id`, opcional |
| `priority_id` | SMALLINT | FK → `priorities.id`, opcional |
| `first_response_hours` | INTEGER | CHECK > 0 |
| `resolution_hours` | INTEGER | CHECK > 0 |
| `is_active` | BOOLEAN | NOT NULL, default TRUE |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

Os prazos e a regra de seleção de política devem ser aprovados pelo hospital.

### 8.26 `process_sla_events`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `process_id` | UUID | FK → `processes.id`, NOT NULL |
| `sla_policy_id` | UUID | FK → `sla_policies.id`, opcional |
| `event_type` | VARCHAR(40) | NOT NULL |
| `due_at` | TIMESTAMPTZ | Opcional |
| `occurred_at` | TIMESTAMPTZ | NOT NULL |
| `details` | JSONB | NOT NULL, default `{}` |

### 8.27 `feedback` (opcional)

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `process_id` | UUID | FK → `processes.id`, UNIQUE, NOT NULL |
| `patient_id` | UUID | FK → `users.id`, NOT NULL |
| `rating` | SMALLINT | CHECK BETWEEN 1 AND 5 |
| `comment` | TEXT | Opcional |
| `created_at` | TIMESTAMPTZ | NOT NULL |

O backend deve confirmar que o paciente é proprietário do processo e pode avaliá-lo.

### 8.28 `sessions` (dependente da estratégia de autenticação)

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | FK → `users.id`, NOT NULL |
| `session_token_hash` | TEXT | UNIQUE, NOT NULL |
| `expires_at` | TIMESTAMPTZ | NOT NULL |
| `revoked_at` | TIMESTAMPTZ | Opcional |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `last_seen_at` | TIMESTAMPTZ | Opcional |

Guardar apenas o hash do token de sessão.

### 8.29 `login_attempts`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | FK → `users.id`, opcional |
| `identifier_hash` | TEXT | Opcional |
| `ip_address` | INET | Opcional, se justificado |
| `was_successful` | BOOLEAN | NOT NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL |

Nunca guardar a palavra-passe introduzida. Definir retenção curta e controlada.

### 8.30 `api_idempotency_keys`

| Campo | Tipo | Regras / significado |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | FK → `users.id`, NOT NULL |
| `idempotency_key` | VARCHAR(160) | NOT NULL |
| `request_hash` | CHAR(64) | NOT NULL |
| `response_status` | SMALLINT | Opcional |
| `response_body` | JSONB | Opcional, sem segredos |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `expires_at` | TIMESTAMPTZ | NOT NULL |

UNIQUE recomendado: (`user_id`, `idempotency_key`). Usar nos endpoints em que a repetição possa criar duplicados.

## 9. Relações principais

```text
hospitals 1---N users
hospitals 1---N departments
hospitals 1---N categories
hospitals 1---N processes

users N---N roles através de user_roles
users N---N departments através de user_departments
users 1---1 patient_profiles
users 1---N processes (paciente e responsável)
users 1---N process_messages
users 1---N notifications

process_types 1---N processes
categories 1---N processes
departments 1---N processes
process_statuses 1---N processes
priorities 1---N processes

processes 1---N process_assignments
processes 1---N process_status_history
processes 1---N process_messages
processes 1---N process_attachments
processes 1---N notifications
processes 1---N process_sla_events
processes 1---0..1 feedback
```

### Diagrama Mermaid simplificado

```mermaid
erDiagram
    HOSPITALS ||--o{ USERS : possui
    HOSPITALS ||--o{ DEPARTMENTS : organiza
    HOSPITALS ||--o{ CATEGORIES : define
    HOSPITALS ||--o{ PROCESSES : recebe
    USERS ||--o{ USER_ROLES : tem
    ROLES ||--o{ USER_ROLES : atribuido
    USERS ||--o| PATIENT_PROFILES : perfil
    USERS ||--o{ PROCESSES : submete
    PROCESS_TYPES ||--o{ PROCESSES : classifica
    CATEGORIES ||--o{ PROCESSES : categoriza
    PROCESS_STATUSES ||--o{ PROCESSES : estado
    PRIORITIES ||--o{ PROCESSES : prioridade
    DEPARTMENTS ||--o{ PROCESSES : trata
    PROCESSES ||--o{ PROCESS_ASSIGNMENTS : atribuicoes
    PROCESSES ||--o{ PROCESS_STATUS_HISTORY : historico
    PROCESSES ||--o{ PROCESS_MESSAGES : mensagens
    PROCESSES ||--o{ PROCESS_ATTACHMENTS : anexos
    PROCESSES ||--o{ NOTIFICATIONS : gera
    PROCESSES ||--o| FEEDBACK : avaliacao
    USERS ||--o{ NOTIFICATIONS : recebe
```

## 10. Índices recomendados

| Tabela | Índice | Finalidade |
|---|---|---|
| `users` | telefone normalizado UNIQUE, se adotado | Login e prevenção de duplicados. |
| `users` | (`hospital_id`, `is_active`) | Filtrar contas. |
| `user_roles` | (`role_id`) | Consultar utilizadores por perfil. |
| `user_departments` | (`department_id`) | Consultar equipa por departamento. |
| `processes` | `reference_code` UNIQUE | Pesquisa pela referência. |
| `processes` | (`patient_id`, `created_at DESC`) | Histórico do paciente. |
| `processes` | (`status_id`, `created_at DESC`) | Fila por estado. |
| `processes` | (`assigned_to`, `status_id`) | Trabalho do colaborador. |
| `processes` | (`department_id`, `status_id`) | Fila departamental. |
| `process_assignments` | (`process_id`, `assigned_at DESC`) | Histórico de atribuição. |
| `process_status_history` | (`process_id`, `created_at DESC`) | Linha temporal. |
| `process_messages` | (`process_id`, `created_at`) | Mensagens do processo. |
| `notifications` | (`user_id`, `read_at`, `created_at DESC`) | Notificações não lidas. |
| `audit_logs` | (`created_at DESC`) | Auditoria por período. |
| `process_sla_events` | (`due_at`, `event_type`) | Prazos vencidos. |

Criar índices adicionais apenas quando as consultas reais justificarem.

## 11. Migrações e dados de referência

Migrações são alterações versionadas do esquema e devem ser aplicadas por ordem. Os seeds iniciais podem criar os perfis, tipos, estados, prioridades e configurações não secretas aprovados.

Não criar um administrador com palavra-passe fixa no código. A conta inicial deve ser criada por procedimento seguro e as credenciais não devem ser guardadas no repositório.

## 12. API REST proposta

Prefixo base: `/api/v1`.

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | `/auth/register` | Registar paciente. |
| POST | `/auth/verify-phone` | Confirmar telefone. |
| POST | `/auth/login` | Iniciar sessão. |
| POST | `/auth/logout` | Terminar/revogar sessão. |
| POST | `/auth/forgot-password` | Iniciar recuperação. |
| POST | `/auth/reset-password` | Redefinir credenciais. |
| GET | `/auth/me` | Utilizador autenticado. |
| GET/PATCH | `/patients/me` | Consultar/atualizar perfil próprio. |
| GET/POST | `/processes` | Listar/criar processos autorizados. |
| GET | `/processes/:id` | Detalhes após autorização. |
| GET | `/processes/:id/history` | Histórico visível ao utilizador. |
| GET/POST | `/processes/:id/messages` | Consultar/enviar mensagens autorizadas. |
| POST | `/processes/:id/attachments` | Enviar anexo autorizado. |
| POST | `/processes/:id/assignments` | Atribuir/reatribuir processo. |
| PATCH | `/processes/:id/status` | Mudar estado dentro do fluxo válido. |
| GET | `/staff/processes/assigned` | Fila do colaborador. |
| GET | `/supervisor/overview` | Indicadores da área. |
| GET | `/reports/summary` | Relatórios autorizados. |
| GET | `/notifications` | Listar notificações próprias. |
| PATCH | `/notifications/:id/read` | Marcar como lida. |
| GET/POST | `/admin/users` | Listar/criar contas internas. |
| GET/PATCH | `/admin/users/:id` | Consultar/atualizar conta. |
| GET/POST | `/admin/departments` | Gerir departamentos. |
| GET/POST | `/admin/categories` | Gerir categorias. |
| GET/POST | `/admin/faqs` | Gerir perguntas frequentes. |
| GET | `/admin/audit-logs` | Consultar auditoria. |
| GET/POST | `/admin/sla-policies` | Gerir prazos. |

Documentar os pedidos, respostas, códigos HTTP e permissões de cada endpoint. Nenhum endpoint administrativo deve ficar acessível sem autenticação e autorização.

## 13. Variáveis de ambiente

### `backend/.env.example`

```dotenv
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1
FRONTEND_ORIGIN=http://localhost:9000
DATABASE_URL=postgresql://hospitalcare_app:change_me@localhost:5432/hospitalcare
DATABASE_SSL=false
AUTH_ACCESS_TOKEN_SECRET=replace_with_long_random_secret
AUTH_ACCESS_TOKEN_TTL=15m
AUTH_REFRESH_TOKEN_TTL=7d
PASSWORD_HASH_COST=12
PHONE_VERIFICATION_TTL_MINUTES=10
PASSWORD_RESET_TTL_MINUTES=15
LOG_LEVEL=debug
UPLOAD_MAX_BYTES=5242880
```

### `frontend/.env.example`

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Valores acima são exemplos. Nunca usar segredos fictícios em produção. Variáveis `VITE_` ficam acessíveis no navegador; não colocar segredos privados nelas. A estratégia de autenticação (tokens ou cookies seguros) deve ser decidida e documentada.

## 14. Testes obrigatórios

### Backend
- Registo, login, recuperação e confirmação de telefone.
- Rejeição de códigos expirados/reutilizados e controlo de tentativas.
- Paciente A não consegue consultar processos de B.
- Colaborador só acede a processos autorizados.
- Notas internas nunca aparecem na API pública.
- Transições de estado inválidas são rejeitadas.
- Atribuições e mudanças de estado geram histórico.
- Anexos inválidos são rejeitados.
- Falhas de notificação não eliminam o processo.
- Relatórios respeitam permissões.
- Auditoria não contém segredos.

### Frontend
- Validação de formulários e mensagens de erro.
- Estados de carregamento, sucesso e falha.
- Rotas privadas e menus conforme perfil.
- Interface responsiva.
- Listagem, filtros e histórico dos processos.
- Notas internas invisíveis para pacientes.

### Segurança e operação
- Testes de autorização por recurso.
- Limitação de tentativas de autenticação.
- Validação contra injeção SQL.
- CORS restrito.
- Armazenamento privado de anexos.
- Segredos ausentes dos logs.
- Cópias de segurança e restauro testados.

## 15. Fases de desenvolvimento

1. **Fundação:** repositório, estrutura, Quasar, Express, PostgreSQL, migrações.
2. **Autenticação:** pacientes, confirmação de telefone, sessões, perfis e permissões.
3. **Processos:** criação, referência, estados, atribuição e histórico.
4. **Comunicação:** mensagens, notas internas, anexos e notificações.
5. **Administração:** departamentos, categorias, supervisão, prazos, relatórios e auditoria.
6. **Piloto:** testes de segurança, formação, cópias de segurança e aprovação do hospital.

## 16. Decisões pendentes

Antes de fechar o esquema final, confirmar:

1. Um utilizador pode ter vários perfis?
2. O telefone será obrigatório e único? O email será utilizado?
3. O SMS estará disponível no MVP?
4. Quais são as categorias, departamentos e estados oficiais?
5. Quem pode atribuir, responder, encerrar e reabrir processos?
6. Serão aceites anexos? Quais os formatos e tamanhos?
7. Quais os prazos de primeira resposta e resolução?
8. Que canais de notificação serão usados?
9. Durante quanto tempo conservar processos, mensagens, anexos e logs?
10. A avaliação de satisfação fará parte da primeira versão?
11. Será usada autenticação por cookies/sessões ou tokens?
12. Qual será o ambiente de alojamento e o plano de recuperação?
13. Quais obrigações legais e políticas do hospital se aplicam?

## 17. Checklist técnica

- [ ] Requisitos e fluxos aprovados.
- [ ] Repositório e estrutura de pastas criados.
- [ ] Quasar + Vue 3 + TypeScript configurados.
- [ ] Node.js + Express + TypeScript configurados.
- [ ] PostgreSQL configurado.
- [ ] Migrações versionadas e testadas.
- [ ] Utilizador da base de dados com permissões mínimas.
- [ ] Autenticação e autorização verificadas no backend.
- [ ] Processos, atribuições e histórico implementados.
- [ ] Notas internas separadas de mensagens públicas.
- [ ] Notificações e auditoria implementadas.
- [ ] Testes automatizados executados.
- [ ] Segredos removidos do repositório.
- [ ] Cópias de segurança e restauro testados.
- [ ] Aprovação do hospital antes da produção.

## 18. Conclusão

A proposta utiliza Quasar + Vue 3 + TypeScript no frontend, Node.js + Express + TypeScript no backend e PostgreSQL como base de dados. O modelo descreve 30 tabelas para contas, perfis, departamentos, processos, mensagens, atribuições, anexos, notificações, prazos, configurações e auditoria.

As 30 tabelas constituem uma proposta abrangente, não uma exigência de implementação simultânea. Tabelas como `sessions`, `process_watchers`, `feedback` e `api_idempotency_keys` podem ser opcionais, dependendo das decisões de arquitetura. Validar o modelo e as políticas com o hospital antes de guardar dados reais.
