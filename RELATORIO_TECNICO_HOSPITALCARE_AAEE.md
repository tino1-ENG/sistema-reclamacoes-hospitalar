# ACADEMIA DE ALTOS ESTUDOS ESTRATÉGICOS (AAEE)
## LICENCIATURA EM ENGENHARIA INFORMÁTICA E CIBERSEGURANÇA
### CADEIRA: DESENVOLVIMENTO DE APLICAÇÃO

---

# RELATÓRIO TÉCNICO DO SISTEMA DE GESTÃO DE RECLAMAÇÕES HOSPITALARES
**Projecto:** HospitalCare — Sistema de Gestão de Reclamações, Elogios e Sugestões Hospitalares  
**Instituição Piloto:** Hospital Central de Maputo (HCM)  
**Discente:** Tino Eduardo  
**Docentes:** Eng. Frank Lopes | Eng. Jose  
**Local e Data:** Maluana, Novembro de 2026  

---

## 1. INTRODUÇÃO

A prestação de cuidados de saúde numa unidade de nível terciário e quaternário envolve um conjunto complexo de interações diárias entre utentes, corpo clínico, equipas de enfermagem e serviços de apoio administrativo. No contexto do **Hospital Central de Maputo (HCM)**, o maior centro hospitalar de Moçambique, a gestão do acolhimento, o tratamento de reclamações, o acolhimento de sugestões e o reconhecimento de elogios assumem um papel preponderante na salvaguarda dos direitos dos pacientes, na humanização do atendimento e na melhoria contínua da qualidade hospitalar. Contudo, a persistência de processos manuais assentes em livros físicos de reclamações ou caixas de sugestões dispersas revela-se manifestamente insuficiente, originando extravio de manifestações, morosidade na tramitação e, acima de tudo, a relutância dos cidadãos em reportar irregularidades por receio justificado de retaliação ou quebra de confidencialidade.

Neste contexto, foi desenvolvido o **HospitalCare — Sistema de Gestão de Reclamações, Elogios e Sugestões Hospitalares**. Trata-se de uma plataforma digital institucional, concebida segundo os mais rigorosos preceitos de Engenharia de Software e Cibersegurança, que proporciona um canal transparente, auditável e 100% confidencial para os utentes do HCM. O sistema integra funcionalidades de submissão anónima ou identificada, encriptação de ponta a ponta, rastreio público através de Código de Referência (`#HC-2026-XXXX`) e código PIN de 4 dígitos, tramitação interna departamental e assistência analítica baseada em Inteligência Artificial Híbrida (on-premises local com Ollama e cloud em contingência).

O presente relatório técnico descreve de forma pormenorizada a fundamentação do projecto, a problemática identificada, a relevância e impacto da solução, os objectivos delineados e as tecnologias mobilizadas para o frontend e backend. São igualmente apresentadas a estrutura da base de dados, a arquitectura de segurança e IA, bem como a matriz exaustiva de implementação e validação dos requisitos funcionais e não-funcionais que sustentam a defesa prática da aplicação.

---

## 2. IDENTIFICAÇÃO E CONTEXTUALIZAÇÃO DO PROJECTO

O projecto tem a designação **HospitalCare — Sistema de Gestão de Reclamações, Elogios e Sugestões Hospitalares** e consiste numa aplicação integrada orientada à modernização dos canais de auscultação do utente e suporte à governação clínica. A solução foi especificamente projectada para o **Hospital Central de Maputo (HCM)**, situado na Avenida Eduardo Mondlane, na cidade de Maputo, capital de Moçambique.

A arquitectura técnica do sistema adopta o paradigma de Single-Page Application (SPA) com características de Progressive Web App (PWA), comunicando de forma assíncrona com um servidor central através de uma API RESTful estruturada. A persistência dos dados é gerida pelo MongoDB, assegurando escalabilidade e modelação documental flexível. O sistema incorpora ainda um componente inovador de Inteligência Artificial Híbrida, composto por um motor local on-premises (executado via Ollama com o modelo institucional `qwen3.5:latest`) e um provedor secundário em nuvem (Google Gemini 1.5 Flash), além de um motor residente de conhecimento do HCM no próprio cliente para funcionamento sem falhas (*zero-fail*).

