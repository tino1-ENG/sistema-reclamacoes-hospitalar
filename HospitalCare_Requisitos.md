# HospitalCare — Documento de Requisitos do Sistema

**Versão:** 1.0  
**Estado:** Documento inicial de requisitos  
**Âmbito:** Sistema de gestão de reclamações e pedidos de esclarecimento para um hospital piloto  
**Idioma:** Português

---

## 1. Introdução

### 1.1. Objetivo do documento

Este documento descreve os requisitos funcionais e não funcionais do HospitalCare, um sistema destinado a facilitar o registo, acompanhamento, tratamento e resolução de reclamações e pedidos de esclarecimento apresentados por pacientes de um hospital.

O documento serve como referência para o levantamento de requisitos, validação com os responsáveis do hospital, desenho das interfaces, desenvolvimento, testes e aceitação do sistema.

### 1.2. Contexto e problema

Os hospitais podem receber reclamações e pedidos de esclarecimento relacionados com atendimento, marcações, serviços, comunicação, instalações e outros aspetos da experiência do paciente. Quando esses processos são geridos manualmente ou através de canais dispersos, pode ser difícil acompanhar o estado de cada caso, identificar o responsável, manter um histórico e prestar uma resposta dentro do prazo esperado.

O HospitalCare pretende centralizar esses processos num único sistema, permitindo que os pacientes acompanhem os seus casos e que os colaboradores autorizados façam a triagem, encaminhamento, análise e resposta.

### 1.3. Objetivo geral

Disponibilizar um sistema que permita registar, acompanhar, encaminhar e gerir reclamações e pedidos de esclarecimento, promovendo transparência, organização, rastreabilidade e melhoria do atendimento hospitalar.

### 1.4. Objetivos específicos

- Permitir o registo e a autenticação de pacientes.
- Permitir a submissão de reclamações e pedidos de esclarecimento.
- Disponibilizar um código de referência para cada processo.
- Permitir o acompanhamento do estado dos processos.
- Facilitar a comunicação entre o paciente e o hospital.
- Permitir que os colaboradores tratem os processos que lhes forem atribuídos.
- Disponibilizar ferramentas de supervisão, administração e geração de relatórios.
- Manter um histórico das principais ações realizadas no sistema.
- Proteger os dados pessoais e limitar o acesso às informações de acordo com as funções dos utilizadores.

### 1.5. Âmbito

O sistema destina-se inicialmente a **um único hospital piloto**. A configuração deverá permitir identificar o hospital e organizar os serviços, departamentos ou áreas responsáveis pelo tratamento dos processos.

O âmbito inclui:

- Área pública de informação.
- Portal do paciente.
- Painel dos colaboradores responsáveis pelo tratamento.
- Painel de supervisão.
- Painel de administração.
- Gestão de reclamações e pedidos de esclarecimento.
- Comunicação e notificações.
- Relatórios e auditoria.

A integração com sistemas clínicos, sistemas de faturação, plataformas externas de mensagens ou serviços de identidade não é considerada obrigatória para a primeira versão. Poderá ser avaliada numa fase posterior.

### 1.6. Termos e definições

| Termo | Definição |
|---|---|
| Reclamação | Manifestação formal de insatisfação sobre um serviço, atendimento, situação ou experiência hospitalar. |
| Pedido de esclarecimento | Solicitação de informação ou explicação sobre um serviço, procedimento administrativo ou situação relacionada com o hospital. |
| Processo | Registo criado no sistema para acompanhar uma reclamação ou pedido de esclarecimento. |
| Paciente | Pessoa que cria e acompanha os seus próprios processos. |
| Colaborador | Utilizador autorizado a analisar e tratar processos. |
| Supervisor | Utilizador que acompanha o trabalho da equipa, distribui processos e monitoriza prazos. |
| Administrador | Utilizador que configura o sistema e gere contas, permissões e parâmetros. |
| Histórico | Registo cronológico dos eventos relevantes de um processo. |
| Notificação | Aviso enviado ao utilizador sobre um evento relevante. |

---

## 2. Partes interessadas e perfis de utilizador

### 2.1. Paciente

É o utilizador externo que pretende apresentar uma reclamação ou solicitar um esclarecimento.

Pode:
- Criar uma conta.
- Confirmar o número de telefone, quando esse mecanismo estiver disponível.
- Iniciar sessão e recuperar o acesso.
- Criar e consultar os seus processos.
- Responder a pedidos de informação do hospital.
- Consultar mensagens, estados e histórico visível.
- Avaliar o atendimento após o encerramento, caso essa funcionalidade seja ativada.

Não pode consultar processos pertencentes a outros pacientes nem aceder a notas internas do hospital.

### 2.2. Colaborador

É o utilizador interno responsável pela análise e tratamento dos processos que lhe forem atribuídos.

Pode:
- Consultar a lista dos processos sob a sua responsabilidade.
- Abrir os detalhes de um processo autorizado.
- Atualizar o estado dentro das regras definidas.
- Solicitar informações adicionais ao paciente.
- Enviar respostas oficiais ao paciente.
- Registar notas internas.
- Consultar o histórico do processo.
- Encaminhar ou recomendar o encaminhamento de um processo, conforme as permissões atribuídas.

Não pode gerir contas de administrador nem alterar configurações globais sem autorização específica.

### 2.3. Supervisor

É o utilizador responsável por acompanhar a operação e a qualidade do tratamento dos processos.

Pode:
- Consultar processos da área ou equipa sob a sua supervisão.
- Atribuir ou reatribuir processos a colaboradores autorizados.
- Monitorizar prazos e processos pendentes.
- Identificar processos atrasados ou sem responsável.
- Solicitar atualização de processos.
- Escalar casos que exijam atenção superior.
- Consultar relatórios operacionais.
- Rever processos e respostas quando as regras do hospital o exigirem.

