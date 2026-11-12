import os
import sys
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # Não desenha cabeçalho/rodapé na capa
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#075985"))

        # Cabeçalho
        self.drawString(54, 800, "HospitalCare — Sistema Hospitalar com Inteligência Artificial")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawRightString(541, 800, "Hospital Central de Maputo (HCM)")

        # Linha do cabeçalho
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(54, 792, 541, 792)

        # Rodapé
        self.line(54, 50, 541, 50)
        self.drawString(54, 38, "Documentação Técnica & Manual de Credenciais • Confidencial")
        page_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(541, 38, page_text)

        self.restoreState()


def build_presentation_pdf(output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Estilos Customizados
    c_primary = colors.HexColor("#075985")
    c_secondary = colors.HexColor("#0284C7")
    c_accent = colors.HexColor("#059669")
    c_dark = colors.HexColor("#0F172A")
    c_muted = colors.HexColor("#475569")
    c_bg_light = colors.HexColor("#F8FAFC")
    c_border = colors.HexColor("#E2E8F0")

    style_cover_badge = ParagraphStyle(
        'CoverBadge',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=c_accent,
        spaceAfter=15
    )

    style_cover_title = ParagraphStyle(
        'CoverTitle',
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=c_primary,
        spaceAfter=12
    )

    style_cover_subtitle = ParagraphStyle(
        'CoverSubtitle',
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=c_muted,
        spaceAfter=25
    )

    style_h1 = ParagraphStyle(
        'SectionH1',
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=c_primary,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    style_h2 = ParagraphStyle(
        'SectionH2',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=c_secondary,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    style_body = ParagraphStyle(
        'BodyDark',
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=c_dark,
        spaceAfter=8
    )

    style_body_bold = ParagraphStyle(
        'BodyBold',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=14,
        textColor=c_dark,
        spaceAfter=8
    )

    style_body_muted = ParagraphStyle(
        'BodyMuted',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_muted,
        spaceAfter=6
    )

    style_callout = ParagraphStyle(
        'CalloutText',
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E293B")
    )

    style_table_header = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    )

    style_table_cell = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=c_dark
    )

    style_table_cell_code = ParagraphStyle(
        'TableCellCode',
        fontName='Courier-Bold',
        fontSize=8.5,
        leading=11,
        textColor=c_primary
    )

    story = []

    # =========================================================================
    # CAPA PROFISSIONAL
    # =========================================================================
    story.append(Spacer(1, 40))
    story.append(Paragraph("REPÚBLICA DE MOÇAMBIQUE • MINISTÉRIO DA SAÚDE", style_cover_badge))
    story.append(Paragraph("HospitalCare", style_cover_title))
    story.append(Paragraph(
        "Apresentação Técnica da Arquitectura, Catálogo de Tecnologias, Módulos Operacionais e Guia de Credenciais",
        style_cover_subtitle
    ))

    story.append(HRFlowable(width="100%", thickness=3, color=c_primary, spaceBefore=5, spaceAfter=25))

    # Caixa Executiva da Capa
    cover_info_data = [
        [Paragraph("<b>Hospital Piloto:</b>", style_body), Paragraph("Hospital Central de Maputo (HCM)", style_body)],
        [Paragraph("<b>Data do Relatório:</b>", style_body), Paragraph(datetime.now().strftime("%d de Novembro de %Y"), style_body)],
        [Paragraph("<b>Versão da Solução:</b>", style_body), Paragraph("Release 2.4.0 — Pronta para Produção & Auditoria", style_body)],
        [Paragraph("<b>Motor de IA Híbrido:</b>", style_body), Paragraph("Google Gemini 1.5 Flash & Espaço para IA Local (Ollama)", style_body)],
        [Paragraph("<b>Portal de Produção:</b>", style_body), Paragraph("https://tino1-eng.github.io/sistema-reclamacoes-hospitalar/#/", style_body)],
        [Paragraph("<b>Servidor de API:</b>", style_body), Paragraph("https://sistema-reclamacoes-hospitalar-2.onrender.com", style_body)],
    ]
    t_cover = Table(cover_info_data, colWidths=[150, 337])
    t_cover.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F0F9FF")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#BAE6FD")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E0F2FE")),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(t_cover)

    story.append(Spacer(1, 50))

    callout_box = [
        [Paragraph("<b>RESUMO EXECUTIVO:</b> Este documento apresenta a arquitectura tecnológica, a segurança de dados, o ecossistema de módulos e os perfis com credenciais ativas do sistema <b>HospitalCare</b>. O sistema foi desenvolvido para assegurar máxima transparência no atendimento aos cidadãos, garantia estrita de acordos de nível de serviço (SLA) e assistência por inteligência artificial aos utentes e corpo médico.", style_callout)]
    ]
    t_callout = Table(callout_box, colWidths=[487])
    t_callout.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#ECFDF5")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#A7F3D0")),
        ('PADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(t_callout)

    story.append(PageBreak())

    # =========================================================================
    # SECÇÃO 1: STACK TECNOLÓGICA & ARQUITECTURA
    # =========================================================================
    story.append(Paragraph("1. Arquitectura de Software e Catálogo de Tecnologias", style_h1))
    story.append(Paragraph(
        "O <b>HospitalCare</b> foi estruturado com base numa arquitectura desacoplada em três camadas (Frontend SPA, Backend RESTful e Base de Dados Documental Distribuída), proporcionando alta disponibilidade, tempos de resposta inferiores a 100ms e tolerância a falhas de conectividade.",
        style_body
    ))

    tech_table_data = [
        [Paragraph("Camada", style_table_header), Paragraph("Tecnologias & Bibliotecas", style_table_header), Paragraph("Objectivo & Justificação Técnica", style_table_header)],
        [
            Paragraph("<b>Frontend (Web & Mobile)</b>", style_table_cell),
            Paragraph("• Vue 3 (Composition API)<br/>• Quasar Framework v2<br/>• Vite 8 & TypeScript<br/>• Pinia (State Management)<br/>• Chart.js (Visualização)", style_table_cell),
            Paragraph("Interface Single Page Application (SPA) ultrarrápida, optimizada para telemóveis e computadores de secretária, com navegação adaptativa, modo offline gracioso e renderização de dados em tempo real.", style_table_cell)
        ],
        [
            Paragraph("<b>Backend (API REST)</b>", style_table_cell),
            Paragraph("• Node.js & Express<br/>• TypeScript estrito<br/>• Zod (Validação de Schemas)<br/>• JSON Web Tokens (JWT)<br/>• BcryptJS (Hashing)<br/>• Multer (Upload de Anexos)", style_table_cell),
            Paragraph("Serviço REST modular e sem estado (stateless), estruturado em Controllers, Services e Modelos Mongoose. Inclui sanitização estrita, protecção Helmet, CORS permissivo e tratamento global de erros.", style_table_cell)
        ],
        [
            Paragraph("<b>Base de Dados</b>", style_table_cell),
            Paragraph("• MongoDB Atlas (Nuvem)<br/>• Mongoose ORM v9<br/>• Índices Compostos<br/>• Réplica Distribuída", style_table_cell),
            Paragraph("Armazenamento flexível e altamente escalável para colecções de Utilizadores, Processos, Histórico de Estados, Trilha Auditável (AuditLog), Notificações e Sessões de IA.", style_table_cell)
        ],
        [
            Paragraph("<b>Inteligência Artificial</b>", style_table_cell),
            Paragraph("• Google Gemini 1.5 Flash<br/>• Local AI (Ollama Engine)<br/>• Data Scrubber (MZ PII)<br/>• Fallback Heurístico HCM", style_table_cell),
            Paragraph("Motor de IA duplo: opera na nuvem ou localmente na máquina hospitalar (via porta 11434). Remove automaticamente dados sensíveis (BI, telefones) antes da inferência.", style_table_cell)
        ],
        [
            Paragraph("<b>DevOps & Nuvem</b>", style_table_cell),
            Paragraph("• GitHub Actions (CI/CD)<br/>• GitHub Pages (CDN Edge)<br/>• Render Cloud PaaS", style_table_cell),
            Paragraph("Esteira de integração e entrega contínua com compilação automatizada a cada commit e publicação instantânea de nova versão em produção.", style_table_cell)
        ],
    ]

    t_tech = Table(tech_table_data, colWidths=[95, 145, 247])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_primary),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_bg_light]),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_tech)

    story.append(Spacer(1, 14))

    # =========================================================================
    # SECÇÃO 2: UTILIZADORES E CREDENCIAIS DE TESTE
    # =========================================================================
    story.append(Paragraph("2. Perfis de Acesso e Credenciais de Demonstração", style_h1))
    story.append(Paragraph(
        "O sistema implementa controlo de acesso baseado em funções (<b>RBAC - Role-Based Access Control</b>). Abaixo constam as contas oficiais ativas na base de dados para testes operacionais em todos os níveis hierárquicos:",
        style_body
    ))

    users_table_data = [
        [
            Paragraph("Perfil (Role)", style_table_header),
            Paragraph("Nome Completo", style_table_header),
            Paragraph("E-mail de Acesso", style_table_header),
            Paragraph("Palavra-passe", style_table_header),
            Paragraph("Departamento / Atribuição", style_table_header)
        ],
        [
            Paragraph("<b>ADMIN</b>", style_table_cell),
            Paragraph("Eng. Rui Nhantumbo", style_table_cell),
            Paragraph("admin@hcm.gov.mz", style_table_cell_code),
            Paragraph("123456", style_table_cell_code),
            Paragraph("Direcção Geral / Controlo Total do Sistema, Utilizadores e SLAs", style_table_cell)
        ],
        [
            Paragraph("<b>ADMIN</b>", style_table_cell),
            Paragraph("Eng. Rui Chissano", style_table_cell),
            Paragraph("rui.chissano@hospitalcare.gov.mz", style_table_cell_code),
            Paragraph("123456", style_table_cell_code),
            Paragraph("Administração de Sistemas e Auditoria de Segurança", style_table_cell)
        ],
        [
            Paragraph("<b>SUPERVISOR</b>", style_table_cell),
            Paragraph("Enf. Ana Bila", style_table_cell),
            Paragraph("ana.bila@hcm.gov.mz", style_table_cell_code),
            Paragraph("123456", style_table_cell_code),
            Paragraph("Supervisão de Atendimento, Reatribuição de Casos e Relatórios", style_table_cell)
        ],
        [
            Paragraph("<b>STAFF</b>", style_table_cell),
            Paragraph("Dr. Carlos Mondlane", style_table_cell),
            Paragraph("carlos.mondlane@hcm.gov.mz", style_table_cell_code),
            Paragraph("123456", style_table_cell_code),
            Paragraph("Serviço de Pediatria (Triagem e Resposta Clínica)", style_table_cell)
        ],
        [
            Paragraph("<b>STAFF</b>", style_table_cell),
            Paragraph("Dra. Fátima Noormahomed", style_table_cell),
            Paragraph("fatima.noormahomed@hcm.gov.mz", style_table_cell_code),
            Paragraph("123456", style_table_cell_code),
            Paragraph("Farmácia Central Hospitalar (Gestão de Medicamentos)", style_table_cell)
        ],
        [
            Paragraph("<b>PATIENT</b>", style_table_cell),
            Paragraph("Maria Tembe", style_table_cell),
            Paragraph("maria.tembe@exemplo.co.mz", style_table_cell_code),
            Paragraph("123456", style_table_cell_code),
            Paragraph("Utente Cidadã (Submissão, Acompanhamento e Avaliação)", style_table_cell)
        ],
    ]

    t_users = Table(users_table_data, colWidths=[65, 100, 140, 62, 120])
    t_users.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_secondary),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_bg_light]),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_users)

    story.append(Spacer(1, 10))

    note_pin_box = [
        [Paragraph("<b>CONSULTA RÁPIDA SEM LOGIN:</b> Para testar o rastreamento confidencial de processos sem criar conta ou iniciar sessão, utilize o Código de Referência de exemplo <b>#HC-2026-000101</b> e o PIN de 4 dígitos <b>1234</b> na página de Consulta Pública.", style_callout)]
    ]
    t_pin = Table(note_pin_box, colWidths=[487])
    t_pin.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FFFBEB")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#FDE68A")),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t_pin)

    story.append(PageBreak())

    # =========================================================================
    # SECÇÃO 3: FUNCIONAMENTO TÉCNICO DOS MÓDULOS
    # =========================================================================
    story.append(Paragraph("3. Funcionamento Técnico dos Módulos Hospitalares", style_h1))

    # Módulo 3.1
    story.append(Paragraph("3.1. Autenticação, Gestão de Sessões e Controlo RBAC", style_h2))
    story.append(Paragraph(
        "A segurança de acesso assenta em tokens criptográficos <b>JWT (JSON Web Tokens)</b> assinados com algoritmo HMAC SHA-256 e expiração configurável. No acto do login:",
        style_body
    ))
    story.append(Paragraph(
        "1. O utilizador submete as credenciais (e-mail e palavra-passe) ao endpoint <code>POST /api/auth/login</code>.<br/>"
        "2. O backend valida a assinatura e compara o hash com <code>bcrypt.compare()</code> (salt rounds = 10).<br/>"
        "3. Em caso de sucesso, é emitido um JWT contendo os papéis autorizados (ex.: ADMIN, STAFF, PATIENT).<br/>"
        "4. O frontend armazena o token de forma persistente no <code>LocalStorage</code> e anexa o cabeçalho <code>Authorization: Bearer [token]</code> a todas as requisições subsequentes via interceptores Axios.<br/>"
        "5. O middleware <code>authenticate.ts</code> valida o token, enquanto <code>authorize.ts</code> bloqueia acessos indevidos com código HTTP 403 Forbidden.",
        style_body
    ))

    # Módulo 3.2
    story.append(Paragraph("3.2. Ciclo de Vida do Processo e Rastreamento Confidencial", style_h2))
    story.append(Paragraph(
        "Cada ocorrência (Reclamação, Sugestão, Elogio ou Pedido de Esclarecimento) segue uma máquina de estados finita auditável:",
        style_body
    ))
    story.append(Paragraph(
        "• <b>Submissão (SUBMITTED):</b> O utente (autenticado ou anónimo) regista o formulário. O sistema gera automaticamente um <b>Código de Referência único</b> (ex.: #HC-2026-000101) e um <b>PIN de 4 dígitos</b> cifrado com bcrypt.<br/>"
        "• <b>Triagem e Atribuição (TRIAGE / ASSIGNED):</b> A equipa de recepção ou supervisão valida a manifestação e associa-a ao departamento hospitalar correspondente (Urgências, Pediatria, Maternidade, Farmácia, etc.).<br/>"
        "• <b>Em Análise (IN_REVIEW):</b> O funcionário médico ou administrativo examina o processo, podendo registar <i>Notas Internas</i> (invisíveis ao paciente) ou gerar minutas de resposta.<br/>"
        "• <b>Resposta e Conclusão (ANSWERED / CLOSED):</b> Uma resposta formal e oficial é transmitida ao utente, notificando-o e disponibilizando o inquérito de satisfação (1 a 5 estrelas).",
        style_body
    ))

    # Módulo 3.3
    story.append(Paragraph("3.3. Motor de SLA e Cálculo de Prazos Hospitalares", style_h2))
    story.append(Paragraph(
        "Cada processo possui uma data limite de conformidade calculada no momento da submissão com base na prioridade clínica e nas políticas parametrizadas em <code>SlaPolicy</code>:<br/>"
        "• <b>Crítica / Urgente:</b> Resolução em 12 horas (ex.: falta crítica de medicamentos de suporte de vida).<br/>"
        "• <b>Alta Prioridade:</b> Resolução em 24 horas (ex.: tempos de espera graves em urgência pediátrica).<br/>"
        "• <b>Prioridade Normal:</b> Resolução em 48 horas (ex.: esclarecimentos clínicos ou conduta profissional).<br/>"
        "• <b>Baixa Prioridade:</b> Resolução em 72 a 96 horas (ex.: sugestões de infraestruturas ou elogios).<br/>"
        "O painel do Supervisor destaca processos em risco de violação de prazo com alertas visuais automáticos.",
        style_body
    ))

    # Módulo 3.4
    story.append(Paragraph("3.4. Trilha de Auditoria Contínua (Audit Logs)", style_h2))
    story.append(Paragraph(
        "Para garantia de integridade forense e responsabilização funcional, todas as acções críticas — como transição de estado, reatribuição de processo a outro médico, criação de utilizador ou alteração de configurações — geram um registo imutável na colecção <code>AuditLog</code> contendo <i>UserID, Acção, Entidade, Detalhes em JSON, Endereço IP e Carimbo de Data/Hora</i>.",
        style_body
    ))

    story.append(PageBreak())

    # =========================================================================
    # SECÇÃO 4: INTEGRAÇÃO DA INTELIGÊNCIA ARTIFICIAL
    # =========================================================================
    story.append(Paragraph("4. Arquitectura de Inteligência Artificial Híbrida", style_h1))
    story.append(Paragraph(
        "O HospitalCare introduz um motor de Inteligência Artificial pragmático, ético e seguro, desenhado especificamente para instituições de saúde pública.",
        style_body
    ))

    story.append(Paragraph("4.1. Assistente Virtual do Utente — 'Acolhe HospitalCare'", style_h2))
    story.append(Paragraph(
        "Componente flutuante interactivo disponível tanto para cidadãos no portal público como no painel do paciente. Permite:<br/>"
        "• Orientar utentes com empatia sobre os procedimentos do Hospital Central de Maputo.<br/>"
        "• Ajudar a estruturar manifestações, esclarecendo a diferença entre reclamação, sugestão e elogio.<br/>"
        "• Recomendar o departamento hospitalar mais adequado ao relato do utente.<br/>"
        "• Explicar como consultar o andamento do processo através do Código e PIN de segurança.<br/>"
        "• <b>Salvaguarda Ética Médica:</b> O assistente possui instruções de sistema rigorosas que o impedem de prescrever fármacos ou emitir diagnósticos clínicos, instruindo sempre a dirigir-se à Urgência Geral em situações de emergência vital.",
        style_body
    ))

    story.append(Paragraph("4.2. Copiloto de Atendimento para Funcionários e Supervisão", style_h2))
    story.append(Paragraph(
        "Integrado directamente na vista de detalhe do processo do funcionário:<br/>"
        "• <b>Resumo Executivo com IA:</b> Condensa relatos extensos de utentes em 2 frases objectivas, listando pontos-chave e justificativa de gravidade.<br/>"
        "• <b>Sugerir Parecer Institucional:</b> Rascunha uma proposta de resposta formal e respeitosa em Português de Moçambique, pré-preenchendo a caixa de mensagem para validação e edição humana prévia antes de qualquer envio.",
        style_body
    ))

    story.append(Paragraph("4.3. Privacidade e Higienização de Dados (Data Scrubber)", style_h2))
    story.append(Paragraph(
        "Para proteger os cidadãos e cumprir a legislação de privacidade de dados de saúde, o utilitário <code>data-scrubber.ts</code> processa todo o texto antes de qualquer envio a modelos externos de IA:<br/>"
        "• Números de BI moçambicano (12 dígitos seguidos de 1 letra) são substituídos por <code>[BI_ANONIMIZADO]</code>.<br/>"
        "• Contactos telefónicos moçambicanos (+258 84/82/86/87...) são convertidos em <code>[TELEFONE_ANONIMIZADO]</code>.<br/>"
        "• Endereços de e-mail são convertidos em <code>[EMAIL_ANONIMIZADO]</code>.",
        style_body
    ))

    story.append(Paragraph("4.4. Operação de IA Local na Máquina do Utilizador", style_h2))
    story.append(Paragraph(
        "O sistema está preparado para operar sem internet através de modelos locais como <b>Ollama (Mistral / Llama3)</b>:<br/>"
        "1. Instalar o Ollama na máquina: <code>https://ollama.com</code>.<br/>"
        "2. Executar no terminal: <code>ollama run mistral</code>.<br/>"
        "3. O backend do HospitalCare detecta automaticamente a porta local <code>11434</code> e comuta de imediato para a IA local com latência zero e custo nulo.",
        style_body
    ))

    story.append(Spacer(1, 14))

    # =========================================================================
    # SECÇÃO 5: GUIA DE VERIFICAÇÃO E CONCLUSÃO
    # =========================================================================
    story.append(Paragraph("5. Links de Acesso e Estado das Integrações", style_h1))

    links_data = [
        [Paragraph("Ambiente / Recurso", style_table_header), Paragraph("Endereço Web (URL)", style_table_header), Paragraph("Estado Operacional", style_table_header)],
        [
            Paragraph("<b>Portal Frontend (SPA)</b>", style_table_cell),
            Paragraph("https://tino1-eng.github.io/sistema-reclamacoes-hospitalar/#/", style_table_cell),
            Paragraph("<b>ONLINE (HTTP 200 OK)</b><br/>GitHub Pages Edge CDN", style_table_cell)
        ],
        [
            Paragraph("<b>Servidor Backend (REST)</b>", style_table_cell),
            Paragraph("https://sistema-reclamacoes-hospitalar-2.onrender.com", style_table_cell),
            Paragraph("<b>ONLINE (HTTP 200 OK)</b><br/>Uptime ativo no Render", style_table_cell)
        ],
        [
            Paragraph("<b>Documentação Swagger</b>", style_table_cell),
            Paragraph("https://sistema-reclamacoes-hospitalar-2.onrender.com/api/docs", style_table_cell),
            Paragraph("<b>ATIVO</b><br/>Especificação OpenAPI 3.0", style_table_cell)
        ],
        [
            Paragraph("<b>Base de Dados Atlas</b>", style_table_cell),
            Paragraph("cluster0.zxq3sk1.mongodb.net/hospitalcare", style_table_cell),
            Paragraph("<b>CONECTADA</b><br/>MongoDB Cloud Cluster", style_table_cell)
        ],
        [
            Paragraph("<b>Repositório de Código</b>", style_table_cell),
            Paragraph("https://github.com/tino1-ENG/sistema-reclamacoes-hospitalar", style_table_cell),
            Paragraph("<b>SINCRONIZADO</b><br/>Branch main actualizado", style_table_cell)
        ],
    ]

    t_links = Table(links_data, colWidths=[130, 240, 117])
    t_links.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_primary),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_bg_light]),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_links)

    # Constrói o PDF com o NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF gerado com sucesso em: {output_path}")

if __name__ == '__main__':
    out_dir = r"c:\Users\Tino Eduardo\Desktop\PROJECTO_DA"
    pdf_filename = os.path.join(out_dir, "Apresentacao_Tecnica_HospitalCare.pdf")
    build_presentation_pdf(pdf_filename)