O HospitalCare estrutura-se operacionalmente em dois pilares essenciais:
1. **Canal Público do Utente:** Faculta a submissão anónima ou identificada de ocorrências, consulta em tempo real por Código e PIN e suporte conversacional do assistente virtual "Acolhe HospitalCare".
2. **Backoffice de Gestão Hospitalar:** Reservado ao pessoal de triagem (Gabinete do Utente), supervisores departamentais e Direcção Clínica do HCM, viabilizando o despacho de processos, monitoria de SLAs com semáforos visuais, atribuição de pareceres e auditoria do sistema.

---

## 3. PROBLEMA IDENTIFICADO

A análise diagnóstica realizada aos fluxos tradicionais de auscultação e tratamento de ocorrências no Hospital Central de Maputo revelou diversas fragilidades críticas decorrentes da dependência de meios físicos e processos não articulados:

* **Vulnerabilidade física e extravio de processos:** O recurso a cadernos de ocorrências, livros de reclamações e folhas avulsas favorece a perda acidental ou a destruição deliberada de registos, comprometendo a transparência e impedindo a elaboração de séries históricas fidedignas sobre a qualidade dos serviços prestados.
* **Medo de represálias e inibição da denúncia:** Em meio hospitalar, os utentes demonstram forte apreensão em formalizar queixas de negligência médica, mau atendimento, cobranças ilícitas ou falta de medicamentos quando obrigados a revelar a sua identidade. A ausência de garantias técnicas de anonimato bloqueia o fluxo de informação indispensável à correcção de falhas deontológicas e operacionais.
* **Morosidade crítica na resposta a situações de urgência:** Processos graves que requerem intervenção imediata — como roturas agudas na Farmácia Central ou incidentes no Banco de Socorros — demoram dias ou semanas a chegar ao conhecimento das chefias competentes, em virtude da ausência de canais directos de tramitação digital e alertas de tempo limite (SLA).
* **Falta de feedback e opacidade perante o cidadão:** O utente que submete uma reclamação raramente dispõe de meios para acompanhar o estágio da sua manifestação, gerando uma percepção de impunidade e ineficácia institucional.
* **Sobrecarga e perda de produtividade dos funcionários:** A análise manual e a redação de despachos sobre centenas de ocorrências dispersas consome tempo precioso das equipas clínicas, que poderiam beneficiar de ferramentas automatizadas de categorização, sumarização executiva e propostas de resposta institucional.

Assim, o problema central consiste na inexistência de uma plataforma digital segura, célere e confidencial que una os cidadãos à governação do HCM, garantindo o tratamento ético das manifestações com apoio analítico inteligente.

---

## 4. JUSTIFICATIVA

O desenvolvimento do HospitalCare justifica-se pelo imperativo de conferir dignidade, rigor e transparência ao ecossistema de saúde pública de Moçambique, alinhando a prática hospitalar do HCM com as metas nacionais de transformação digital e os padrões internacionais de Cibersegurança e Protecção de Dados Sensíveis.

Do ponto de vista da **Cibersegurança**, a solução diferencia-se pela adopção de um modelo de privacidade por conceção (*Privacy by Design*). Ao facultar a opção de denúncia estritamente anónima, apoiada na geração criptográfica de Código de Referência (`#HC-2026-XXXX`) e PIN de 4 dígitos com hash Bcrypt, o utente tem a garantia inviolável de que a sua identidade física e número de telefone jamais serão acoplados ao relato, eliminando em absoluto o risco de represálias.

Sob a perspectiva da **Gestão Hospitalar**, a digitalização e centralização das ocorrências permite à Direcção Clínica e ao Gabinete do Utente monitorizar em tempo real mapas de calor de reclamações por sector (ex: Urgência Geral versus Farmácia Central), controlar o cumprimento estrito das políticas de SLA e valorizar o mérito profissional através da canalização estruturada de elogios aos médicos e enfermeiros.

A inclusão de **Inteligência Artificial Híbrida Local** consolida a soberania e segurança dos dados clínicos: o processamento primário ocorre em servidores on-premises no território nacional, passando por uma camada mandatória de higienização (*Data Scrubbing*) que expurga quaisquer menções acidentais a NUIT, BI ou dados nominais antes de qualquer inferência.

---

## 5. DEFINIÇÃO DA SOLUÇÃO

Em resposta às debilidades diagnosticadas, propõe-se uma plataforma web integrada de elevada disponibilidade, composta por módulos integrados de recepção, triagem, apoio à decisão e acompanhamento seguro.