### 2.4. Administrador

É o utilizador responsável pela configuração funcional do sistema.

Pode:
- Criar, ativar, desativar e atualizar contas internas.
- Atribuir perfis e permissões.
- Gerir departamentos, categorias e parâmetros.
- Configurar regras de funcionamento e prazos.
- Consultar registos de auditoria, dentro das permissões autorizadas.
- Gerir os dados institucionais apresentados no sistema.

A criação de contas internas é feita por um administrador autorizado. O registo público não deve permitir que uma pessoa se atribua um perfil interno.

### 2.5. Princípio de separação de funções

Cada utilizador só deve ter acesso às funções e aos dados necessários para desempenhar as suas responsabilidades. As permissões devem ser verificadas pelo sistema em todas as operações relevantes, e não apenas pela interface.

---

## 3. Requisitos funcionais

Os requisitos funcionais estão identificados com códigos únicos para facilitar a referência, o desenvolvimento e os testes.

## 3.1. Área pública

- **RF-PUB-001 — Página inicial:** O sistema deve apresentar uma página inicial com a identificação do hospital, uma explicação breve do HospitalCare e os serviços disponíveis.
- **RF-PUB-002 — Informação de utilização:** O sistema deve explicar como apresentar uma reclamação ou pedido de esclarecimento.
- **RF-PUB-003 — Perguntas frequentes:** O sistema deve permitir apresentar respostas a perguntas frequentes aprovadas pelo hospital.
- **RF-PUB-004 — Contactos institucionais:** O sistema deve apresentar os contactos e os canais oficiais do hospital definidos pela administração.
- **RF-PUB-005 — Acesso às contas:** O sistema deve disponibilizar opções de registo, início de sessão e recuperação de acesso.
- **RF-PUB-006 — Privacidade:** O sistema deve disponibilizar informação sobre o tratamento de dados pessoais e as regras de utilização.
- **RF-PUB-007 — Acessibilidade da informação:** A informação pública deve ser apresentada de forma legível e compreensível em dispositivos de diferentes dimensões.

## 3.2. Registo e autenticação do paciente

- **RF-AUT-001 — Registo de paciente:** O sistema deve permitir que uma pessoa crie uma conta de paciente através de um formulário.
- **RF-AUT-002 — Dados mínimos:** O formulário deve solicitar apenas os dados necessários para identificar e contactar o paciente e gerir a conta.
- **RF-AUT-003 — Validação dos campos:** O sistema deve validar os campos obrigatórios, os formatos e as regras de consistência antes de criar a conta.
- **RF-AUT-004 — Unicidade da conta:** O sistema deve impedir a criação de contas duplicadas com identificadores que devam ser únicos, como o número de telefone ou endereço de correio eletrónico, quando utilizado.
- **RF-AUT-005 — Confirmação do telefone:** O sistema deve permitir confirmar o número de telefone por código de verificação, caso o serviço de envio de códigos esteja configurado.
- **RF-AUT-006 — Expiração do código:** O código de verificação deve ter um período de validade e não deve poder ser reutilizado após a confirmação.
- **RF-AUT-007 — Limitação de tentativas:** O sistema deve limitar tentativas repetidas de verificação e autenticação para reduzir abusos.
- **RF-AUT-008 — Início de sessão:** O paciente deve conseguir iniciar sessão através das credenciais definidas.
- **RF-AUT-009 — Recuperação de acesso:** O sistema deve disponibilizar um processo seguro de recuperação ou redefinição das credenciais.
- **RF-AUT-010 — Terminar sessão:** O utilizador deve poder terminar a sessão de forma explícita.
- **RF-AUT-011 — Contas internas:** As contas de colaboradores, supervisores e administradores devem ser criadas ou autorizadas por um administrador, não através do registo público.
- **RF-AUT-012 — Bloqueio e desativação:** O sistema deve impedir o acesso de contas desativadas e aplicar medidas de proteção perante tentativas de acesso suspeitas.
- **RF-AUT-013 — Mensagens de erro seguras:** As mensagens de autenticação não devem revelar informação desnecessária que facilite a descoberta de contas ou credenciais.

## 3.3. Perfil do paciente

- **RF-PAC-001 — Consultar perfil:** O paciente deve poder consultar os dados associados à sua conta.
- **RF-PAC-002 — Atualizar dados permitidos:** O paciente deve poder alterar os dados de perfil autorizados pelo hospital.
- **RF-PAC-003 — Confirmar alterações sensíveis:** A alteração de dados de contacto usados para autenticação ou recuperação deve exigir confirmação adequada.
- **RF-PAC-004 — Consultar atividade:** O paciente deve poder consultar a lista dos seus processos e as respetivas atualizações.
- **RF-PAC-005 — Privacidade do perfil:** O paciente não deve conseguir consultar ou alterar o perfil de outro paciente.
- **RF-PAC-006 — Encerramento da conta:** O sistema deve disponibilizar um procedimento para solicitar a desativação da conta, sujeito às obrigações de conservação de registos aplicáveis.

## 3.4. Criação de reclamações e pedidos de esclarecimento

