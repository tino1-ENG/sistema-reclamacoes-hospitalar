# HospitalCare — Manual de Operação e Guia do Utilizador
**Hospital Central de Maputo (HCM) — Moçambique**  
*Versão 1.0.0 — Outubro de 2026*

---

## 1. Visão Geral e Perfis de Acesso

O **HospitalCare** é uma plataforma integrada de gestão da experiência e atendimento hospitalar, concebida para aproximar utentes, equipas clínicas, supervisores de triagem e a administração hospitalar do Hospital Central de Maputo.

### Matriz de Credenciais de Demonstração

| Perfil | Nome do Colaborador / Utente | Identificador de Acesso | Palavra-passe | Departamento / Âmbito |
| :--- | :--- | :--- | :--- | :--- |
| **Paciente / Utente** | Maria Tembe | `+258 84 123 4567` | `123456` | Portal do Utente |
| **Paciente / Utente** | Joaquim Chissano | `+258 82 987 6543` | `123456` | Portal do Utente |
| **Funcionário (Médico)** | Dr. Carlos Mondlane | `carlos.mondlane@hcm.gov.mz` | `123456` | Pediatria (`PED`) |
| **Funcionário (Médica)** | Dra. Fátima Da Silva | `fatima.silva@hcm.gov.mz` | `123456` | Medicina Geral (`MED`) |
| **Funcionário (Admin)** | Amélia Cossa | `amelia.cossa@hcm.gov.mz` | `123456` | Farmácia Central (`FAR`) |
| **Supervisora de Triagem** | Enfª. Ana Bila | `ana.bila@hcm.gov.mz` | `123456` | Triagem e Gestão de SLA |
| **Administrador de TI** | Engº. Rui Nhantumbo | `rui.nhantumbo@hcm.gov.mz` | `123456` | Gestão Global e Segurança |

---

## 2. Guia do Utente / Paciente