* **Canal Público:** O utente é acolhido por uma interface intuitiva onde pode submeter reclamações, denúncias, pedidos de esclarecimento ou elogios. O utente escolhe entre a modalidade Anónima (sem recolha de identificadores) ou Identificada (com notificação por email/contacto). No término do registo, o sistema devolve o Código de Acompanhamento e o respectivo PIN de 4 dígitos. A qualquer instante, o cidadão pode introduzir estas credenciais no portal para visualizar a linha do tempo do processo, o departamento incumbido e a resposta homologada pela Direcção.
* **Assistente Virtual "Acolhe HospitalCare":** Capaz de esclarecer dúvidas sobre os serviços da unidade sanitária (ex: localização e triagem de Manchester da Urgência Geral, levantamento de receitas na Farmácia Central e procedimentos para consulta de processos) com latência imperceptível (0 a 30 ms).
* **Backoffice Hospitalar:** Os colaboradores acedem a um ambiente diferenciado por Controlo de Acesso Baseado em Papéis (RBAC). O pessoal do Gabinete do Utente (STAFF) valida e encaminha as ocorrências para os respectivos departamentos; as chefias de serviço (SUPERVISOR) redigem pareceres técnicos e respostas oficiais, monitorizando prazos com auxílio de semáforos de SLA; os Administradores de Sistema (ADMIN) gerem o parque de utilizadores, unidades hospitalares, categorias, políticas de prazo e consultam a trilha imutável de auditoria.

---

## 6. OBJECTIVOS

### 6.1. Objectivo geral
Desenvolver e implementar um Sistema Integrado de Gestão de Reclamações, Elogios e Sugestões Hospitalares (HospitalCare) para o Hospital Central de Maputo, que assegure total confidencialidade, rastreio transparente por código e PIN, celeridade na tramitação departamental e assistência analítica baseada em Inteligência Artificial Híbrida segura.

### 6.2. Objectivos específicos
1. Identificar e mapear os fluxos operacionais de recepção, despacho e resolução de manifestações nos principais serviços do Hospital Central de Maputo (Urgência Geral, Farmácia Central, Pediatria, Maternidade e Consultas Externas).
2. Desenvolver uma interface web acessível, responsiva (PWA) e intuitiva para o público, possibilitando a submissão de ocorrências em regime anónimo ou identificado.
3. Implementar um mecanismo criptográfico robusto de geração de Código de Referência e PIN de 4 dígitos para garantir o acompanhamento público seguro sem necessidade de criação de conta prévia.
4. Construir uma API RESTful em Node.js e Express, assegurando a validação estrita de dados através de schemas Zod e a persistência relacional/documental no MongoDB.
5. Implementar um modelo rigoroso de Cibersegurança assente em Controlo de Acesso Baseado em Papéis (RBAC), autenticação por JSON Web Token (JWT com refresh tokens), hashing Bcrypt e protecção contra ameaças web comuns via Helmet e Rate Limiting.
6. Integrar uma arquitectura de IA Híbrida que execute inferências primárias localmente (Ollama com modelo qwen3.5) com prévia higienização de dados pessoais (Data Scrubbing), apoiada por contingência inteligente no cliente e nuvem.
7. Implementar o módulo analítico de apoio à equipa hospitalar para classificação automática, cálculo de urgência e sugestão de respostas oficiais baseadas em evidências.
8. Configurar um sistema de monitoria de acordos de nível de serviço (SLA) com alertas de expiração e uma trilha imutável de auditoria (*audit logs*) para fins de responsabilização institucional.

---

## 7. DESENVOLVIMENTO DO SISTEMA

O desenvolvimento do HospitalCare seguiu os padrões modernos de engenharia de software distribuída, estruturado numa separação clara entre a camada de apresentação (Frontend SPA/PWA) e a camada de serviços e dados (Backend API). A segurança da informação e a resiliência operacional nortearam todas as decisões arquitecturais.

### 7.1. Organização funcional do Hospital Central de Maputo