- **RF-PRC-001 — Seleção do tipo:** O utilizador deve poder selecionar se pretende apresentar uma reclamação ou um pedido de esclarecimento.
- **RF-PRC-002 — Formulário do processo:** O sistema deve apresentar um formulário adequado ao tipo de processo.
- **RF-PRC-003 — Categoria:** O utilizador deve poder selecionar uma categoria definida pelo hospital.
- **RF-PRC-004 — Departamento relacionado:** Quando aplicável, o utilizador deve poder indicar o serviço ou departamento relacionado com a situação.
- **RF-PRC-005 — Descrição:** O sistema deve permitir uma descrição clara da situação ou dúvida.
- **RF-PRC-006 — Data e contexto:** O sistema deve permitir indicar a data aproximada e outros detalhes relevantes, sem exigir informação clínica desnecessária.
- **RF-PRC-007 — Anexos:** Se a funcionalidade estiver ativada, o sistema deve permitir anexar documentos ou imagens em formatos e tamanhos autorizados.
- **RF-PRC-008 — Validação antes do envio:** O sistema deve validar os campos obrigatórios e os anexos antes de aceitar a submissão.
- **RF-PRC-009 — Confirmação do envio:** Depois da submissão bem-sucedida, o sistema deve apresentar uma confirmação ao paciente.
- **RF-PRC-010 — Código de referência:** Cada processo deve receber um código único de referência que permita identificá-lo.
- **RF-PRC-011 — Data de criação:** O sistema deve registar automaticamente a data e a hora de criação do processo.
- **RF-PRC-012 — Estado inicial:** O processo deve receber um estado inicial definido pelo fluxo de trabalho do hospital.
- **RF-PRC-013 — Proteção contra duplicação acidental:** O sistema deve reduzir a possibilidade de criação repetida do mesmo processo devido a cliques ou envios duplicados.
- **RF-PRC-014 — Confirmação de dados:** Antes de submeter, o paciente deve poder rever os dados introduzidos.
- **RF-PRC-015 — Separação de informação clínica:** O formulário deve informar o paciente para não incluir dados clínicos ou dados pessoais de terceiros que não sejam necessários à análise.

## 3.5. Consulta e acompanhamento pelo paciente

- **RF-SEG-001 — Lista de processos:** O paciente deve poder consultar os processos que criou.
- **RF-SEG-002 — Detalhes do processo:** O paciente deve poder abrir um processo e consultar a descrição, categoria, referência, datas e estado.
- **RF-SEG-003 — Estado atual:** O sistema deve apresentar o estado atual de forma clara.
- **RF-SEG-004 — Histórico visível:** O sistema deve apresentar ao paciente o histórico de atualizações que esteja autorizado a consultar.
- **RF-SEG-005 — Pesquisa por referência:** O paciente autenticado deve poder localizar um processo através do seu código de referência.
- **RF-SEG-006 — Filtros:** O paciente deve poder filtrar os seus processos por estado, tipo ou período, quando existirem vários processos.
- **RF-SEG-007 — Atualização de informação:** O paciente deve ser informado quando o hospital solicitar dados adicionais ou enviar uma resposta.
- **RF-SEG-008 — Acesso restrito:** O código de referência, isoladamente, não deve permitir o acesso a detalhes confidenciais sem a devida verificação de identidade e autorização.

## 3.6. Gestão de estados e fluxo de trabalho

O hospital deve validar os nomes e as transições finais dos estados antes da implementação. Como proposta inicial, podem ser usados os seguintes estados:

1. **Submetido:** o processo foi registado.
2. **Em triagem:** o processo está a ser analisado para classificação e encaminhamento.
3. **Atribuído:** existe um responsável designado.
4. **Em análise:** o responsável está a investigar ou analisar o caso.
5. **A aguardar o paciente:** o hospital solicitou informação adicional.
6. **A aguardar outra área:** o tratamento depende de outra área autorizada.
7. **Respondido:** foi enviada uma resposta ao paciente.
8. **Encerrado:** o processo foi concluído segundo as regras do hospital.
9. **Reaberto:** o processo voltou ao tratamento após revisão autorizada.

Requisitos:

- **RF-EST-001 — Estado do processo:** Cada processo deve ter um estado atual.
- **RF-EST-002 — Transições válidas:** O sistema deve permitir apenas transições de estado autorizadas.
- **RF-EST-003 — Registo da mudança:** Cada mudança de estado deve registar o estado anterior, o novo estado, a data e hora e o utilizador responsável.
- **RF-EST-004 — Justificação:** Para mudanças relevantes, como encerramento, reabertura ou escalonamento, o sistema deve solicitar uma justificação quando definida pelo hospital.
- **RF-EST-005 — Responsável:** O sistema deve permitir identificar o responsável atual pelo tratamento.
- **RF-EST-006 — Prazos:** O sistema deve registar datas relevantes para permitir o acompanhamento dos prazos definidos pelo hospital.
- **RF-EST-007 — Encerramento controlado:** Um processo só deve ser encerrado por utilizadores autorizados e quando os critérios de encerramento forem cumpridos.
- **RF-EST-008 — Reabertura controlada:** O sistema deve permitir reabrir um processo quando houver uma razão válida e autorização.
- **RF-EST-009 — Histórico imutável:** As mudanças relevantes devem ser preservadas no histórico; correções não devem apagar silenciosamente os eventos anteriores.
- **RF-EST-010 — Visibilidade dos estados:** O sistema deve distinguir os estados e notas internas dos conteúdos que podem ser apresentados ao paciente.

## 3.7. Painel do colaborador

