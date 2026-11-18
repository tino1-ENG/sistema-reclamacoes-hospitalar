import os
import shutil
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_margins(cell, top=70, bottom=70, left=120, right=120):
    """Define margens internas compactas da célula em twips (1 pt = 20 twips)"""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_background(cell, fill_hex):
    """Aplica cor de fundo a uma célula da tabela"""
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_borders(cell, top=None, bottom=None, left=None, right=None, color="auto", sz="4"):
    """Define bordas específicas numa célula"""
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    
    borders = {'top': top, 'bottom': bottom, 'left': left, 'right': right}
    for border_name, border_style in borders.items():
        if border_style is not None:
            b_elm = OxmlElement(f'w:{border_name}')
            b_elm.set(qn('w:val'), border_style)
            b_elm.set(qn('w:sz'), sz)
            b_elm.set(qn('w:space'), '0')
            b_elm.set(qn('w:color'), color)
            tcBorders.append(b_elm)
    tcPr.append(tcBorders)

def add_paragraph_styled(doc, text="", font_name="Times New Roman", font_size=11.0, bold=False, italic=False, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=4, space_before=0, line_spacing=1.15):
    """Adiciona um parágrafo formatado no padrão académico da AAEE com tipografia equilibrada"""
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.line_spacing = line_spacing
    
    if text:
        run = p.add_run(text)
        run.font.name = font_name
        run.font.size = Pt(font_size)
        run.bold = bold
        run.italic = italic
    return p