| Unidade / Serviço Hospitalar | Capacidade ou Organização Operacional | Função no Sistema HospitalCare |
| :--- | :--- | :--- |
| **Urgência Geral (Banco de Socorros)** | Atendimento contínuo 24/7 com Triagem de Manchester (vermelho, laranja e amarelo) | Recepção de manifestações de alta prioridade clínica; encaminhamento célere para intervenção da chefia de equipa. |
| **Farmácia Central e Depósitos** | Gestão de stocks e dispensa de medicação prescrita para ambulatório e enfermarias | Registo e auditoria de ocorrências relativas a roturas de stock, morosidade no aviamento de receitas e retenção indevida. |
| **Pediatria e Neonatologia** | Enfermarias infantis, berçário e cuidados intensivos pediátricos | Acompanhamento de processos de atendimento humanizado infantil e suporte ético aos progenitores e tutores. |
| **Maternidade e Obstetrícia** | Bloco de partos, cuidados pré-natais, puerpério e urgência obstétrica | Tratamento de queixas e elogios de elevada sensibilidade clínica, com garantia de sigilo reforçado para a utente. |
| **Consultas Externas** | Especialidades médicas, cirúrgicas, agendamentos e arquivo clínico | Gestão de ocorrências sobre cumprimento de horários, perda de processos clínicos e remarcações. |
| **Gabinete do Utente e Direcção** | Corpo de inspecção hospitalar, supervisores clínicos e Direcção Geral | Supervisão global, emissão de despachos oficiais homologados, auditoria de prazos de SLA e definição de directrizes. |

### 7.2. Tecnologias do frontend

A camada de frontend foi concebida com foco em acessibilidade universal, responsividade e rapidez de interacção:
* **Vue.js 3 e TypeScript:** Utilização da Composition API para estruturação limpa de componentes reativos e tipagem estrita de modelos de dados, mitigando falhas de runtime.
* **Quasar Framework (v2.35):** Fornece elementos Material Design robustos (formulários, tabelas com paginação assíncrona, caixas de diálogo, notificações flutuantes e grelha responsiva).
* **Pinia:** Gestor de estado global reactivo para controlo da sessão JWT, dados do utilizador e preferências de interface.
* **Vite:** Compilador e empacotador de última geração, responsável pelo code-splitting, otimização de feixes e compilação ágil.
* **PWA (Progressive Web App):** Manifesto e Service Worker com Workbox para caching estático e funcionamento resiliente.
* **Motor Residente de Conhecimento:** Módulo em memória no cliente que responde a dúvidas frequentes do HCM em 0 ms, garantindo acolhimento contínuo mesmo com conectividade nula.

### 7.3. Tecnologias do backend

* **Node.js (ESM) e Express 4:** Servidor HTTP modular em TypeScript com arquitectura em camadas (Controllers, Services, Middlewares, Repositories).
* **Zod Schemas:** Validação de payloads de entrada no limiar da requisição, garantindo tipagem segura e prevenindo ataques de injecção.
* **Pino Logger:** Registo assíncrono de alto rendimento com formatação estruturada para observabilidade em tempo real.
* **Swagger UI / OpenAPI 3.0:** Documentação interactiva de todas as rotas expostas em `/api/docs`.

### 7.4. Base de dados (MongoDB & Mongoose)

| Colecção (Collection) | Informação Armazenada | Finalidade no Sistema |
| :--- | :--- | :--- |
| `processes` | Código (`#HC`), PIN (hash Bcrypt), tipo, departamento, categoria, status, prioridade, prazos SLA e timeline | Registo e acompanhamento integral do ciclo de vida das ocorrências. |
| `users` | Nome completo, email institucional, palavra-passe (hash Bcrypt), papel RBAC, departamento e status | Gestão segura das contas dos funcionários e administradores do HCM. |
| `departments` | Nome do serviço, código institucional, descrição, responsável clínico e estado ativo | Mapeamento hierárquico e roteamento interno das ocorrências. |
| `categories` | Denominação da categoria, descrição, departamento correspondente e nível de criticidade | Taxonomia temática para classificação precisa dos relatos. |
| `sla_policies` | Tipo de manifestação, prioridade, tempo máximo de resposta preliminar e final em horas | Automatização dos alertas e controlo de cumprimento dos prazos legais. |
| `audit_logs` | ID do utilizador, ação executada, recurso, endereço IP, timestamp e diff de dados | Trilha imutável de auditoria forense e conformidade de cibersegurança. |
| `ai_chat_sessions` | Identificador de sessão, mensagens higienizadas, modelo utilizado e timestamps | Manutenção do contexto conversacional do assistente virtual de acolhimento. |

### 7.5. Inteligência Artificial e Comunicação / Resiliência