- **RF-COL-001 — Painel de trabalho:** O colaborador deve visualizar os processos atribuídos a si.
- **RF-COL-002 — Lista de processos:** A lista deve mostrar, no mínimo, referência, tipo, categoria, data de criação, estado, prioridade quando aplicável e prazo.
- **RF-COL-003 — Pesquisa e filtros:** O colaborador deve poder pesquisar e filtrar os processos a que tem acesso.
- **RF-COL-004 — Consulta detalhada:** O colaborador deve poder consultar todos os dados do processo necessários ao tratamento e permitidos pelo seu perfil.
- **RF-COL-005 — Atualização de estado:** O colaborador deve poder alterar o estado dentro das permissões e transições autorizadas.
- **RF-COL-006 — Resposta ao paciente:** O colaborador deve poder enviar uma resposta oficial através do processo.
- **RF-COL-007 — Pedido de informação:** O colaborador deve poder solicitar informação adicional ao paciente.
- **RF-COL-008 — Notas internas:** O colaborador deve poder registar notas internas, claramente separadas das mensagens visíveis ao paciente.
- **RF-COL-009 — Registo de ações:** As ações relevantes do colaborador devem ser registadas no histórico.
- **RF-COL-010 — Acesso limitado:** O colaborador não deve poder aceder a processos fora do âmbito das suas permissões.
- **RF-COL-011 — Anexos:** O colaborador autorizado deve poder consultar os anexos necessários ao tratamento, respeitando as regras de segurança.
- **RF-COL-012 — Sinalização de atrasos:** O painel deve destacar processos próximos do prazo ou fora do prazo, segundo os parâmetros definidos.

## 3.8. Painel do supervisor

- **RF-SUP-001 — Visão geral:** O supervisor deve consultar uma visão geral dos processos da área ou equipa sob a sua responsabilidade.
- **RF-SUP-002 — Distribuição:** O supervisor deve poder atribuir processos a colaboradores autorizados.
- **RF-SUP-003 — Reatribuição:** O supervisor deve poder reatribuir processos, registando a alteração.
- **RF-SUP-004 — Processos sem responsável:** O sistema deve permitir identificar processos sem responsável atribuído.
- **RF-SUP-005 — Monitorização de prazos:** O supervisor deve poder identificar processos pendentes, atrasados e próximos do prazo.
- **RF-SUP-006 — Escalonamento:** O supervisor deve poder encaminhar casos que necessitem de intervenção superior.
- **RF-SUP-007 — Revisão:** Quando as regras do hospital o exigirem, o supervisor deve poder rever a resposta ou o encerramento de um processo.
- **RF-SUP-008 — Histórico:** O supervisor deve poder consultar o histórico necessário à supervisão.
- **RF-SUP-009 — Relatórios:** O supervisor deve poder consultar indicadores e relatórios da sua área.
- **RF-SUP-010 — Limites de acesso:** O supervisor deve aceder apenas às áreas, equipas e dados abrangidos pelas suas permissões.

## 3.9. Painel do administrador

- **RF-ADM-001 — Gestão de contas internas:** O administrador autorizado deve poder criar, consultar, atualizar, ativar e desativar contas internas.
- **RF-ADM-002 — Atribuição de perfis:** O administrador deve poder atribuir perfis e permissões autorizados.
- **RF-ADM-003 — Princípio do menor privilégio:** O sistema deve impedir a atribuição de permissões superiores às que o administrador está autorizado a conceder.
- **RF-ADM-004 — Gestão de departamentos:** O administrador deve poder criar, atualizar, ativar e desativar departamentos ou serviços.
- **RF-ADM-005 — Gestão de categorias:** O administrador deve poder gerir as categorias de reclamações e pedidos de esclarecimento.
- **RF-ADM-006 — Configuração de prazos:** O administrador autorizado deve poder configurar prazos e regras de acompanhamento.
- **RF-ADM-007 — Parâmetros gerais:** O administrador deve poder gerir os parâmetros institucionais apresentados no sistema.
- **RF-ADM-008 — Gestão de perguntas frequentes:** O administrador autorizado deve poder manter as perguntas frequentes e respetivas respostas.
- **RF-ADM-009 — Consulta de auditoria:** O administrador autorizado deve poder consultar registos de auditoria.
- **RF-ADM-010 — Proteção contra autoelevação:** Um utilizador não deve conseguir aumentar as próprias permissões sem uma autorização válida.
- **RF-ADM-011 — Confirmação de operações críticas:** O sistema deve solicitar confirmação antes de operações administrativas de impacto significativo.
- **RF-ADM-012 — Preservação de histórico:** A desativação de contas, categorias ou departamentos não deve eliminar o histórico dos processos associados.
- **RF-ADM-013 — Configuração institucional:** O sistema deve permitir configurar o nome do hospital e os contactos institucionais.

## 3.10. Comunicação e notificações

- **RF-NOT-001 — Notificações no sistema:** O sistema deve apresentar notificações sobre eventos relevantes para cada utilizador.
- **RF-NOT-002 — Confirmação de submissão:** O paciente deve receber uma confirmação após a criação bem-sucedida de um processo.
- **RF-NOT-003 — Mudanças relevantes:** O sistema deve notificar o paciente sobre respostas, pedidos de informação e mudanças relevantes de estado.
- **RF-NOT-004 — Alertas internos:** Os colaboradores e supervisores devem receber avisos sobre novas atribuições, prazos próximos e processos atrasados, conforme as suas funções.
- **RF-NOT-005 — Canais configuráveis:** Os canais externos, como SMS ou correio eletrónico, só devem ser utilizados quando estiverem configurados e autorizados.
- **RF-NOT-006 — Falha de envio:** O sistema deve registar falhas de envio de notificações e permitir a sua monitorização.
- **RF-NOT-007 — Conteúdo mínimo:** As notificações externas devem evitar divulgar dados pessoais ou detalhes sensíveis do processo.
- **RF-NOT-008 — Preferências:** Quando aplicável, o utilizador deve poder gerir preferências de notificações não essenciais.
- **RF-NOT-009 — Separação de mensagens:** As mensagens oficiais destinadas ao paciente devem ser distinguidas das notas internas.
- **RF-NOT-010 — Histórico de comunicação:** O sistema deve preservar um histórico das mensagens e respostas associadas ao processo.

## 3.11. Relatórios e indicadores