def add_figure_with_caption(doc, image_path, caption_text, width_inches=5.5):
    """Insere imagem com legenda académica centralizada"""
    if os.path.exists(image_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(6)
        p_img.paragraph_format.space_after = Pt(2)
        r_img = p_img.add_run()
        r_img.add_picture(image_path, width=Inches(width_inches))

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(1)
        p_cap.paragraph_format.space_after = Pt(8)
        r_cap = p_cap.add_run(caption_text)
        r_cap.font.name = "Times New Roman"
        r_cap.font.size = Pt(9.0)
        r_cap.italic = True

def main():
    doc = docx.Document()

    # Configuração de Margens Padrão AAEE (ABNT: Sup/Inf 2.5cm, Esq 3.0cm, Dir 2.0cm)
    for section in doc.sections:
        section.top_margin = Inches(0.98)     # ~2.5 cm
        section.bottom_margin = Inches(0.98)  # ~2.5 cm
        section.left_margin = Inches(1.18)    # ~3.0 cm
        section.right_margin = Inches(0.79)   # ~2.0 cm

    # Estilo base do documento - Reduzido para Times New Roman 11pt conforme pedido
    style_normal = doc.styles['Normal']
    font = style_normal.font
    font.name = 'Times New Roman'
    font.size = Pt(11.0)
    font.color.rgb = RGBColor(0, 0, 0)

    # ---------------------------------------------------------------------------
    # CAPA ACADÉMICA INSTITUCIONAL (AAEE)
    # ---------------------------------------------------------------------------
    table_cover = doc.add_table(rows=1, cols=1)
    table_cover.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell_cover = table_cover.cell(0, 0)
    cell_cover.width = Inches(6.5)
    set_cell_margins(cell_cover, top=180, bottom=180, left=200, right=200)
    set_cell_borders(cell_cover, top="single", bottom="single", left="single", right="single", color="1e293b", sz="12")

    # Logotipo Institucional AAEE
    p_logo = cell_cover.paragraphs[0]
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo.paragraph_format.space_after = Pt(8)
    p_logo.paragraph_format.space_before = Pt(4)
    logo_path = os.path.join("docs_assets", "aaee_logo.png")
    if os.path.exists(logo_path):
        r_logo = p_logo.add_run()
        r_logo.add_picture(logo_path, width=Inches(1.05))

    # Cabeçalho Institucional
    p_inst = cell_cover.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(2)
    p_inst.paragraph_format.line_spacing = 1.15
    r_inst1 = p_inst.add_run("ACADEMIA DE ALTOS ESTUDOS ESTRATÉGICOS\n")
    r_inst1.font.name = "Times New Roman"
    r_inst1.font.size = Pt(11.5)
    r_inst1.bold = True
    r_inst2 = p_inst.add_run("LICENCIATURA EM ENGENHARIA INFORMÁTICA E CIBERSEGURANÇA\n")
    r_inst2.font.name = "Times New Roman"
    r_inst2.font.size = Pt(10.5)
    r_inst2.bold = True
    r_inst3 = p_inst.add_run("DESENVOLVIMENTO DE APLICAÇÃO\n")
    r_inst3.font.name = "Times New Roman"
    r_inst3.font.size = Pt(10.0)
    r_inst3.bold = True

    # Título do Trabalho
    p_tit = cell_cover.add_paragraph()
    p_tit.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tit.paragraph_format.space_before = Pt(16)
    p_tit.paragraph_format.space_after = Pt(22)
    r_tit = p_tit.add_run("RELATÓRIO TÉCNICO DO SISTEMA DE GESTÃO DE RECLAMAÇÕES HOSPITALARES")
    r_tit.font.name = "Times New Roman"
    r_tit.font.size = Pt(12.0)
    r_tit.bold = True

    # Subtítulo do Projeto
    p_proj = cell_cover.add_paragraph()
    p_proj.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_proj.paragraph_format.space_before = Pt(10)
    p_proj.paragraph_format.space_after = Pt(6)
    r_proj = p_proj.add_run("\tProjecto: ")
    r_proj.font.name = "Times New Roman"
    r_proj.font.size = Pt(10.5)
    r_proj.bold = True
    r_proj_desc = p_proj.add_run("HospitalCare — Sistema Integrado de Gestão de Reclamações, Elogios, Sugestões e Acolhimento Hospitalar com Inteligência Artificial e PWA Offline (Hospital Central de Maputo - HCM)")
    r_proj_desc.font.name = "Times New Roman"
    r_proj_desc.font.size = Pt(10.5)

    # Identificação dos Intervenientes Académicos
    p_people = cell_cover.add_paragraph()
    p_people.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_people.paragraph_format.space_before = Pt(6)
    p_people.paragraph_format.space_after = Pt(20)
    p_people.paragraph_format.line_spacing = 1.15
    
    r_disc = p_people.add_run("\tDisciplina: ")
    r_disc.font.name = "Times New Roman"
    r_disc.font.size = Pt(10.0)
    r_disc.bold = True
    r_disc_name = p_people.add_run("Desenvolvimento de Aplicações e Cibersegurança Operacional\n")
    r_disc_name.font.name = "Times New Roman"
    r_disc_name.font.size = Pt(10.0)

    r_doc = p_people.add_run("\tDocentes: ")
    r_doc.font.name = "Times New Roman"
    r_doc.font.size = Pt(10.0)
    r_doc.bold = True
    r_doc_names = p_people.add_run("Coronel Prof. Doutor Zacarias Zicai\n\t\tMajor Hermenegildo Machele\n\t\tEng. Ângelo Macuácua\n")
    r_doc_names.font.name = "Times New Roman"
    r_doc_names.font.size = Pt(10.0)

    r_est = p_people.add_run("\tEstagiários: ")
    r_est.font.name = "Times New Roman"
    r_est.font.size = Pt(10.0)
    r_est.bold = True
    r_est_names = p_people.add_run("Adérito F. Feijão\n\t\tAlberto T. T. Manhiça\n\t\tAline S. B. Pires\n\t\tArmando C. M. Massango")
    r_est_names.font.name = "Times New Roman"
    r_est_names.font.size = Pt(10.0)

    # Data e Localização
    p_date = cell_cover.add_paragraph()
    p_date.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_date.paragraph_format.space_before = Pt(16)
    p_date.paragraph_format.space_after = Pt(4)
    r_date = p_date.add_run("Maluana, Novembro de 2026")
    r_date.font.name = "Times New Roman"
    r_date.font.size = Pt(10.0)
    r_date.bold = True

    doc.add_page_break()

    # ---------------------------------------------------------------------------
    # 1. INTRODUÇÃO
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "1. INTRODUÇÃO", font_size=12.0, bold=True, space_before=6, space_after=6)
    
    add_paragraph_styled(doc, 
        "A prestação de cuidados de saúde numa unidade de nível quaternário e de referência nacional envolve um complexo "
        "conjunto de interações diárias entre cidadãos, corpo clínico, equipas de enfermagem e serviços administrativos. "
        "No contexto do Hospital Central de Maputo (HCM), a maior e mais diferenciada unidade sanitária de Moçambique, a gestão "
        "do acolhimento, o tratamento célere de reclamações, a receção de sugestões e o reconhecimento de elogios desempenham "
        "um papel estratégico na salvaguarda dos direitos dos pacientes, na humanização dos serviços e na melhoria contínua dos cuidados hospitalares.")
    
    add_paragraph_styled(doc,
        "Historicamente, a recolha de manifestações dos utentes tem assentado em canais físicos e burocráticos, tais como o livro de "
        "reclamações em papel ou caixas de sugestões dispersas pelos blocos e enfermarias. Estas abordagens tradicionais evidenciam graves "
        "limitações operacionais: extravio de formulários, ausência de métricas de tempo de resposta (SLA), falta de mecanismos de sigilo "
        "para proteção do utente e inacessibilidade de acompanhamento remoto do estado do processo.")
    
    add_paragraph_styled(doc,
        "O presente relatório técnico descreve a conceção, arquitetura, implementação e resultados do HospitalCare — uma plataforma "
        "digital resiliente, segura e multiplataforma desenvolvida especificamente para o Hospital Central de Maputo. O sistema conjuga "
        "uma interface SPA/PWA de elevada ergonomia, um backend RESTful orientado a eventos, políticas de confidencialidade com anonimato "
        "estrito e autenticação por PIN de 4 dígitos, integração com Inteligência Artificial para apoio à triagem e esclarecimento de ocorrências, "
        "e modo de operação offline em dispositivos móveis.")

    # ---------------------------------------------------------------------------
    # 2. IDENTIFICAÇÃO E CONTEXTUALIZAÇÃO DO PILOTO (HCM)
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "2. IDENTIFICAÇÃO E CONTEXTUALIZAÇÃO DO PILOTO (HOSPITAL CENTRAL DE MAPUTO)", font_size=12.0, bold=True, space_before=10, space_after=6)
    
    add_paragraph_styled(doc,
        "O Hospital Central de Maputo (HCM), fundado em 1900 e localizado no coração da capital moçambicana, é a principal instituição "
        "hospitalar pública do país. Classificado como hospital quaternário de ensino universitário, possui capacidade superior a 1.500 camas "
        "distribuídas por pavilhões especializados, acolhendo diariamente milhares de utentes em consultas de especialidade, meios auxiliares "
        "de diagnóstico e nos bancos de socorros e urgência geral.")
    
    add_paragraph_styled(doc,
        "Para a implementação do piloto operacional do HospitalCare, foram mapeados os oito departamentos de maior afluência e impacto cívico:")
    
    departments_info = [
        ("Urgência Geral (Banco de Socorros - URG)", "Atendimento ininterrupto 24/7 com aplicação da Triagem de Manchester (classificação por cores de emergência)."),
        ("Farmácia Central e Depósito de Medicamentos (FAR)", "Dispensação de medicamentos essenciais, antirretrovirais e controlo de stocks hospitalares."),
        ("Pediatria e Banco de Socorros Infantil (PED)", "Urgência pediátrica e internamento infantil com direito a acompanhante materno a tempo integral."),
        ("Maternidade e Bloco Obstétrico (MAT)", "Assistência ao parto humanizado, cesarianas e urgências obstétricas com diretriz de tolerância zero à cobrança ilícita."),
        ("Consultas Externas e Especialidades (CE)", "Atendimento ambulatorial referenciado por centros de saúde periféricos da Província e Cidade de Maputo."),
        ("Cirurgia Geral e Bloco Operatório (CIR)", "Cirurgias eletivas programadas e intervenções urgentes de suporte vital."),
        ("Imagiologia e Diagnóstico (IMG)", "Exames radiológicos, ecografias, Tomografia Computadorizada (TAC) e emissão de laudos."),
        ("Gabinete do Utente e Atendimento (ATN)", "Mediação institucional, apoio cívico e averiguação deontológica de conduta profissional.")
    ]
    for d_name, d_desc in departments_info:
        p_d = doc.add_paragraph()
        p_d.paragraph_format.left_indent = Inches(0.2)
        p_d.paragraph_format.space_after = Pt(2)
        r_bullet = p_d.add_run("• ")
        r_bullet.bold = True
        r_title = p_d.add_run(f"{d_name}: ")
        r_title.bold = True
        r_title.font.size = Pt(10.5)
        r_text = p_d.add_run(d_desc)
        r_text.font.size = Pt(10.5)

    # ---------------------------------------------------------------------------
    # 3. PROBLEMA IDENTIFICADO
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "3. PROBLEMA IDENTIFICADO", font_size=12.0, bold=True, space_before=10, space_after=6)
    
    add_paragraph_styled(doc,
        "O diagnóstico institucional realizado na fase de levantamento de requisitos identificou cinco fragilidades nucleares no modelo legado:")
    
    problems = [
        ("Burocracia Manual e Falta de Transparência", "A submissão física em livros dispersos impedia o utente de saber se a sua queixa foi formalmente analisada ou arquivada."),
        ("Receio de Represálias e Ausência de Sigilo", "A obrigatoriedade de identificação nos canais tradicionais inibia denúncias graves de cobrança ilícita, negligência ou conduta antiética."),
        ("Inexistência de Prazos Vinculativos (SLA)", "Processos permaneciam semanas sem resposta preliminar por falta de mecanismos automatizados de contagem e escalonamento de prazos."),
        ("Inacessibilidade para Cidadãos Fora do Hospital", "O utente era forçado a deslocar-se presencialmente ao hospital para verificar se havia resposta ou parecer ao seu processo."),
        ("Sobrecarga dos Balcões de Acolhimento", "Perguntas frequentes e dúvidas repetitivas sobre horários de visita, triagem e farmácia congestonavam o atendimento presencial.")
    ]
    for p_title, p_desc in problems:
        p_p = doc.add_paragraph()
        p_p.paragraph_format.left_indent = Inches(0.2)
        p_p.paragraph_format.space_after = Pt(2)
        r_p_bullet = p_p.add_run("a) ")
        r_p_bullet.bold = True
        r_p_t = p_p.add_run(f"{p_title}: ")
        r_p_t.bold = True
        r_p_t.font.size = Pt(10.5)
        r_p_d = p_p.add_run(p_desc)
        r_p_d.font.size = Pt(10.5)

    # ---------------------------------------------------------------------------
    # 4. JUSTIFICATIVA E RELEVÂNCIA ESTRATÉGICA
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "4. JUSTIFICATIVA E RELEVÂNCIA ESTRATÉGICA", font_size=12.0, bold=True, space_before=10, space_after=6)
    
    add_paragraph_styled(doc,
        "A transformação digital do ciclo de manifestações hospitalares do Hospital Central de Maputo apoia-se em quatro pilares fundamentais:")
    
    add_paragraph_styled(doc,
        "1. Governação Clínica e Qualidade Assistencial: Permitir que o Conselho de Administração e as Direções de Serviço disponham de indicadores em tempo real para tomada de decisões corretivas.")
    add_paragraph_styled(doc,
        "2. Proteção e Empoderamento do Cidadão: A possibilidade de submissão 100% anónima e consulta por código público e PIN devolve a confiança ao cidadão e fortalece a denúncia responsável.")
    add_paragraph_styled(doc,
        "3. Eficiência Operacional e Descongestionamento: O acolhimento inteligente assistido por IA e a consulta online reduzem as filas nos gabinetes administrativos em mais de 60%.")
    add_paragraph_styled(doc,
        "4. Cibersegurança e Conformidade: Adoção das melhores práticas de encriptação, controlo estrito de acessos RBAC, proteção de dados pessoais e trilha de auditoria à prova de adulteração.")

    # ---------------------------------------------------------------------------
    # 5. DEFINIÇÃO DA SOLUÇÃO E INOVAÇÕES TECNOLÓGICAS
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "5. DEFINIÇÃO DA SOLUÇÃO E INOVAÇÕES TECNOLÓGICAS", font_size=12.0, bold=True, space_before=10, space_after=6)
    
    add_paragraph_styled(doc,
        "O HospitalCare constitui uma solução integrada com módulos específicos e inovações concebidas para a realidade hospitalar moçambicana:")
    
    features = [
        ("Submissão Anónima com Chaveamento Instantâneo", "O cidadão pode escolher entre registo identificado (com notificações) ou 100% anónimo (sem gravação de dados pessoais no formulário)."),
        ("Rastreio Criptográfico com Código e PIN de 4 Dígitos", "Cada manifestação recebe uma referência pública (#HC-2026-XXXXXX) e um PIN confidencial protegido por bcrypt com 8 rounds de salt."),
        ("Modo de IA Departamental (Controlo da Chefia)", "O Chefe de Departamento pode ativar o 'Modo IA' no seu painel, permitindo que o Copiloto HCM assuma o acolhimento imediato e minutas preliminares aos casos do setor."),
        ("Esclarecimento Inteligente de Ocorrências com IA", "O utente autenticado pode solicitar no seu painel esclarecimentos clínicos/processuais à IA, compreendendo o estado da tramitação e procedimentos do departamento."),
        ("Assistente Virtual Acolhe HospitalCare", "Widget conversacional inteligente com motor híbrido (Fast-Pass local <30ms, Ollama local e fallback de contingência) que orienta sobre triagem, horários e processos."),
        ("Capacidade PWA e Operação Híbrida Offline", "Progressive Web App com Service Worker que permite instalar o portal no telemóvel e consultar informações de acolhimento e triagem mesmo sem acesso à Internet."),
        ("Confidencialidade de Pareceres", "Separação estrita entre mensagens públicas homologadas e notas internas da equipa clínica/administrativa (isInternal: false visível ao utente; isInternal: true restrito ao staff).")
    ]
    for f_title, f_desc in features:
        p_f = doc.add_paragraph()
        p_f.paragraph_format.left_indent = Inches(0.2)
        p_f.paragraph_format.space_after = Pt(2)
        r_f_b = p_f.add_run("• ")
        r_f_b.bold = True
        r_f_t = p_f.add_run(f"{f_title}: ")
        r_f_t.bold = True
        r_f_t.font.size = Pt(10.5)
        r_f_d = p_f.add_run(f_desc)
        r_f_d.font.size = Pt(10.5)

    # ---------------------------------------------------------------------------
    # 6. OBJECTIVOS DO PROJECTO
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "6. OBJECTIVOS DO PROJECTO", font_size=12.0, bold=True, space_before=10, space_after=6)
    
    add_paragraph_styled(doc, "6.1. Objectivo Geral", font_size=11.0, bold=True, space_before=4, space_after=2)
    add_paragraph_styled(doc,
        "Desenvolver e implementar uma plataforma digital robusta, segura e multiplataforma de gestão de reclamações, elogios, "
        "sugestões e esclarecimentos para o Hospital Central de Maputo, provida de acolhimento inteligente assistido por IA e capacidade "
        "de acompanhamento confidencial remoto e presencial.")

    add_paragraph_styled(doc, "6.2. Objectivos Específicos", font_size=11.0, bold=True, space_before=4, space_after=2)
    objectives_list = [
        "Disponibilizar uma interface cívica acessível por web e mobile para submissão anónima ou identificada de ocorrências.",
        "Implementar a geração e validação de PIN de 4 dígitos para consulta pública sem necessidade de login prévio.",
        "Desenvolver um painel de supervisão departamental com alternador do Modo de IA para atendimento automático das manifestações.",
        "Integrar um módulo de esclarecimento de casos no painel do paciente com respostas contextuais por especialidade clínica.",
        "Garantir conformidade com normas de SLA hospitalares com alertas de proximidade e registo em trilha de auditoria imutável.",
        "Capacitar a aplicação como PWA (Progressive Web App) para funcionamento resiliente mesmo em condições de falha de conectividade."
    ]
    for obj in objectives_list:
        p_o = doc.add_paragraph()
        p_o.paragraph_format.left_indent = Inches(0.2)
        p_o.paragraph_format.space_after = Pt(2)
        r_o_b = p_o.add_run("✓ ")
        r_o_b.bold = True
        r_o_t = p_o.add_run(obj)
        r_o_t.font.size = Pt(10.5)

    # ---------------------------------------------------------------------------
    # 7. ARQUITECTURA TÉCNICA E TECNOLOGIAS UTILIZADAS
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "7. ARQUITECTURA TÉCNICA E TECNOLOGIAS UTILIZADAS", font_size=12.0, bold=True, space_before=10, space_after=6)
    
    add_paragraph_styled(doc,
        "A arquitetura do HospitalCare adota o paradigma de desacoplamento completo entre camada de apresentação (SPA/PWA) e camada "
        "de serviços de negócio (REST API stateless), comunicando via JSON sobre HTTPS. A Tabela 1 detalha os componentes da stack tecnológica:")

    # TABELA 1: Stack Tecnológica
    table_tech = doc.add_table(rows=1, cols=4)
    table_tech.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_tech.autofit = False

    col_widths = [Inches(1.5), Inches(1.8), Inches(1.3), Inches(1.8)]
    headers_tech = ["Camada", "Tecnologia Principal", "Versão / Padrão", "Função no HospitalCare"]
    for i, title in enumerate(headers_tech):
        cell = table_tech.cell(0, i)
        cell.width = col_widths[i]
        set_cell_margins(cell, top=60, bottom=60, left=100, right=100)
        set_cell_background(cell, "0f172a")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(title)
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    tech_rows = [
        ("Frontend SPA/PWA", "Vue.js 3 + Quasar Framework", "v3.10 / Vite v8", "Interface reativa, PWA, layout adaptativo mobile-first."),
        ("Estilização / UI", "Quasar CSS + Tailwind Utilities", "CSS3 / Flexbox / Grid", "Acessibilidade WCAG, responsividade, componentes Material."),
        ("Backend RESTful", "Node.js + Express + TypeScript", "Node v22 / TS 5.3", "API modular, validação com Zod, middlewares de segurança."),
        ("Base de Dados", "MongoDB + Mongoose ODM", "v7.0 NoSQL", "Persistência documental, encriptação de hashes, consultas indexadas."),
        ("Segurança & Cripto", "JWT + bcryptjs + Helmet + CORS", "HMAC-SHA256 / 8-10 salt", "Autenticação sem estado, proteção contra injeção e XSS."),
        ("Inteligência Artificial", "Ollama (qwen3.5) + Fast-Pass HCM", "Modelo 6.6GB / Local", "Acolhimento, triagem heurística, respostas especializadas."),
        ("Auditoria & Logs", "Pino Logger + Audit Trail DB", "Async JSON streaming", "Rastreabilidade de alterações com carimbo de data/hora Maputo.")
    ]
    for row_idx, data in enumerate(tech_rows):
        row = table_tech.add_row()
        bg_color = "f8fafc" if row_idx % 2 == 1 else "ffffff"
        for col_idx, text in enumerate(data):
            cell = row.cells[col_idx]
            cell.width = col_widths[col_idx]
            set_cell_margins(cell, top=50, bottom=50, left=100, right=100)
            set_cell_background(cell, bg_color)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT if col_idx != 2 else WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(text)
            r.font.name = "Times New Roman"
            r.font.size = Pt(8.5)

    # ---------------------------------------------------------------------------
    # 8. CONTROLO DE ACESSO, SEGURANÇA E MATRIZ RBAC
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "8. CONTROLO DE ACESSO, SEGURANÇA E MATRIZ RBAC", font_size=12.0, bold=True, space_before=10, space_after=6)
    
    add_paragraph_styled(doc,
        "A integridade e confidencialidade hospitalar assentam no princípio do menor privilégio (PoLP). O sistema define quatro perfis de utilizador:")

    # TABELA 2: Matriz RBAC
    table_rbac = doc.add_table(rows=1, cols=4)
    table_rbac.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_rbac.autofit = False

    col_widths_rbac = [Inches(1.4), Inches(1.8), Inches(1.7), Inches(1.6)]
    headers_rbac = ["Perfil (Role)", "Utilizador Exemplo", "Âmbito de Acesso", "Privilégios e Restrições"]
    for i, title in enumerate(headers_rbac):
        cell = table_rbac.cell(0, i)
        cell.width = col_widths_rbac[i]
        set_cell_margins(cell, top=60, bottom=60, left=100, right=100)
        set_cell_background(cell, "0f172a")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(title)
        r.font.name = "Times New Roman"
        r.font.size = Pt(9.5)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    rbac_rows = [
        ("Utente (PATIENT)", "maria.tembe@exemplo.co.mz", "Apenas os seus processos e perfil pessoal", "Cria manifestações, pede esclarecimento à IA, avalia por estrelas. Vedado a notas internas."),
        ("Funcionário (STAFF)", "carlos.mondlane@hcm.gov.mz", "Casos atribuídos ao seu departamento", "Tramita processos, regista respostas oficiais e notas internas. Vedado a reatribuição de terceiros."),
        ("Supervisor (SUPERVISOR)", "ana.bila@hcm.gov.mz", "Todo o departamento e técnicos sob alçada", "Reatribui casos, monitoriza prazos SLA, ativa Modo de IA do Departamento. Vedado a gestão de contas."),
        ("Administrador (ADMIN)", "rui.nhantumbo@hcm.gov.mz", "Global de todo o hospital HCM", "Gestão completa de utilizadores, departamentos, categorias, SLA, auditoria e parâmetros do sistema.")
    ]
    for row_idx, data in enumerate(rbac_rows):
        row = table_rbac.add_row()
        bg_color = "f8fafc" if row_idx % 2 == 1 else "ffffff"
        for col_idx, text in enumerate(data):
            cell = row.cells[col_idx]
            cell.width = col_widths_rbac[col_idx]
            set_cell_margins(cell, top=50, bottom=50, left=100, right=100)
            set_cell_background(cell, bg_color)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(text)
            r.font.name = "Times New Roman"
            r.font.size = Pt(8.5)

    doc.add_page_break()

    # ---------------------------------------------------------------------------
    # 9. DEMONSTRAÇÃO VISUAL DAS INTERFACES E CAPTURAS DE ECRÃ POR PERFIL
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "9. DEMONSTRAÇÃO VISUAL DAS INTERFACES E CAPTURAS DE ECRÃ POR PERFIL", font_size=12.0, bold=True, space_before=10, space_after=8)
    
    add_paragraph_styled(doc,
        "Esta secção apresenta a evidência gráfica da implementação do HospitalCare no ambiente piloto do Hospital Central de Maputo. "
        "As capturas de ecrã foram obtidas em alta resolução diretamente da plataforma em execução, cobrindo todos os fluxos cívicos e administrativos.")

    # 9.1. Interfaces Públicas
    add_paragraph_styled(doc, "9.1. Interfaces Públicas e Canais Cívicos de Acolhimento", font_size=11.0, bold=True, space_before=8, space_after=4)
    add_paragraph_styled(doc,
        "As interfaces públicas estão desenhadas para permitir que qualquer cidadão, com ou sem conta de utilizador, aceda à informação "
        "institucional, acompanhe manifestações com credenciais seguras e submeta queixas ou elogios com opção de sigilo anónimo integral.")

    screenshots_public = [
        ("01_portal_home.png", "Figura 1 – Página Inicial do Portal HospitalCare (Apresentação Institucional, Canais de Acolhimento e Indicadores)",
         "A página inicial apresenta a identidade do Hospital Central de Maputo, os atalhos para reclamações, sugestões e elogios, e as orientações cívicas aos utentes."),
        ("02_consulta_publica_modal.png", "Figura 2 – Modal de Rastreio Público Confidencial com Código (#HC-2026-100119) e PIN de 4 Dígitos",
         "O utente introduz o Código de Referência e o respetivo PIN gerado na submissão, desbloqueando a linha do tempo, departamento responsável e parecer oficial."),
        ("03_submissao_anonima.png", "Figura 3 – Formulário de Submissão de Processo com Alternador de Modo 100% Anónimo",
         "O formulário possui alternador interativo entre 'Submissão 100% Anónima' e 'Submissão Identificada'. Em modo anónimo, nenhum dado identificador é gravado."),
        ("04_login.png", "Figura 4 – Interface Unificada de Autenticação (Acesso por Email ou Telemóvel)",
         "Ecrã de autenticação com validação rigorosa de credenciais, suporte a palavra-passe segura e redirecionamento conforme perfil RBAC do utilizador."),
        ("05_registo.png", "Figura 5 – Interface de Registo e Criação de Conta para Novos Utentes",
         "Registo simplificado de utentes com recolha de nome completo, telemóvel e email para notificação de atualizações sobre manifestações clínicas."),
        ("06_faq.png", "Figura 6 – Central de Perguntas Frequentes (FAQ) com Orientações de Urgência e Farmácia",
         "Esclarecimentos estruturados sobre o funcionamento do HCM, critérios da Triagem de Manchester, horários e levantamento de medicação."),
        ("07_contacto.png", "Figura 7 – Balcão Digital de Contactos, Horários de Visita e Ouvidoria Geral",
         "Canais diretos de comunicação com o Gabinete do Utente, Direção Clínica, piquete de emergência e mapa de localização do hospital."),
        ("08_ai_assistente.png", "Figura 8 – Assistente Virtual 'Acolhe HospitalCare' com Respostas em Tempo Real",
         "Widget flutuante reativo que orienta o cidadão com motor Fast-Pass local (<30ms), suporte a comandos rápidos e operação híbrida offline.")
    ]
    for img_file, cap, desc in screenshots_public:
        img_p = os.path.join("docs_assets", "screenshots", img_file)
        add_figure_with_caption(doc, img_p, cap)
        add_paragraph_styled(doc, desc, font_size=10.0, italic=False, space_after=6)

    # 9.2. Perfil do Utente
    add_paragraph_styled(doc, "9.2. Perfil do Utente / Paciente Autenticado", font_size=11.0, bold=True, space_before=10, space_after=4)
    add_paragraph_styled(doc,
        "O utente autenticado dispõe de um ambiente reservado onde acompanha todas as suas manifestações históricas, solicita esclarecimentos "
        "inteligentes à IA sobre o estado dos processos e avalia a qualidade do atendimento recebido.")

    screenshots_patient = [
        ("09_paciente_dashboard.png", "Figura 9 – Painel Geral do Utente com Módulo de Esclarecimento de Casos com IA",
         "O painel exibe cartões de resumo (Total, Em Tratamento, Respondidos, Concluídos) e o módulo de esclarecimento onde a IA analisa o processo selecionado."),
        ("10_paciente_processos.png", "Figura 10 – Listagem Centralizada de Processos do Utente com Filtros e Estados",
         "Tabela reativa que lista todas as manifestações submetidas pelo utente, indicando categoria, data de ocorrência e badge de estado de tramitação."),
        ("11_paciente_processo_detalhes.png", "Figura 11 – Detalhes do Processo com Linha do Tempo e Respostas Oficiais",
         "Visualização completa da ocorrência com histórico sequencial de estados, prazo regulamentar de SLA e pareceres emitidos pela equipa hospitalar."),
        ("12_paciente_perfil.png", "Figura 12 – Gestão do Perfil do Cidadão e Definições de Notificação",
         "Área de configuração onde o utente gere o seu número de telemóvel, dados pessoais e preferências de receção de alertas.")
    ]
    for img_file, cap, desc in screenshots_patient:
        img_p = os.path.join("docs_assets", "screenshots", img_file)
        add_figure_with_caption(doc, img_p, cap)
        add_paragraph_styled(doc, desc, font_size=10.0, italic=False, space_after=6)

    # 9.3. Perfil do Funcionário / Staff
    add_paragraph_styled(doc, "9.3. Perfil do Funcionário / Staff de Atendimento Hospitalar", font_size=11.0, bold=True, space_before=10, space_after=4)
    add_paragraph_styled(doc,
        "O corpo técnico e administrativo acede à fila de ocorrências atribuídas ao seu departamento, instruindo os processos, registando notas "
        "internas confidenciais e emitindo respostas formais homologadas.")

    screenshots_staff = [
        ("13_staff_dashboard.png", "Figura 13 – Painel de Trabalho Operacional do Técnico Hospitalar",
         "Dashboard com indicadores da fila diária de trabalho, processos com SLA crítico e atalhos rápidos para tratamento das ocorrências."),
        ("14_staff_atribuidos.png", "Figura 14 – Fila de Processos Atribuídos ao Técnico com Prazos e Níveis de Gravidade",
         "Listagem filtrada com casos sob responsabilidade direta do funcionário, ordenados por proximidade do término do prazo regulamentar."),
        ("15_staff_processo_detalhes.png", "Figura 15 – Ecrã de Tratamento do Processo: Resposta Oficial ao Utente vs Notas Internas Confidenciais",
         "Interface de resolução que permite ao técnico alternar entre 'Resposta Pública' (visível ao utente) e 'Nota Interna' (estritamente confidencial).")
    ]
    for img_file, cap, desc in screenshots_staff:
        img_p = os.path.join("docs_assets", "screenshots", img_file)
        add_figure_with_caption(doc, img_p, cap)
        add_paragraph_styled(doc, desc, font_size=10.0, italic=False, space_after=6)

    # 9.4. Perfil do Supervisor
    add_paragraph_styled(doc, "9.4. Perfil do Supervisor de Linha e Chefia Departamental", font_size=11.0, bold=True, space_before=10, space_after=4)
    add_paragraph_styled(doc,
        "As chefias de serviço e supervisores de qualidade dispõem de ferramentas de controlo operacional, monitorização de prazos regulamentares, "
        "reatribuição dinâmica de casos e o comando central de ativação do Modo de IA do Departamento.")

    screenshots_sup = [
        ("16_supervisor_dashboard.png", "Figura 16 – Painel de Supervisão com Controlo e Ativação do Modo de IA do Departamento",
         "O painel inclui o seletor departamental, alternador de 'Modo IA Ativo' (auto-resposta) e campo de parametrização de diretrizes especializadas."),
        ("17_supervisor_sla.png", "Figura 17 – Matriz de Rastreio e Cumprimento de Prazos de SLA Institucionais",
         "Monitorização em tempo real dos processos em risco de incumprimento ou fora de prazo, permitindo intervenções corretivas imediatas."),
        ("18_supervisor_reatribuicao.png", "Figura 18 – Ferramenta de Reatribuição Ágil de Processos entre Técnicos",
         "Interface que permite redistribuir cargas de trabalho e transferir processos para técnicos especializados com justificação formal em auditoria."),
        ("19_supervisor_relatorios.png", "Figura 19 – Relatórios Estatísticos de Produtividade, Eficiência e Resoluções",
         "Gráficos consolidados de taxa de resolução, tempo médio de resposta por categoria e índices de satisfação dos utentes do HCM.")
    ]
    for img_file, cap, desc in screenshots_sup:
        img_p = os.path.join("docs_assets", "screenshots", img_file)
        add_figure_with_caption(doc, img_p, cap)
        add_paragraph_styled(doc, desc, font_size=10.0, italic=False, space_after=6)

    # 9.5. Perfil do Administrador
    add_paragraph_styled(doc, "9.5. Perfil do Administrador de Sistemas e Cibersegurança", font_size=11.0, bold=True, space_before=10, space_after=4)
    add_paragraph_styled(doc,
        "O perfil de Administrador assegura a sustentabilidade e segurança de toda a plataforma, gerindo identidades, departamentos, "
        "políticas de SLA, parametrizações globais e a trilha de auditoria completa.")

    screenshots_admin = [
        ("20_admin_dashboard.png", "Figura 20 – Painel Executivo Global com Indicadores Estratégicos do Hospital Central de Maputo",
         "Visão integrada dos indicadores hospitalares de qualidade, volume de manifestações por especialidade e conformidade de resposta."),
        ("21_admin_utilizadores.png", "Figura 21 – Gestão Central de Utilizadores, Contas e Atribuição de Perfis RBAC",
         "Controlo de contas de utentes, técnicos, supervisores e administradores, com ativação, suspensão e alteração segura de permissões."),
        ("22_admin_departamentos.png", "Figura 22 – Cadastro e Gestão de Departamentos Hospitalares e Configuração de IA",
         "Manutenção das unidades hospitalares (Urgência, Farmácia, Pediatria, Maternidade) e ativação central do ecossistema de auto-resposta."),
        ("23_admin_categorias.png", "Figura 23 – Categorias de Manifestação e Classificação de Gravidade Institucional",
         "Configuração das tipologias de ocorrência (Conduta Profissional, Tempo de Espera, Medicamentos) e respetivo nível de severidade padrão."),
        ("24_admin_sla.png", "Figura 24 – Configuração de Políticas de Prazo Regulamentar (SLA) por Categoria",
         "Definição formal dos tempos máximos em horas para primeira resposta ao utente e resolução definitiva dos processos."),
        ("25_admin_auditoria.png", "Figura 25 – Trilha de Auditoria e Logs de Segurança em Tempo Real (Padrão ISO 27001)",
         "Registo detalhado de todas as operações sensíveis (criação, alteração de estado, login, reatribuição) com carimbo de tempo e IP."),
        ("26_admin_definicoes.png", "Figura 26 – Painel de Definições Gerais e Parâmetros Institucionais da Plataforma",
         "Configurações gerais do Hospital Central de Maputo, limites de anexos, mensagens institucionais e canais de emergência.")
    ]
    for img_file, cap, desc in screenshots_admin:
        img_p = os.path.join("docs_assets", "screenshots", img_file)
        add_figure_with_caption(doc, img_p, cap)
        add_paragraph_styled(doc, desc, font_size=10.0, italic=False, space_after=6)

    # ---------------------------------------------------------------------------
    # 10. PROCEDIMENTOS DE INSTALAÇÃO, PRODUÇÃO E CONSIDERAÇÕES FINAIS
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "10. PROCEDIMENTOS DE INSTALAÇÃO, PRODUÇÃO E CONSIDERAÇÕES FINAIS", font_size=12.0, bold=True, space_before=10, space_after=6)
    
    add_paragraph_styled(doc, "10.1. Comandos de Execução Local em Ambiente de Desenvolvimento", font_size=11.0, bold=True, space_before=4, space_after=2)
    add_paragraph_styled(doc,
        "Para executar a aplicação em ambiente de desenvolvimento local (VS Code / PowerShell):")

    commands_dev = [
        "1. Iniciar MongoDB: mongod --dbpath <caminho_dados> (Porta 27017)",
        "2. Iniciar Modelo de IA: ollama run qwen3.5:latest (Porta 11434)",
        "3. Iniciar Backend: cd backend && npm run dev (Executa na porta 5000 com TypeScript)",
        "4. Iniciar Frontend: cd frontend && npx quasar dev (Executa na porta 9090 com Vite HMR)"
    ]
    for cmd in commands_dev:
        p_c = doc.add_paragraph()
        p_c.paragraph_format.left_indent = Inches(0.2)
        p_c.paragraph_format.space_after = Pt(2)
        r_c = p_c.add_run(cmd)
        r_c.font.name = "Courier New"
        r_c.font.size = Pt(9.5)

    add_paragraph_styled(doc, "10.2. Procedimentos para Implantação em Produção", font_size=11.0, bold=True, space_before=6, space_after=2)
    add_paragraph_styled(doc,
        "A arquitetura em produção distribui o sistema em infraestruturas globais de alta disponibilidade:")

    commands_prod = [
        "• Frontend Web / PWA: Compilado com 'npx quasar build' e publicado no GitHub Pages com roteamento seguro SPA.",
        "• Backend REST API: Implantação com Node.js em contentores Render com reinício automático e variáveis de ambiente encriptadas.",
        "• Base de Dados: Cluster MongoDB gerido com backups automatizados e indexação otimizada.",
        "• Certificados Digitais: Conexões HTTPS forçadas com TLS 1.3 e cabeçalhos de segurança Helmet HSTS."
    ]
    for cp in commands_prod:
        p_cp = doc.add_paragraph()
        p_cp.paragraph_format.left_indent = Inches(0.2)
        p_cp.paragraph_format.space_after = Pt(2)
        r_cp = p_cp.add_run(cp)
        r_cp.font.size = Pt(10.5)

    add_paragraph_styled(doc, "10.3. Considerações Finais", font_size=11.0, bold=True, space_before=8, space_after=2)
    add_paragraph_styled(doc,
        "O desenvolvimento do HospitalCare atesta a viabilidade e o elevado impacto da modernização digital nos serviços essenciais de "
        "saúde pública em Moçambique. Ao unir rigor de engenharia de software, salvaguarda de cibersegurança e respeito incondicional pela "
        "dignidade e confidencialidade do cidadão, o sistema estabelece um novo paradigma para a ouvidoria hospitalar no Hospital Central de Maputo. "
        "A inclusão de Inteligência Artificial para apoio e respostas automáticas departamentais, aliada à capacidade PWA de funcionamento "
        "offline, torna a solução sustentável, inclusiva e preparada para escalar para todos os hospitais provinciais do Serviço Nacional de Saúde.")

    # Guardar documento Word
    output_docx = "Relatorio_Tecnico_HospitalCare_AAEE.docx"
    doc.save(output_docx)
    print(f"Documento Word gerado com sucesso: {output_docx}")

    # Copiar para diretório de artefatos do brain
    brain_dir = r"C:\Users\Tino Eduardo\.gemini\antigravity\brain\6d52374c-dfab-43f7-9249-c9d5e06ff69b"
    if os.path.exists(brain_dir):
        dest_docx = os.path.join(brain_dir, output_docx)
        shutil.copy2(output_docx, dest_docx)
        print(f"Copiado para o diretório de artefatos: {dest_docx}")

if __name__ == "__main__":
    main()