* **Camada Local Primária (On-Premises):** Integração directa com o Ollama local (porta 11434) executando o modelo `qwen3.5:latest` (9.7B parâmetros). Os dados sensíveis dos utentes permanecem dentro dos servidores físicos do hospital, garantindo soberania nacional.
* **Higienização Compulsória de Dados (Data Scrubbing):** Antes de qualquer inferência, o serviço expurga dados de identificação pessoal (PII) através de regex, convertendo números de BI, NUIT, telefones e nomes próprios em marcadores anónimos.
* **Camada Fast-Pass Institucional:** Perguntas de alta frequência sobre localização, triagem de Manchester, farmácia e consulta de processos são respondidas pelo motor rápido em menos de 30 ms.
* **Mecanismo de Acompanhamento Criptográfico:** Acesso público via Código `#HC-2026-XXXX` e PIN de 4 dígitos verificado com hash Bcrypt, dispensando emails ou credenciais públicas.

### 7.6. Segurança, cibersegurança e validação

1. **Protecção Criptográfica de Palavras-passe e PINs:** Hashing irreversível com Bcrypt (salt rounds 10).
2. **Autenticação e Sessão JWT:** Tokens de acesso de curta duração (15m) combinados com tokens de renovação (7 dias).
3. **Controlo de Acesso Baseado em Papéis (RBAC):** Restrição estrita com quatro perfis: `UTENTE`, `STAFF`, `SUPERVISOR` e `ADMIN`.
4. **Defesa Perimetral e Cabeçalhos HTTP:** Helmet habilitado e Rate Limiting configurado para proteger contra abusos e ataques de força bruta.
5. **Auditoria Forense Imutável:** Registo automático de todas as operações administrativas e de tramitação na colecção `audit_logs`.

---

## 8. IMPLEMENTAÇÃO E VERIFICAÇÃO DOS REQUISITOS

### 8.1. Funcionalidades do frontend

| N.º | Requisito Verificado | Implementação Descrita |
| :---: | :--- | :--- |
| **1** | Autenticação Institucional | Login e logout com tokens JWT, persistência no LocalStorage e auto-logout em expiração. |
| **2** | Rotas Protegidas por Papel | Guarda de navegação no Vue Router que valida o perfil RBAC e redireciona tentativas não autorizadas. |
| **3** | Submissão Anónima e Identificada | Formulário em passos com validação em tempo real e chaveamento entre anonimato estrito e registo contactável. |
| **4** | Consulta Segura com Código e PIN | Ecrã público de rastreio de processos onde a introdução de código e PIN de 4 dígitos desbloqueia o progresso. |
| **5** | Assistente Virtual de Acolhimento | Widget flutuante reativo (Acolhe HospitalCare) com suporte a sugestões rápidas e motor de IA. |
| **6** | Painel de Gestão Operacional | Tabela reactiva com filtros avançados por departamento, criticidade, tipo e paginação assíncrona. |
| **7** | Gestão Administrativa (CRUD) | Interfaces de cadastro, edição, desativação e listagem de utilizadores, departamentos e categorias. |
| **8** | Responsividade Multiplataforma | Adaptação automática para ecrãs móveis, tablets e monitores desktop com o Quasar Grid System. |
| **9** | Acessibilidade Universal (WCAG) | Rótulos ARIA, suporte a navegação por teclado e contraste de cores auditado pelo Google Lighthouse (96/100). |
| **10** | Capacidades PWA e Instalação | Web App Manifest e Service Worker com Workbox permitindo instalação da aplicação como app nativa. |
| **11** | Operação Resiliente sem Rede | Motor residente de conhecimento HCM no cliente para esclarecimento de processos mesmo sem conectividade. |
| **12** | Trilha de Auditoria no Ecrã | Visualizador de logs administrativos com pesquisa em tempo real por utilizador, acção e data. |

### 8.2. Funcionalidades do backend