- **RF-REL-001 — Volume de processos:** O sistema deve apresentar o número de reclamações e pedidos de esclarecimento num período selecionado.
- **RF-REL-002 — Distribuição por estado:** O sistema deve apresentar a distribuição de processos por estado.
- **RF-REL-003 — Distribuição por categoria:** O sistema deve permitir analisar os processos por categoria e departamento.
- **RF-REL-004 — Tempo de tratamento:** O sistema deve permitir calcular o tempo entre a submissão e a resposta ou encerramento, conforme a definição adotada.
- **RF-REL-005 — Cumprimento de prazos:** O sistema deve apresentar a quantidade ou percentagem de processos tratados dentro e fora dos prazos definidos.
- **RF-REL-006 — Carga de trabalho:** O sistema deve permitir analisar os processos atribuídos a cada equipa ou colaborador, de acordo com as permissões.
- **RF-REL-007 — Filtros temporais:** Os relatórios devem permitir selecionar períodos e outros filtros pertinentes.
- **RF-REL-008 — Exportação:** Caso seja aprovada para a primeira versão, a informação agregada deve poder ser exportada num formato definido pelo hospital.
- **RF-REL-009 — Proteção de dados:** Os relatórios devem limitar os dados pessoais ao estritamente necessário.
- **RF-REL-010 — Acesso autorizado:** Apenas utilizadores autorizados devem poder consultar relatórios que contenham informação operacional ou pessoal.

## 3.12. Auditoria e rastreabilidade

- **RF-AUD-001 — Registo de eventos:** O sistema deve registar eventos relevantes, incluindo autenticação, criação e alteração de processos, atribuições, mudanças de estado, alterações de permissões e operações administrativas críticas.
- **RF-AUD-002 — Identificação do autor:** Sempre que possível, cada evento deve identificar o utilizador que o realizou.
- **RF-AUD-003 — Data e hora:** Os eventos devem incluir a data e hora do acontecimento.
- **RF-AUD-004 — Integridade:** Os registos de auditoria não devem poder ser alterados ou eliminados por utilizadores comuns.
- **RF-AUD-005 — Consulta restrita:** A consulta dos registos de auditoria deve ser limitada a utilizadores autorizados.
- **RF-AUD-006 — Consulta do histórico:** O histórico de um processo deve permitir compreender a sequência de ações realizadas.
- **RF-AUD-007 — Conservação:** O período de conservação dos registos deve ser definido de acordo com as regras do hospital e a legislação aplicável.

---

## 4. Regras de negócio

- **RN-001 — Acesso do paciente:** Um paciente só pode consultar e gerir os processos associados à sua própria conta.
- **RN-002 — Contas internas:** O registo público cria apenas contas de paciente. Contas internas são criadas por utilizadores autorizados.
- **RN-003 — Referência única:** Cada processo deve possuir um código de referência único.
- **RN-004 — Responsabilidade:** Cada processo em tratamento deve ter um responsável ou estar claramente identificado como não atribuído.
- **RN-005 — Estados autorizados:** Um processo só pode mudar de estado através de transições permitidas.
- **RN-006 — Histórico:** As ações importantes devem ser registadas e não podem ser apagadas silenciosamente.
- **RN-007 — Notas internas:** As notas internas nunca devem ser apresentadas ao paciente.
- **RN-008 — Respostas oficiais:** Uma resposta destinada ao paciente deve ser identificada como comunicação oficial do hospital.
- **RN-009 — Encerramento:** O encerramento deve obedecer aos critérios definidos pelo hospital.
- **RN-010 — Reabertura:** A reabertura deve exigir autorização e uma justificação quando aplicável.
- **RN-011 — Prazos:** Os prazos de tratamento devem ser definidos pelo hospital por categoria, prioridade ou tipo de processo, se necessário.
- **RN-012 — Escalonamento:** Os processos atrasados ou de maior prioridade podem ser escalados de acordo com as regras internas.
- **RN-013 — Minimização de dados:** Devem ser recolhidos apenas os dados necessários ao funcionamento e tratamento do processo.
- **RN-014 — Anexos controlados:** Os anexos devem respeitar os formatos, tamanhos e regras de segurança definidos.
- **RN-015 — Desativação sem perda de histórico:** Desativar uma conta não deve apagar os processos que essa conta criou ou tratou.
- **RN-016 — Permissões por função:** Cada operação deve respeitar o perfil, as permissões e o âmbito de acesso do utilizador.
- **RN-017 — Identificação de duplicados:** O hospital deve definir se e como processos semelhantes podem ser identificados, associados ou sinalizados como duplicados.
- **RN-018 — Informação clínica:** O HospitalCare não substitui o processo clínico nem deve ser usado como canal de emergência médica.
- **RN-019 — Emergências:** A interface deve informar que situações urgentes ou emergências médicas devem utilizar os canais de emergência do hospital, e não aguardar pela resposta a uma reclamação.
- **RN-020 — Conservação e eliminação:** A conservação, anonimização ou eliminação de dados deve obedecer às políticas aprovadas e à legislação aplicável.

---

## 5. Requisitos não funcionais

### 5.1. Segurança

- **RNF-SEG-001:** O sistema deve exigir autenticação para aceder a funcionalidades privadas.
- **RNF-SEG-002:** O sistema deve aplicar controlo de acesso baseado em perfis e permissões.
- **RNF-SEG-003:** As permissões devem ser verificadas no servidor para cada operação protegida.
- **RNF-SEG-004:** As credenciais devem ser armazenadas de forma segura, nunca em texto simples.
- **RNF-SEG-005:** As comunicações devem ser protegidas por mecanismos de segurança adequados, incluindo HTTPS em produção.
- **RNF-SEG-006:** O sistema deve proteger contra tentativas repetidas de autenticação, abuso de formulários e acesso indevido.
- **RNF-SEG-007:** Os anexos devem ser validados quanto ao tipo, tamanho e segurança antes de serem disponibilizados.
- **RNF-SEG-008:** Segredos, palavras-passe e códigos de verificação não devem ser escritos nos registos de aplicação.
- **RNF-SEG-009:** As sessões e os mecanismos de recuperação de acesso devem seguir práticas de segurança adequadas.
- **RNF-SEG-010:** Operações críticas devem ser registadas para auditoria.