### 2.1 Criar Conta e Autenticar
1. Aceda a [http://localhost:9000/#/auth/login](http://localhost:9000/#/auth/login).
2. No separador **"Sou Paciente"**, introduza o seu telemóvel nacional moçambicano no formato `+258 8x xxx xxxx` e a palavra-passe.
3. Caso não possua conta, selecione **"Criar Nova Conta"**, preenchendo o seu nome completo, telefone e palavra-passe.

### 2.2 Submissão de Novo Processo Hospitalar
1. No menu principal ou no painel de boas-vindas, clique em **"Nova Reclamação ou Sugestão"**.
2. Selecione o tipo de solicitação:
   * **Reclamação:** Relato de anomalia, demora ou conduta inadequada.
   * **Esclarecimento:** Dúvida sobre diagnósticos, procedimentos ou faturação.
   * **Sugestão:** Ideia de melhoria para os serviços do hospital.
3. Escolha o **Departamento Hospitalar** envolvido (ex: *Urgência Pediátrica*, *Consultas Externas*, *Farmácia*) e a respetiva **Categoria**.
4. Descreva a situação de forma clara. Pode optar por manter o processo **Anónimo**.
5. Ao submeter, o sistema gerará:
   * **Código de Referência Único:** formato `#HC-2026-XXXXXX`.
   * **PIN Secreto de Consulta:** código de 4 dígitos para acompanhamento público.
   * *Atenção:* Anote o seu PIN em local seguro.

### 2.3 Consulta Pública sem Necessidade de Início de Sessão
1. Aceda a [http://localhost:9000/#/public/tracking](http://localhost:9000/#/public/tracking).
2. Introduza o código `#HC-2026-XXXXXX` e o PIN de 4 dígitos.
3. Visualize em tempo real o estado de resolução, o histórico de etapas e as respostas da direção clínica.

### 2.4 Avaliação de Atendimento (Feedback)
Quando o processo passar ao estado `ANSWERED` ou `CLOSED`, o utente pode classificar a experiência com uma pontuação de 1 a 5 estrelas e adicionar um comentário de satisfação.

---

## 3. Guia do Funcionário Clínico e Administrativo

### 3.1 Painel de Processos do Departamento
1. Inicie sessão no separador **"Colaborador HCM"** com o seu email institucional `@hcm.gov.mz`.
2. Aceda à secção **"Processos"**: a lista filtra automaticamente os processos atribuídos a si ou ao seu departamento.
3. A grelha apresenta alertas de prioridade (*Crítica*, *Alta*, *Normal*, *Baixa*) e contagem decrescente para o cumprimento do SLA.

### 3.2 Resposta ao Utente vs. Regra de Ouro de Confidencialidade
1. Abra a ficha detalhada do processo.
2. Na secção de comunicação:
   * **Resposta Oficial ao Utente:** Mensagem pública visível para o paciente no portal e na consulta pública.
   * **Nota Interna Confidencial:** Ao marcar a opção *"Nota Interna Confidencial"*, a mensagem é gravada em canal encriptado e reservado.
   * **REGRA INVIOLÁVEL:** As notas internas contendo diagnósticos sensíveis, escalas médicas ou avaliações de conduta interna **NUNCA** são visíveis ou transmitidas a qualquer utente/paciente.

### 3.3 Alteração de Estado do Processo
Para mudar o estado de um processo (ex: de `ASSIGNED` para `IN_REVIEW` ou `WAITING_PATIENT`), o colaborador deve obrigatoriamente preencher uma **justificação fundamentada**, garantindo transparência no registo de auditoria.

---

## 4. Guia da Supervisora de Triagem e SLA

### 4.1 Monitorização Operacional em Tempo Real
1. Aceda ao separador **"Dashboard Operacional"**.
2. Monitore:
   * Taxa de cumprimento de prazos SLA (Tempo Médio de Resposta).
   * Processos em risco de expiração ou atrasados.
   * Índice de satisfação média dos utentes do Hospital Central de Maputo.

### 4.2 Reatribuição Operacional de Processos
1. No detalhe do processo, clique no botão **"Reatribuir"**.
2. Selecione o profissional de saúde responsável no departamento adequado.
3. Registe a fundamentação da reatribuição (ex: *"Reatribuído ao médico-chefe por exigir parecer da especialidade"*).

---

## 5. Guia do Administrador do Sistema

### 5.1 Catálogos Hospitalares
1. **Departamentos:** Criação e parametrização de contactos, extensões e horários de funcionamento dos pavilhões do HCM.
2. **Categorias e Prazos SLA:** Configuração do número de horas máximo para primeira resposta e resolução definitiva (ex: 12h para emergências, 48h para esclarecimentos).
3. **Base de Conhecimento (FAQs):** Publicação de perguntas frequentes para autoajuda dos cidadãos.

### 5.2 Auditoria Integral e Segurança
* Todos os eventos do sistema (autenticação, criação de processos, transições de estado, reatribuições) geram registos imutáveis na coleção `auditlogs`.
* O administrador pode pesquisar o rastro de qualquer ação com data, hora de Maputo e identificador do utilizador.

---

## 6. Procedimentos de Suporte Técnico e TI

### 6.1 Backups da Base de Dados MongoDB
Para efetuar uma cópia de segurança completa dos dados hospitalares:
```bash
mongodump --uri="mongodb://127.0.0.1:27017/hospitalcare" --out=/var/backups/hospitalcare/$(date +%F)
```

### 6.2 Restauração de Dados
Para restaurar a base de dados a partir de uma cópia de segurança:
```bash
mongorestore --uri="mongodb://127.0.0.1:27017/hospitalcare" --drop /var/backups/hospitalcare/YYYY-MM-DD/hospitalcare
```

### 6.3 Verificação de Saúde do Sistema
O endpoint de monitorização deve ser configurado no Prometheus, Uptime Kuma ou similar:
* **URL:** `http://localhost:5000/health`
* **Resposta esperada:** `{"status": "ok", "system": "HospitalCare Backend", "location": "Moçambique (Africa/Maputo)"}`
