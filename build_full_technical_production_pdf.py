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
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#075985"))

        # Cabeçalho superior
        self.drawString(54, 800, "HospitalCare — Manual Técnico, Credenciais & Guia de Produção")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawRightString(541, 800, "Hospital Central de Maputo (HCM)")

        # Linha divisória do cabeçalho
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(54, 792, 541, 792)

        # Rodapé inferior
        self.line(54, 50, 541, 50)
        self.drawString(54, 38, "HospitalCare • Direcção de Tecnologias & Gabinete do Utente • Oficial")
        page_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(541, 38, page_text)

        self.restoreState()


def generate_pdf(output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Estilos customizados
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0F172A'),
        alignment=0,
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0284C7'),
        alignment=0,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=colors.HexColor('#075985'),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=body_style,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'DocCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )

    th_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=0
    )

    tb_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1E293B'),
        alignment=0
    )

    tb_code = ParagraphStyle(
        'TableCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#0F172A'),
        alignment=0
    )

    story = []

    # =========================================================================
    # CAPA / CABEÇALHO DO DOCUMENTO
    # =========================================================================
    # Banner de topo
    banner_data = [[
        Paragraph("<font color='white'><b>SISTEMA NACIONAL DE SAÚDE • HOSPITAL CENTRAL DE MAPUTO</b></font>", 
                  ParagraphStyle('Banner', fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=colors.white, alignment=1))
    ]]
    banner_table = Table(banner_data, colWidths=[487], rowHeights=[24])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#075985')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("HospitalCare — Manual Técnico Global", title_style))
    story.append(Paragraph("Tecnologias, Perfis de Utilizador, Motor de IA e Guia Completo de Produção", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#0284C7'), spaceBefore=0, spaceAfter=12))

    # Tabela resumo de metadados
    meta_data = [
        [
            Paragraph("<b>Unidade Piloto:</b> Hospital Central de Maputo (HCM)", tb_style),
            Paragraph("<b>Fuso Horário:</b> Africa/Maputo (GMT+2)", tb_style)
        ],
        [
            Paragraph("<b>Versão do Sistema:</b> 1.0.0 (Produção / Release)", tb_style),
            Paragraph("<b>Data de Emissão:</b> Novembro de 2026", tb_style)
        ],
        [
            Paragraph("<b>Frontend Produção:</b> https://tino1-eng.github.io/sistema-reclamacoes-hospitalar/#/", tb_code),
            Paragraph("<b>Backend API:</b> https://sistema-reclamacoes-hospitalar-2.onrender.com", tb_code)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[240, 247])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECÇÃO 1: VISÃO GERAL E CONCEITO OPERACIONAL
    # =========================================================================
    story.append(Paragraph("1. Visão Geral e Conceito Operacional", h1_style))
    story.append(Paragraph(
        "O <b>HospitalCare</b> é uma plataforma moderna concebida para transformar o relacionamento entre utentes e as instituições "
        "hospitalares em Moçambique. O sistema digitaliza o fluxo completo de manifestações (<b>Reclamações, Queixas, Sugestões, Pedidos de Informação e Elogios</b>), "
        "assegurando total confidencialidade, triagem assistida por Inteligência Artificial e controlo estrito de Acordos de Nível de Serviço (SLA).",
        body_style
    ))
    story.append(Paragraph(
        "• <b>Submissão Anónima ou Identificada:</b> O utente tem a opção de relatar ocorrências sem divulgar a sua identidade, recebendo um Código de Referência (ex: <code>#HC-2026-XXXX</code>) e um PIN de 4 dígitos para acompanhamento online e seguro.<br/>"
        "• <b>Proteção e Higienização de Dados:</b> Módulo residente de sanitização que remove automaticamente nomes, contactos telefónicos e números de identificação (BI/NUIT) antes do envio a motores de linguagem natural.<br/>"
        "• <b>Rastreabilidade e Transparência:</b> Cada processo percorre estados auditados (Recebido, Em Triagem, Em Investigação, Respondido, Concluído), com carimbo de data/hora imutável.",
        bullet_style
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECÇÃO 2: MATRIZ DE UTILIZADORES E CREDENCIAIS DE ACESSO
    # =========================================================================
    story.append(Paragraph("2. Perfis de Utilizador e Credenciais Pré-configuradas", h1_style))
    story.append(Paragraph(
        "O sistema implementa controlo de acesso baseado em papéis (RBAC - Role-Based Access Control) com 4 perfis corporativos e acesso anónimo ao cidadão:",
        body_style
    ))

    users_table_data = [
        [
            Paragraph("Perfil / Cargo", th_style),
            Paragraph("Nome Completo", th_style),
            Paragraph("Email de Acesso", th_style),
            Paragraph("Palavra-passe", th_style),
            Paragraph("Departamento / Atribuição", th_style)
        ],
        [
            Paragraph("<b>ADMIN</b><br/><font color='#0284C7'>Administrador</font>", tb_style),
            Paragraph("Eng. Rui Nhantumbo", tb_style),
            Paragraph("rui.nhantumbo@hcm.gov.mz", tb_code),
            Paragraph("<b>123456</b>", tb_style),
            Paragraph("Gabinete de Informática / Direcção Geral (Acesso total)", tb_style)
        ],
        [
            Paragraph("<b>SUPERVISOR</b><br/><font color='#059669'>Supervisor Clínico</font>", tb_style),
            Paragraph("Enf. Ana Bila", tb_style),
            Paragraph("ana.bila@hcm.gov.mz", tb_code),
            Paragraph("<b>123456</b>", tb_style),
            Paragraph("Supervisão Geral de Enfermagem e Qualidade (SLAs e relatórios)", tb_style)
        ],
        [
            Paragraph("<b>STAFF</b><br/><font color='#D97706'>Funcionário Triador</font>", tb_style),
            Paragraph("Dr. Carlos Mondlane", tb_style),
            Paragraph("carlos.mondlane@hcm.gov.mz", tb_code),
            Paragraph("<b>123456</b>", tb_style),
            Paragraph("Pediatria (PED) • Resposta e minuta com Copiloto IA", tb_style)
        ],
        [
            Paragraph("<b>STAFF</b><br/><font color='#D97706'>Farmacêutica Chefe</font>", tb_style),
            Paragraph("Dra. Fátima Noormahomed", tb_style),
            Paragraph("fatima.noormahomed@hcm.gov.mz", tb_code),
            Paragraph("<b>123456</b>", tb_style),
            Paragraph("Farmácia Central (FAR) • Auditoria de receitas e stock", tb_style)
        ],
        [
            Paragraph("<b>PATIENT</b><br/><font color='#64748B'>Utente Registado</font>", tb_style),
            Paragraph("Maria Tembe", tb_style),
            Paragraph("maria.tembe@exemplo.co.mz", tb_code),
            Paragraph("<b>123456</b>", tb_style),
            Paragraph("Portal do Paciente (Histórico unificado de queixas)", tb_style)
        ],
        [
            Paragraph("<b>PÚBLICO</b><br/><font color='#64748B'>Cidadão Anónimo</font>", tb_style),
            Paragraph("Qualquer Utente", tb_style),
            Paragraph("<i>Sem necessidade de email</i>", tb_style),
            Paragraph("<b>PIN (4 dígitos)</b>", tb_style),
            Paragraph("Submissão e acompanhamento público confidencial", tb_style)
        ]
    ]

    users_table = Table(users_table_data, colWidths=[80, 100, 137, 60, 110])
    users_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#075985')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(users_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECÇÃO 3: TECNOLOGIAS E BIBLIOTECAS EXTERNAS
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("3. Tecnologias e Bibliotecas Externas Utilizadas", h1_style))
    story.append(Paragraph(
        "A solução adota uma arquitetura desacoplada e baseada em padrões de código aberto com elevado suporte da indústria:",
        body_style
    ))

    story.append(Paragraph("3.1 Camada Frontend (Single Page Application)", h2_style))
    front_libs_data = [
        [Paragraph("Biblioteca / Módulo", th_style), Paragraph("Versão", th_style), Paragraph("Papel no Sistema", th_style)],
        [Paragraph("<b>Vue.js</b>", tb_style), Paragraph("3.5.22", tb_code), Paragraph("Framework reativo core com Composition API para componentes modulares.", tb_style)],
        [Paragraph("<b>Quasar Framework</b>", tb_style), Paragraph("2.35.1", tb_code), Paragraph("Biblioteca de UI médica institucional com suporte WCAG e responsividade total.", tb_style)],
        [Paragraph("<b>Vite</b>", tb_style), Paragraph("8.3.4", tb_code), Paragraph("Motor de build e empacotamento ultrarrápido com Hot Module Replacement.", tb_style)],
        [Paragraph("<b>TypeScript</b>", tb_style), Paragraph("6.0.0", tb_code), Paragraph("Tipagem estática rigorosa para garantir fiabilidade em dados clínicos.", tb_style)],
        [Paragraph("<b>Pinia</b>", tb_style), Paragraph("4.0.2", tb_code), Paragraph("Armazém centralizado de estado (sessão JWT, formulários, processos).", tb_style)],
        [Paragraph("<b>Vue Router</b>", tb_style), Paragraph("5.0.6", tb_code), Paragraph("Roteamento SPA em modo Hash para compatibilidade com GitHub Pages.", tb_style)],
        [Paragraph("<b>Axios</b>", tb_style), Paragraph("1.20.0", tb_code), Paragraph("Cliente HTTP assíncrono com interceptor de autorização JWT e timeout 30s.", tb_style)],
        [Paragraph("<b>Chart.js</b>", tb_style), Paragraph("4.5.1", tb_code), Paragraph("Painéis visuais com gráficos de SLA, queixas por serviço e resoluções.", tb_style)],
        [Paragraph("<b>date-fns</b>", tb_style), Paragraph("4.4.0", tb_code), Paragraph("Tratamento de datas e tempos decorridos no fuso de Maputo (GMT+2).", tb_style)],
        [Paragraph("<b>Zod</b>", tb_style), Paragraph("4.6.7", tb_code), Paragraph("Validação declarativa de esquemas de formulário no lado do cliente.", tb_style)],
        [Paragraph("<b>Sass Embedded</b>", tb_style), Paragraph("1.105.1", tb_code), Paragraph("Compilador nativo SCSS para personalização dos tokens de cor institucional.", tb_style)]
    ]
    front_table = Table(front_libs_data, colWidths=[120, 60, 307])
    front_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0284C7')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(front_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("3.2 Camada Backend (REST API & Base de Dados)", h2_style))
    back_libs_data = [
        [Paragraph("Biblioteca / Módulo", th_style), Paragraph("Versão", th_style), Paragraph("Papel no Sistema", th_style)],
        [Paragraph("<b>Node.js (ESM)</b>", tb_style), Paragraph("v22+", tb_code), Paragraph("Runtime JavaScript assíncrono executando em módulos ES nativos.", tb_style)],
        [Paragraph("<b>Express.js</b>", tb_style), Paragraph("4.21.2", tb_code), Paragraph("Framework web para roteamento, middlewares de segurança e controladores.", tb_style)],
        [Paragraph("<b>Mongoose</b>", tb_style), Paragraph("9.11.2", tb_code), Paragraph("Modelagem de objetos para MongoDB com esquemas estritos e índices.", tb_style)],
        [Paragraph("<b>MongoDB</b>", tb_style), Paragraph("7.0+", tb_code), Paragraph("Base de dados documental NoSQL (Local e MongoDB Atlas Cloud).", tb_style)],
        [Paragraph("<b>jsonwebtoken</b>", tb_style), Paragraph("9.0.2", tb_code), Paragraph("Emissão e validação de tokens JWT com expiração e assinatura criptográfica.", tb_style)],
        [Paragraph("<b>bcryptjs</b>", tb_style), Paragraph("2.4.3", tb_code), Paragraph("Hashing seguro e irreversível de senhas com salting de 10 rounds.", tb_style)],
        [Paragraph("<b>Helmet</b>", tb_style), Paragraph("8.0.0", tb_code), Paragraph("Configuração de cabeçalhos de segurança HTTP contra vulnerabilidades comuns.", tb_style)],
        [Paragraph("<b>Express Rate Limit</b>", tb_style), Paragraph("7.5.0", tb_code), Paragraph("Proteção anti-abuso e controlo de taxa de requisições por IP.", tb_style)],
        [Paragraph("<b>Multer</b>", tb_style), Paragraph("2.5.0", tb_code), Paragraph("Processamento de uploads multipart (fotos, guias médicas, receitas).", tb_style)],
        [Paragraph("<b>Pino & Pino HTTP</b>", tb_style), Paragraph("9.6.0", tb_code), Paragraph("Logging JSON estruturado de alto rendimento para auditoria forense.", tb_style)],
        [Paragraph("<b>Swagger UI Express</b>", tb_style), Paragraph("5.0.1", tb_code), Paragraph("Documentação interativa OpenAPI 3.0 disponível em /api/docs.", tb_style)],
        [Paragraph("<b>@google/generative-ai</b>", tb_style), Paragraph("0.24.1", tb_code), Paragraph("SDK para orquestração de prompts com Google Gemini 1.5 Flash.", tb_style)]
    ]
    back_table = Table(back_libs_data, colWidths=[120, 60, 307])
    back_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#075985')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(back_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECÇÃO 4: ARQUITETURA DO MOTOR DE INTELIGÊNCIA ARTIFICIAL
    # =========================================================================
    story.append(Paragraph("4. Motor de Inteligência Artificial Híbrido", h1_style))
    story.append(Paragraph(
        "O HospitalCare adota uma estratégia de tripla contingência inteligente concebida para contornar falhas de internet e garantir a soberania de dados do hospital:",
        body_style
    ))
    story.append(Paragraph(
        "1. <b>Higienização de Dados Sensíveis (Data Scrubber):</b> Todo o texto inserido pelo cidadão passa por filtros de regex e dicionários locais que substituem nomes, telefones e identificações civis antes de qualquer chamada a modelos de IA.<br/>"
        "2. <b>IA Local On-Premises (Ollama):</b> Executa o modelo <code>qwen3.5:latest</code> (9.7B parâmetros, 6.6 GB) dentro da própria infraestrutura do HCM, sem dependência de internet exterior.<br/>"
        "3. <b>IA Cloud Elástica (Google Gemini 1.5 Flash):</b> Fornece capacidade de resposta rápida na nuvem com timeout estrito de 10 segundos.<br/>"
        "4. <b>Motor Residente Zero-Fail do HCM:</b> Incorporado diretamente no frontend. Se o servidor estiver a despertar ou a conexão cair, o assistente <i>Acolhe HospitalCare</i> responde em <b>0 ms</b> com dados verificados de farmácia, acompanhamento com PIN e urgências.",
        bullet_style
    ))
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECÇÃO 5: GUIA COMPLETO PARA COLOCAR EM PRODUÇÃO
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("5. Comandos e Guia Completo para Colocar em Produção", h1_style))
    story.append(Paragraph(
        "Apresentam-se abaixo os procedimentos oficiais e os comandos exatos para implantar o sistema tanto na nuvem pública como em servidores locais dedicados do hospital.",
        body_style
    ))

    story.append(Paragraph("5.1 Cenário A: Produção Híbrida na Nuvem (Ativa / Recomendada)", h2_style))
    story.append(Paragraph(
        "Neste modelo, o frontend é hospedado no <b>GitHub Pages</b> (alta disponibilidade global, custo zero e CDN da Cloudflare) e o backend corre no <b>Render</b> conectado ao <b>MongoDB Atlas</b>.",
        body_style
    ))

    cloud_box = [
        [Paragraph("<b>Passos e Comandos para Implantação na Nuvem:</b>", tb_style)],
        [Paragraph(
            "<b>1. Compilar e Publicar o Frontend no GitHub Pages:</b><br/>"
            "<code>cd frontend</code><br/>"
            "<code>npm run build</code><br/>"
            "<code>git add .</code><br/>"
            "<code>git commit -m \"feat: deploy producao hospitalcare\"</code><br/>"
            "<code>git push origin main</code><br/>"
            "<i>(O workflow .github/workflows/deploy.yml compila a SPA e faz o deploy automático para a branch gh-pages).</i><br/><br/>"
            "<b>2. URL de Produção Ativa do Cidadão:</b><br/>"
            "<font color='#0284C7'><b>https://tino1-eng.github.io/sistema-reclamacoes-hospitalar/#/</b></font><br/><br/>"
            "<b>3. Variáveis de Ambiente no Painel do Render (Environment Variables):</b><br/>"
            "• <code>NODE_ENV</code> = <code>production</code><br/>"
            "• <code>DATABASE_URL</code> = <code>mongodb+srv://&lt;user&gt;:&lt;pass&gt;@cluster0.mongodb.net/hospitalcare</code><br/>"
            "• <code>JWT_SECRET</code> = <code>hospitalcare_chave_mestre_producao_2026_mz</code><br/>"
            "• <code>JWT_REFRESH_SECRET</code> = <code>hospitalcare_refresh_mestre_producao_2026_mz</code><br/>"
            "• <code>CORS_ORIGIN</code> = <code>*</code><br/>"
            "• <code>AI_PROVIDER</code> = <code>auto</code><br/>"
            "• <code>GEMINI_API_KEY</code> = <code>&lt;Chave_Oficial_Google_Gemini&gt;</code>",
            tb_style
        )]
    ]
    cloud_table = Table(cloud_box, colWidths=[487])
    cloud_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F0F9FF')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#0284C7')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(cloud_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("5.2 Cenário B: Produção em Servidor Próprio / Linux Ubuntu (On-Premises no HCM)", h2_style))
    story.append(Paragraph(
        "Para implantar num servidor dedicado físico ou máquina virtual Ubuntu Server no data center do HCM:",
        body_style
    ))

    linux_cmds = [
        [Paragraph("<b>Etapa</b>", th_style), Paragraph("Comandos de Terminal (Bash / Ubuntu Server)", th_style)],
        [
            Paragraph("<b>1. Instalar Pré-requisitos</b>", tb_style),
            Paragraph(
                "<code>curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -</code><br/>"
                "<code>sudo apt-get install -y nodejs mongodb nginx git</code><br/>"
                "<code>sudo npm install -g pm2</code>",
                tb_code
            )
        ],
        [
            Paragraph("<b>2. Clonar e Instalar</b>", tb_style),
            Paragraph(
                "<code>git clone https://github.com/tino1-ENG/sistema-reclamacoes-hospitalar.git /var/www/hospitalcare</code><br/>"
                "<code>cd /var/www/hospitalcare/backend && npm ci && npm run build</code><br/>"
                "<code>cd /var/www/hospitalcare/frontend && npm ci && npm run build</code>",
                tb_code
            )
        ],
        [
            Paragraph("<b>3. Povoar Base de Dados</b>", tb_style),
            Paragraph(
                "<code>cd /var/www/hospitalcare/backend</code><br/>"
                "<code>npm run seed</code>",
                tb_code
            )
        ],
        [
            Paragraph("<b>4. Iniciar Serviço com PM2 (Daemon Permanente)</b>", tb_style),
            Paragraph(
                "<code>pm2 start dist/server.js --name hospitalcare-api -i max</code><br/>"
                "<code>pm2 save</code><br/>"
                "<code>pm2 startup</code>",
                tb_code
            )
        ],
        [
            Paragraph("<b>5. Configurar Nginx (Reverse Proxy + SSL)</b>", tb_style),
            Paragraph(
                "<code>sudo nano /etc/nginx/sites-available/hospitalcare</code><br/>"
                "<i>(Configurar proxy_pass para http://127.0.0.1:5000)</i><br/>"
                "<code>sudo ln -s /etc/nginx/sites-available/hospitalcare /etc/nginx/sites-enabled/</code><br/>"
                "<code>sudo systemctl restart nginx</code>",
                tb_code
            )
        ]
    ]
    linux_table = Table(linux_cmds, colWidths=[120, 367])
    linux_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(linux_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECÇÃO 6: EXECUÇÃO LOCAL RÁPIDA NO VISUAL STUDIO CODE
    # =========================================================================
    story.append(KeepTogether([
        Paragraph("6. Resumo Executivo: Como Correr no VS Code", h1_style),
        Paragraph("Para equipas técnicas que queiram executar e depurar a solução localmente no VS Code:", body_style),
        Paragraph(
            "<b>Terminal 1 — Backend (Porta 5000):</b><br/>"
            "<code>cd backend</code><br/>"
            "<code>npm run dev</code><br/>"
            "<i>(Disponível em: http://localhost:5000/api e documentação em http://localhost:5000/api/docs)</i><br/><br/>"
            "<b>Terminal 2 — Frontend (Porta 9090):</b><br/>"
            "<code>cd frontend</code><br/>"
            "<code>npm run dev</code><br/>"
            "<i>(Disponível em: http://localhost:9090/#/)</i>",
            bullet_style
        ),
        Spacer(1, 10),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceBefore=8, spaceAfter=8),
        Paragraph(
            "<font color='#64748B'><b>HospitalCare HCM • Ministério da Saúde de Moçambique • Todos os direitos reservados</b></font>",
            ParagraphStyle('FooterNotice', fontName='Helvetica', fontSize=8, leading=10, textColor=colors.HexColor('#64748B'), alignment=1)
        )
    ]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] PDF gerado com sucesso em: {output_path}")

if __name__ == "__main__":
    out_pdf = "Manual_Tecnico_Credenciais_Producao_HospitalCare.pdf"
    generate_pdf(out_pdf)