### 5.2. Privacidade e proteção de dados

- **RNF-PRI-001:** O sistema deve recolher apenas os dados necessários para as finalidades declaradas.
- **RNF-PRI-002:** Os dados pessoais devem ser acessíveis apenas a utilizadores autorizados.
- **RNF-PRI-003:** As notificações devem evitar expor informações sensíveis.
- **RNF-PRI-004:** O sistema deve disponibilizar informação clara sobre a utilização dos dados.
- **RNF-PRI-005:** Os períodos de conservação e os procedimentos de eliminação devem ser definidos e documentados.
- **RNF-PRI-006:** O acesso a anexos e mensagens deve respeitar as mesmas regras de autorização aplicadas ao processo.
- **RNF-PRI-007:** A solução deve ser avaliada face à legislação moçambicana aplicável e às políticas internas do hospital antes de entrar em produção.

### 5.3. Usabilidade e acessibilidade

- **RNF-USA-001:** A interface deve utilizar linguagem simples, clara e adequada aos pacientes.
- **RNF-USA-002:** As tarefas frequentes devem exigir o menor número razoável de passos.
- **RNF-USA-003:** Os formulários devem indicar campos obrigatórios e explicar os erros de validação.
- **RNF-USA-004:** As ações importantes devem apresentar confirmação ou feedback visível.
- **RNF-USA-005:** A interface deve manter uma navegação consistente entre áreas.
- **RNF-USA-006:** O sistema deve funcionar em computadores, tablets e telemóveis.
- **RNF-USA-007:** A interface deve considerar boas práticas de acessibilidade, incluindo contraste, navegação por teclado, identificação de campos e textos alternativos quando aplicáveis.
- **RNF-USA-008:** Os estados dos processos devem ser apresentados com texto claro, sem depender exclusivamente da cor.

### 5.4. Desempenho

- **RNF-DES-001:** As páginas e operações comuns devem responder em tempo adequado à utilização normal.
- **RNF-DES-002:** As listas com muitos processos devem utilizar paginação ou carregamento controlado.
- **RNF-DES-003:** As pesquisas e os filtros devem evitar carregar informação desnecessária.
- **RNF-DES-004:** O desempenho deve ser avaliado com um volume de dados e número de utilizadores representativos do hospital piloto.
- **RNF-DES-005:** Os limites de tamanho dos anexos devem ser definidos para proteger o desempenho e o armazenamento.

### 5.5. Disponibilidade, recuperação e fiabilidade

- **RNF-DIS-001:** O sistema deve apresentar mensagens compreensíveis quando uma operação falhar.
- **RNF-DIS-002:** Uma falha no envio de notificações não deve apagar nem invalidar o processo criado.
- **RNF-DIS-003:** Devem existir cópias de segurança periódicas dos dados essenciais.
- **RNF-DIS-004:** O hospital deve definir procedimentos para restaurar dados e retomar o serviço após uma falha.
- **RNF-DIS-005:** As operações de criação e atualização devem evitar registos duplicados ou estados inconsistentes.
- **RNF-DIS-006:** As cópias de segurança devem ser protegidas contra acesso não autorizado e testadas periodicamente.

### 5.6. Manutenção e evolução

- **RNF-MAN-001:** Os requisitos, regras de negócio e decisões de configuração devem estar documentados.
- **RNF-MAN-002:** As categorias, departamentos e prazos que mudam com frequência devem ser configuráveis por utilizadores autorizados.
- **RNF-MAN-003:** As alterações devem ser testadas antes de serem disponibilizadas em produção.
- **RNF-MAN-004:** Os erros relevantes devem ser registados sem incluir credenciais ou dados sensíveis desnecessários.
- **RNF-MAN-005:** O sistema deve permitir evolução futura sem comprometer os dados e o histórico existentes.

### 5.7. Compatibilidade

- **RNF-COM-001:** O sistema deve funcionar nas versões atuais e suportadas dos principais navegadores utilizados pelo hospital e pelos pacientes.
- **RNF-COM-002:** A interface deve adaptar-se a diferentes dimensões de ecrã.
- **RNF-COM-003:** A compatibilidade deve ser validada em dispositivos reais antes da entrada em produção.

### 5.8. Localização e linguagem

- **RNF-LOC-001:** A primeira versão deve disponibilizar a interface em português.
- **RNF-LOC-002:** Datas, horas e números devem ser apresentados de forma consistente e compreensível para os utilizadores.
- **RNF-LOC-003:** O sistema deve considerar o contexto operacional do hospital em Moçambique, incluindo os canais de contacto que o hospital efetivamente utiliza.
- **RNF-LOC-004:** O fuso horário institucional deve ser definido e utilizado de forma consistente.

---

## 6. Requisitos de dados

### 6.1. Dados da conta do paciente

Os campos definitivos devem ser aprovados pelo hospital. Como base inicial, poderão incluir:

- Identificador interno da conta.
- Nome completo.
- Número de telefone.
- Endereço de correio eletrónico, se necessário ou disponibilizado.
- Estado de confirmação do contacto.
- Estado da conta.
- Data de criação e última atualização.

Não se deve exigir número de documento de identificação, endereço residencial ou informação clínica, salvo se existir uma necessidade justificada e aprovada.