| N.º | Requisito Verificado | Implementação Descrita |
| :---: | :--- | :--- |
| **1** | Regras de Negócio e SLAs | Cálculo automático de prazos de resolução conforme a criticidade (24h para Urgência e 5 dias para rotina). |
| **2** | Higienização de Dados (PII) | Módulo de data scrubbing com regex para ofuscação compulsória de nomes, BIs, NUITs e telefones. |
| **3** | Códigos HTTP RESTful | Tratamento canónico de códigos de status (200, 201, 400, 401, 403, 404, 409, 422, 500) em todas as rotas. |
| **4** | Protecção de Rotas com JWT | Middleware de intercepção e verificação de assinatura do cabeçalho `Authorization: Bearer <token>`. |
| **5** | Autorização Granular (RBAC) | Middleware com verificação estrita de papéis (ex: `authorize(['ADMIN', 'SUPERVISOR'])`). |
| **6** | Criptografia de Senhas e PINs | Hashing unidireccional de credenciais com salt rounds 10 usando a biblioteca Bcrypt. |
| **7** | Rate Limiting e Helmet | Limitação de taxa contra abusos de força bruta e cabeçalhos HTTP defensivos para proteção web. |
| **8** | Validação com Schemas Zod | Verificação rigorosa de tipos, campos mandatórios e formatos em todas as entradas de dados. |
| **9** | Índices e Restrições Únicas | Índices únicos em `referenceNumber`, `email` e índices compostos para aceleração de buscas no MongoDB. |
| **10** | Motor Híbrido de IA com Fallback | Roteamento inteligente entre Ollama Local (qwen3.5), Gemini 1.5 Flash e conhecimento institucional. |
| **11** | Documentação OpenAPI / Swagger | Catálogo interactivo de endpoints em `/api/docs` para validação e testes integrados. |

---

## 9. CONSIDERAÇÕES SOBRE A DEMONSTRAÇÃO E DEFESA

A sessão de demonstração prática e defesa do HospitalCare perante o corpo docente foi estruturada em duas partes complementares:

### 9.1. Demonstração do Frontend
* **Registo de Manifestação Real:** Submissão de uma reclamação sobre a Farmácia Central, optando por envio anónimo e demonstrando a geração em tempo real do Código `#HC-2026-XXXX` e PIN de 4 dígitos.
* **Consulta por Código e PIN:** Acedimento ao ecrã de consulta, inserção das credenciais e visualização do estado e histórico.
* **Assistente Virtual "Acolhe HospitalCare":** Realização de perguntas sobre localização da Urgência Geral e acompanhamento de processos, demonstrando a resposta imediata em milissegundos.
* **Sessão Administrativa e Tramitação:** Login com credenciais de Administrador (`rui.nhantumbo@hcm.gov.mz`) e Supervisor (`ana.bila@hcm.gov.mz`), demonstrando a triagem, reatribuição e emissão de parecer final.
* **Responsividade e PWA:** Demonstração do layout adaptado em ecrã móvel simulado e comportamento de cache.

### 9.2. Demonstração do Backend
* **Swagger e Endpoints REST:** Execução de requisições directas em `http://localhost:5000/api/docs`.
* **Validação de Entrada com Zod:** Envio intencional de payloads inválidos e demonstração das respostas de erro semânticas HTTP 400/422.
* **Segurança e RBAC:** Tentativa de acesso a rotas administrativas sem token ou com perfil de utente, comprovando o bloqueio HTTP 401/403.
* **Base de Dados MongoDB:** Inspecção das colecções de processos e utilizadores via MongoDB Shell/Compass.
* **Auditoria Forense e PII Scrubbing:** Verificação dos logs do Pino comprovando a ofuscação de dados pessoais antes da chamada ao modelo de Inteligência Artificial.

---

## 10. CONCLUSÃO

O desenvolvimento do **HospitalCare — Sistema de Gestão de Reclamações, Elogios e Sugestões Hospitalares** respondeu com eficácia e rigor científico à necessidade premente de modernização dos mecanismos de acolhimento e governação clínica no Hospital Central de Maputo. A substituição dos suportes em papel por uma plataforma web resiliente, intuitiva e auditável elimina o risco de extravio de manifestações e confere voz ao cidadão moçambicano, assegurando-lhe a garantia inviolável do anonimato através de mecanismos criptográficos de Código de Referência e PIN de 4 dígitos.

A articulação tecnológica entre Vue.js 3, Quasar Framework, TypeScript, Node.js, Express, MongoDB e a arquitectura pioneira de Inteligência Artificial Híbrida Soberana (on-premises via Ollama com qwen3.5) demonstra a viabilidade de implementar soluções tecnológicas de elevado padrão internacional adaptadas à realidade das infraestruturas locais de Moçambique, conciliando inovação com preservação intransigente da privacidade dos dados médicos.

Como perspectivas de trabalho futuro, preconiza-se a integração do HospitalCare com os sistemas de registo em saúde do Ministério da Saúde (MISAU / SIS-MA), a disponibilização de gateways de SMS institucionais para alerta a cidadãos sem acesso a dados móveis e a evolução do copiloto analítico com modelos preditivos para prevenção precoce de crises de stock farmacêutico e sobrelotação de enfermarias.