### 6.2. Dados do processo

- Identificador interno.
- Código de referência.
- Tipo: reclamação ou pedido de esclarecimento.
- Categoria.
- Departamento relacionado, quando aplicável.
- Descrição.
- Data e hora de submissão.
- Estado atual.
- Prioridade, se aplicável.
- Responsável atual.
- Prazo definido, quando aplicável.
- Data e motivo de encerramento, quando aplicável.
- Anexos associados, se a funcionalidade estiver ativa.

### 6.3. Mensagens e notas

Cada mensagem ou nota deve incluir, conforme aplicável:

- Identificador.
- Processo associado.
- Autor.
- Data e hora.
- Conteúdo.
- Tipo de registo: mensagem visível ao paciente ou nota interna.
- Estado de envio, quando se tratar de notificação externa.

### 6.4. Histórico e auditoria

O histórico deve permitir identificar o evento, o utilizador responsável, a data e hora e os detalhes necessários para compreender a ação. O conteúdo registado deve respeitar os princípios de minimização de dados e controlo de acesso.

### 6.5. Qualidade dos dados

- Os campos obrigatórios devem ser validados.
- As referências dos processos devem ser únicas.
- As relações entre pacientes, processos, mensagens e anexos devem ser consistentes.
- As datas devem ser armazenadas e apresentadas de forma coerente.
- A eliminação ou desativação de registos deve respeitar as regras de conservação definidas.
- Os dados de teste não devem expor informação real de pacientes.

---

## 7. Fluxos principais

### 7.1. Registo e início de sessão do paciente

1. A pessoa abre a área pública.
2. Seleciona a opção de registo.
3. Preenche os dados obrigatórios.
4. O sistema valida os dados.
5. Se a confirmação por telefone estiver ativa, o sistema envia um código de verificação.
6. A pessoa introduz o código válido.
7. O sistema ativa a conta de acordo com as regras configuradas.
8. O paciente inicia sessão e acede ao portal.

### 7.2. Submissão de uma reclamação ou pedido de esclarecimento

1. O paciente inicia sessão.
2. Seleciona a opção de criar processo.
3. Escolhe o tipo e a categoria.
4. Preenche a descrição e os campos aplicáveis.
5. Anexa documentos, se essa opção estiver disponível.
6. Revê os dados e submete o formulário.
7. O sistema valida e regista o processo.
8. O sistema gera uma referência única e define o estado inicial.
9. O paciente recebe uma confirmação.
10. O processo fica disponível para triagem e encaminhamento.

### 7.3. Triagem, atribuição e tratamento

1. O processo surge na fila de triagem.
2. Um utilizador autorizado verifica a categoria e a informação submetida.
3. O processo é encaminhado para a área adequada.
4. O supervisor ou utilizador autorizado atribui um responsável.
5. O colaborador analisa o processo.
6. Se faltar informação, solicita-a ao paciente e o estado é atualizado.
7. O paciente responde através do sistema.
8. O colaborador continua a análise e prepara uma resposta.
9. O processo é respondido e encerrado de acordo com as regras do hospital.
10. As ações ficam registadas no histórico.

### 7.4. Supervisão de processos atrasados

1. O supervisor consulta o painel de acompanhamento.
2. O sistema destaca processos próximos ou além do prazo.
3. O supervisor verifica o responsável e o histórico.
4. O supervisor solicita atualização, reatribui ou escala o processo, conforme necessário.
5. A ação é registada e os utilizadores relevantes são notificados.

### 7.5. Administração de utilizadores

1. O administrador autorizado acede à área de gestão.
2. Cria ou seleciona uma conta interna.
3. Define o perfil e as permissões adequadas.
4. O sistema valida a operação.
5. A alteração é registada na auditoria.
6. O utilizador recebe as instruções de acesso pelo canal aprovado.

---

## 8. Critérios gerais de aceitação

O sistema poderá ser considerado apto para avaliação do hospital piloto quando:

- Um paciente consegue registar-se, autenticar-se e recuperar o acesso através do fluxo definido.
- Um paciente consegue submeter uma reclamação e um pedido de esclarecimento.
- Cada processo recebe uma referência única e um estado inicial.
- O paciente consegue consultar apenas os seus próprios processos.
- Os colaboradores conseguem consultar e tratar apenas os processos autorizados.
- Os supervisores conseguem atribuir, acompanhar e escalar processos dentro das suas permissões.
- Os administradores conseguem gerir contas internas, perfis, categorias e departamentos autorizados.
- O sistema separa claramente as notas internas das mensagens destinadas ao paciente.
- As mudanças de estado e as ações críticas ficam registadas no histórico.
- As notificações essenciais funcionam ou, se um serviço externo não estiver configurado, a limitação é comunicada sem perda do processo.
- Os relatórios básicos apresentam informação consistente com os processos registados.
- Os controlos de acesso são testados para impedir a consulta indevida de processos de outros pacientes.
- A interface é utilizável em telemóveis e computadores.
- Existem procedimentos documentados de cópia de segurança e recuperação.
- O hospital aprova os estados, categorias, prazos, perfis e políticas de conservação antes da entrada em produção.

---

## 9. Prioridade para a primeira versão (MVP)

### 9.1. Essencial para o MVP

- [ ] Área pública com informação e contactos.
- [ ] Registo e autenticação de pacientes.
- [ ] Confirmação de telefone, caso exista um serviço de envio de códigos disponível.
- [ ] Criação e gestão administrativa de contas internas.
- [ ] Perfis de paciente, colaborador, supervisor e administrador.
- [ ] Criação de reclamações e pedidos de esclarecimento.
- [ ] Geração de referência única.
- [ ] Consulta e acompanhamento dos processos pelo paciente.
- [ ] Atribuição e tratamento de processos por colaboradores.
- [ ] Atualização controlada dos estados.
- [ ] Mensagens oficiais e notas internas separadas.
- [ ] Painel básico de supervisão.
- [ ] Gestão de categorias e departamentos.
- [ ] Histórico de ações essenciais.
- [ ] Notificações dentro do sistema.
- [ ] Relatórios operacionais básicos.
- [ ] Controlo de acesso e proteção de dados.
- [ ] Cópias de segurança e procedimentos de recuperação.

### 9.2. Funcionalidades que podem ficar para uma fase posterior

- [ ] Envio de notificações por SMS ou correio eletrónico, se não houver serviço disponível na primeira fase.
- [ ] Exportação avançada de relatórios.
- [ ] Avaliação de satisfação detalhada.
- [ ] Deteção assistida de processos duplicados.
- [ ] Integração com sistemas clínicos ou administrativos do hospital.
- [ ] Painéis analíticos avançados.
- [ ] Suporte a idiomas adicionais.
- [ ] Aplicação móvel dedicada.

A priorização final deve ser validada com a direção do hospital e com os utilizadores que participarão no piloto.

---

## 10. Decisões pendentes de validação com o hospital

Antes do desenvolvimento definitivo, devem ser esclarecidos os seguintes pontos:

1. Quais são os departamentos e serviços envolvidos?
2. Quais são as categorias oficiais de reclamações e pedidos de esclarecimento?
3. Quais são os estados oficiais e as transições permitidas?
4. Qual é o prazo esperado para a primeira resposta e para a resolução?
5. Os prazos variam por categoria, prioridade ou departamento?
6. Quem pode atribuir, reatribuir, escalar, encerrar e reabrir processos?
7. O encerramento exige revisão ou aprovação do supervisor?
8. Quais dados do paciente são estritamente necessários?
9. A confirmação por SMS será obrigatória? Qual serviço será utilizado?
10. As notificações serão enviadas por SMS, correio eletrónico, dentro do sistema ou por uma combinação destes canais?
11. Quais formatos e tamanhos de anexos serão permitidos?
12. Durante quanto tempo os processos, mensagens, anexos e registos de auditoria devem ser conservados?
13. Quais relatórios são necessários para a direção do hospital?
14. Quem terá acesso a relatórios detalhados e a dados identificáveis?
15. Qual será o procedimento para reclamações urgentes ou que envolvam riscos imediatos?
16. Qual será o procedimento para pedidos de acesso, correção ou desativação de dados pessoais?
17. Quais são os requisitos de disponibilidade, manutenção e recuperação após falhas?
18. Que legislação e políticas institucionais se aplicam ao tratamento e à conservação dos dados?

As respostas devem ser documentadas e aprovadas pelos responsáveis competentes antes da entrada em produção.

---

## 11. Riscos e medidas preventivas

| Risco | Medida preventiva |
|---|---|
| Acesso indevido a processos | Controlo de acesso no servidor e testes com perfis diferentes. |
| Exposição de informação sensível em notificações | Mensagens externas com conteúdo mínimo e sem detalhes confidenciais. |
| Perda de dados | Cópias de segurança protegidas e testes de recuperação. |
| Processos sem responsável | Painel de triagem e alertas para processos não atribuídos. |
| Atrasos na resposta | Prazos configurados, indicadores e alertas de supervisão. |
| Confusão entre notas internas e respostas públicas | Separação explícita de tipos de mensagem e validação de permissões. |
| Contas internas criadas sem autorização | Criação administrativa e registo de auditoria. |
| Utilização do sistema em emergências médicas | Aviso visível para utilizar os canais de emergência do hospital. |
| Recolha excessiva de dados | Revisão dos campos com o hospital e aplicação do princípio da minimização. |
| Falhas em serviços externos de mensagens | Registo de falhas, monitorização e preservação do processo principal. |

---

## 12. Glossário de identificadores

| Prefixo | Área |
|---|---|
| `RF-PUB` | Área pública |
| `RF-AUT` | Registo e autenticação |
| `RF-PAC` | Perfil do paciente |
| `RF-PRC` | Criação de processos |
| `RF-SEG` | Consulta e acompanhamento |
| `RF-EST` | Estados e fluxo de trabalho |
| `RF-COL` | Painel do colaborador |
| `RF-SUP` | Painel do supervisor |
| `RF-ADM` | Painel do administrador |
| `RF-NOT` | Comunicação e notificações |
| `RF-REL` | Relatórios |
| `RF-AUD` | Auditoria |
| `RN` | Regra de negócio |
| `RNF-SEG` | Requisito não funcional de segurança |
| `RNF-PRI` | Requisito não funcional de privacidade |
| `RNF-USA` | Requisito não funcional de usabilidade |
| `RNF-DES` | Requisito não funcional de desempenho |
| `RNF-DIS` | Requisito não funcional de disponibilidade e fiabilidade |
| `RNF-MAN` | Requisito não funcional de manutenção |
| `RNF-COM` | Requisito não funcional de compatibilidade |
| `RNF-LOC` | Requisito não funcional de localização |

---

## 13. Aprovação do documento

| Papel | Nome | Data | Assinatura/validação |
|---|---|---|---|
| Representante da direção do hospital |  |  |  |
| Responsável pelo atendimento ao paciente |  |  |  |
| Responsável pela supervisão |  |  |  |
| Responsável pelo projeto |  |  |  |

**Nota:** Este documento constitui uma base inicial de requisitos. As regras institucionais, os prazos, as categorias, os perfis de acesso e as obrigações legais devem ser confirmados com o hospital antes do desenvolvimento e da utilização em produção.
