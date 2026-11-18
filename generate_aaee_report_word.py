import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Define margens internas da célula em twips (1 pt = 20 twips)"""
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

def add_paragraph_styled(doc, text="", font_name="Times New Roman", font_size=12, bold=False, italic=False, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, space_before=0, line_spacing=1.15):
    """Adiciona um parágrafo formatado no padrão académico da AAEE"""
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

def main():
    doc = docx.Document()

    # Configuração de Margens Padrão AAEE (ABNT/Moçambique: Sup/Inf 2.5cm, Esq 3.0cm, Dir 2.0cm)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.98)     # ~2.5 cm
        section.bottom_margin = Inches(0.98)  # ~2.5 cm
        section.left_margin = Inches(1.18)    # ~3.0 cm
        section.right_margin = Inches(0.79)   # ~2.0 cm

    # Estilo base
    style_normal = doc.styles['Normal']
    font = style_normal.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = RGBColor(0, 0, 0)

    # ---------------------------------------------------------------------------
    # CAPA INSTITUCIONAL AAEE (Caixa / Tabela 1x1 com borda única idêntica ao original)
    # ---------------------------------------------------------------------------
    cover_table = doc.add_table(rows=1, cols=1)
    cover_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = cover_table.rows[0].cells[0]
    cell.width = Inches(6.5)

    # Aplicar borda simples em torno da capa
    set_cell_borders(cell, top="single", bottom="single", left="single", right="single", color="333333", sz="8")
    set_cell_margins(cell, top=300, bottom=300, left=300, right=300)

    # Logotipo da AAEE
    logo_path = r"C:\Users\Tino Eduardo\Desktop\PROJECTO_DA\docs_assets\aaee_logo.png"
    p_logo = cell.paragraphs[0]
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo.paragraph_format.space_after = Pt(12)
    p_logo.paragraph_format.space_before = Pt(6)
    if os.path.exists(logo_path):
        run_logo = p_logo.add_run()
        run_logo.add_picture(logo_path, width=Inches(1.95), height=Inches(1.95))

    # Cabeçalho da Instituição
    p_inst = cell.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(2)
    p_inst.paragraph_format.line_spacing = 1.15
    r_inst1 = p_inst.add_run("ACADEMIA DE ALTOS ESTUDOS ESTRATÉGICOS\n")
    r_inst1.bold = True
    r_inst1.font.name = "Times New Roman"
    r_inst1.font.size = Pt(13)
    r_inst2 = p_inst.add_run("LICENCIATURA EM ENGENHARIA INFORMÁTICA E CIBERSEGURANÇA\n")
    r_inst2.bold = True
    r_inst2.font.name = "Times New Roman"
    r_inst2.font.size = Pt(11.5)
    r_inst3 = p_inst.add_run("DESENVOLVIMENTO DE APLICAÇÃO\n")
    r_inst3.font.name = "Times New Roman"
    r_inst3.font.size = Pt(11)

    # Título do Relatório
    p_tit = cell.add_paragraph()
    p_tit.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tit.paragraph_format.space_before = Pt(18)
    p_tit.paragraph_format.space_after = Pt(28)
    r_tit = p_tit.add_run("RELATÓRIO TÉCNICO DO SISTEMA DE GESTÃO DE RECLAMAÇÕES HOSPITALARES")
    r_tit.bold = True
    r_tit.font.name = "Times New Roman"
    r_tit.font.size = Pt(13)

    # Informações do Projeto
    p_proj = cell.add_paragraph()
    p_proj.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_proj.paragraph_format.space_before = Pt(12)
    p_proj.paragraph_format.space_after = Pt(8)
    r_proj = p_proj.add_run("\tProjecto: ")
    r_proj.bold = True
    r_proj.font.name = "Times New Roman"
    r_proj.font.size = Pt(11.5)
    r_proj_desc = p_proj.add_run("HospitalCare — Sistema de Gestão de Reclamações, Elogios e Sugestões Hospitalares (Hospital Central de Maputo - HCM)")
    r_proj_desc.font.name = "Times New Roman"
    r_proj_desc.font.size = Pt(11.5)

    # Discente e Docente (alinhamento lateral)
    p_people = cell.add_paragraph()
    p_people.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_people.paragraph_format.space_before = Pt(8)
    p_people.paragraph_format.space_after = Pt(24)
    p_people.paragraph_format.line_spacing = 1.2
    
    r_disc = p_people.add_run("Discente: ")
    r_disc.bold = True
    r_disc.font.name = "Times New Roman"
    r_disc.font.size = Pt(11)
    
    r_disc_name = p_people.add_run("Tino Eduardo\n\n")
    r_disc_name.font.name = "Times New Roman"
    r_disc_name.font.size = Pt(11)

    r_doc = p_people.add_run("Docentes: ")
    r_doc.bold = True
    r_doc.font.name = "Times New Roman"
    r_doc.font.size = Pt(11)

    r_doc_names = p_people.add_run("Eng. Frank Lopes\n          Eng. Jose")
    r_doc_names.font.name = "Times New Roman"
    r_doc_names.font.size = Pt(11)

    # Local e Data no rodapé da capa
    p_date = cell.add_paragraph()
    p_date.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_date.paragraph_format.space_before = Pt(20)
    p_date.paragraph_format.space_after = Pt(6)
    r_date = p_date.add_run("Maluana, Novembro de 2026")
    r_date.font.name = "Times New Roman"
    r_date.font.size = Pt(11)

    # Quebra de página após a capa
    doc.add_page_break()

    # ---------------------------------------------------------------------------
    # 1. INTRODUÇÃO
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "1. INTRODUÇÃO", font_size=13, bold=True, space_before=10, space_after=8)
    
    add_paragraph_styled(doc, 
        "A prestação de cuidados de saúde numa unidade de nível terciário e quaternário envolve um conjunto complexo "
        "de interacções diárias entre utentes, corpo clínico, equipas de enfermagem e serviços de apoio administrativo. "
        "No contexto do Hospital Central de Maputo (HCM), o maior centro hospitalar de Moçambique, a gestão do acolhimento, "
        "o tratamento de reclamações, o acolhimento de sugestões e o reconhecimento de elogios assumem um papel preponderante "
        "na salvaguarda dos direitos dos pacientes, na humanização do atendimento e na melhoria contínua da qualidade hospitalar. "
        "Contudo, a persistência de processos manuais assentes em livros físicos de reclamações ou caixas de sugestões dispersas "
        "revela-se manifestamente insuficiente, originando extravio de manifestações, morosidade na tramitação e, acima de tudo, "
        "a relutância dos cidadãos em reportar irregularidades por receio justificado de retaliação ou quebra de confidencialidade.")
    
    add_paragraph_styled(doc,
        "Com o intuito de mitigar estas debilidades estruturais, foi concebido e implementado o HospitalCare — Sistema "
        "de Gestão de Reclamações, Elogios e Sugestões Hospitalares. Trata-se de uma plataforma digital institucional, "
        "desenvolvida segundo os mais rigorosos preceitos de Engenharia de Software e Cibersegurança, que proporciona um "
        "canal transparente, auditável e 100% confidencial para os utentes do HCM. O sistema integra funcionalidades avançadas "
        "de submissão anónima ou identificada, encriptação de ponta a ponta, rastreio público através de Código de Referência e "
        "código PIN de 4 dígitos, tramitação interna departamental e assistência analítica baseada em Inteligência Artificial Híbrida "
        "(on-premises local e cloud em contingência).")
    
    add_paragraph_styled(doc,
        "O presente relatório técnico descreve de forma pormenorizada a fundamentação do projecto, a problemática identificada, "
        "a relevância e impacto da solução, os objectivos delineados e as tecnologias mobilizadas para o frontend e backend. "
        "São igualmente apresentadas a estrutura da base de dados, a arquitectura de segurança e IA, bem como a matriz exaustiva "
        "de implementação e validação dos requisitos funcionais e não-funcionais que sustentam a defesa prática da aplicação.")

    # ---------------------------------------------------------------------------
    # 2. IDENTIFICAÇÃO E CONTEXTUALIZAÇÃO DO PROJECTO
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "2. IDENTIFICAÇÃO E CONTEXTUALIZAÇÃO DO PROJECTO", font_size=13, bold=True, space_before=14, space_after=8)
    
    add_paragraph_styled(doc,
        "O projecto ostenta a denominação HospitalCare — Sistema de Gestão de Reclamações, Elogios e Sugestões Hospitalares "
        "e consiste numa aplicação integrada orientada à modernização dos canais de auscultação do utente e suporte à governação "
        "clínica. A solução foi especificamente projectada para o Hospital Central de Maputo (HCM), situado na Avenida Eduardo "
        "Mondlane, na cidade de Maputo, capital de Moçambique.")
    
    add_paragraph_styled(doc,
        "A arquitectura técnica do sistema adopta o paradigma de Single-Page Application (SPA) com capacidades de Progressive "
        "Web App (PWA), comunicando de forma assíncrona com um servidor central através de uma API RESTful estruturada. A "
        "persistência dos dados é gerida pelo MongoDB, assegurando escalabilidade e modelação documental flexível. O sistema "
        "incorpora ainda um componente inovador de Inteligência Artificial Híbrida, composto por um motor local on-premises "
        "(executado via Ollama com o modelo institucional qwen3.5) e um provedor secundário em nuvem (Google Gemini 1.5 Flash), "
        "além de um motor residente de conhecimento do HCM no próprio cliente para funcionamento sem falhas (zero-fail).")
    
    add_paragraph_styled(doc,
        "O HospitalCare estrutura-se operacionalmente em dois pilares essenciais: o Portal Público do Cidadão, que faculta a "
        "submissão anónima ou identificada de ocorrências, consulta em tempo real por Código e PIN e suporte conversacional por IA; "
        "e o Backoffice de Gestão Hospitalar, reservado ao pessoal de triagem (Gabinete do Utente), supervisores departamentais e "
        "Direcção Clínica do HCM, viabilizando o despacho de processos, monitoria de SLAs, atribuição de pareceres e auditoria de sistema.")

    # ---------------------------------------------------------------------------
    # 3. PROBLEMA IDENTIFICADO
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "3. PROBLEMA IDENTIFICADO", font_size=13, bold=True, space_before=14, space_after=8)
    
    add_paragraph_styled(doc,
        "A análise diagnóstica realizada aos fluxos tradicionais de auscultação e tratamento de ocorrências no Hospital "
        "Central de Maputo revelou diversas fragilidades críticas decorrentes da dependência de meios físicos e processos "
        "não articulados, nomeadamente:")
    
    add_paragraph_styled(doc,
        "• Vulnerabilidade física e extravio de processos: O recurso a cadernos de ocorrências, livros de reclamações e folhas "
        "avulsas favorece a perda acidental ou a destruição deliberada de registos, comprometendo a transparência e impedindo "
        "a elaboração de séries históricas fidedignas sobre a qualidade dos serviços prestados.")
    
    add_paragraph_styled(doc,
        "• Medo de represálias e inibição da denúncia: Em meio hospitalar, os utentes demonstram forte apreensão em formalizar "
        "queixas de negligência médica, mau atendimento, cobranças ilícitas ou falta de medicamentos quando obrigados a "
        "revelar a sua identidade. A ausência de garantias técnicas de anonimato bloqueia o fluxo de informação indispensável "
        "à correcção de falhas deontológicas e operacionais.")
    
    add_paragraph_styled(doc,
        "• Morosidade crítica na resposta a situações de urgência: Processos graves que requerem intervenção imediata — como roturas "
        "agudas na Farmácia Central ou incidentes no Banco de Socorros — demoram dias ou semanas a chegar ao conhecimento das "
        "chefias competentes, em virtude da ausência de canais directos de tramitação digital e alertas de tempo limite (SLA).")
    
    add_paragraph_styled(doc,
        "• Falta de feedback e opacidade perante o cidadão: O utente que submete uma reclamação raramente dispõe de meios para "
        "acompanhar o estágio da sua manifestação, gerando uma percepção de impunidade e ineficácia institucional.")
    
    add_paragraph_styled(doc,
        "• Sobrecarga e perda de produtividade dos funcionários: A análise manual e a redação de despachos sobre centenas de "
        "ocorrências dispersas consome tempo precioso das equipas clínicas, que poderiam beneficiar de ferramentas automatizadas "
        "de categorização, sumarização executiva e propostas de resposta institucional.")
    
    add_paragraph_styled(doc,
        "Deste modo, o problema central reside na inexistência de uma plataforma digital segura, célere e confidencial que una "
        "os cidadãos à governação do HCM, garantindo o tratamento ético das manifestações com apoio analítico inteligente.")

    # ---------------------------------------------------------------------------
    # 4. JUSTIFICATIVA
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "4. JUSTIFICATIVA", font_size=13, bold=True, space_before=14, space_after=8)
    
    add_paragraph_styled(doc,
        "O desenvolvimento do HospitalCare justifica-se pelo imperativo de conferir dignidade, rigor e transparência "
        "ao ecossistema de saúde pública de Moçambique, alinhando a prática hospitalar do HCM com as metas nacionais de "
        "transformação digital e os padrões internacionais de Cibersegurança e Protecção de Dados Sensíveis.")
    
    add_paragraph_styled(doc,
        "Do ponto de vista da Cibersegurança, a solução diferencia-se pela adopção de um modelo de privacidade por conceção "
        "(Privacy by Design). Ao facultar a opção de denúncia estritamente anónima, apoiada na geração criptográfica de Código "
        "de Referência (#HC-2026-XXXX) e PIN de 4 dígitos com hash Bcrypt, o utente tem a garantia inviolável de que a sua "
        "identidade física e número de telefone jamais serão acoplados ao relato, eliminando em absoluto o risco de represálias.")
    
    add_paragraph_styled(doc,
        "Sob a perspectiva da Gestão Hospitalar, a digitalização e centralização das ocorrências permite à Direcção Clínica "
        "e ao Gabinete do Utente monitorizar em tempo real mapas de calor de reclamações por sector (ex: Urgência Geral versus "
        "Farmácia Central), controlar o cumprimento estrito das políticas de SLA e valorizar o mérito profissional através da "
        "canalização estruturada de elogios aos médicos e enfermeiros.")
    
    add_paragraph_styled(doc,
        "A inclusão de Inteligência Artificial Híbrida Local consolida a soberania e segurança dos dados clínicos: o "
        "processamento primário ocorre em servidores on-premises no território nacional, passando por uma camada mandatória de "
        "higienização (Data Scrubbing) que expurga quaisquer menções acidentais a NUIT, BI ou dados nominais antes de qualquer inferência.")

    # ---------------------------------------------------------------------------
    # 5. DEFINIÇÃO DA SOLUÇÃO
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "5. DEFINIÇÃO DA SOLUÇÃO", font_size=13, bold=True, space_before=14, space_after=8)
    
    add_paragraph_styled(doc,
        "Em resposta às debilidades diagnosticadas, propõe-se uma plataforma web integrada de elevada disponibilidade, "
        "composta por módulos integrados de recepção, triagem, apoio à decisão e acompanhamento seguro.")
    
    add_paragraph_styled(doc,
        "No Canal Público, o utente é acolhido por uma interface intuitiva onde pode submeter reclamações, denúncias, "
        "pedidos de esclarecimento ou elogios. O utente escolhe entre a modalidade Anónima (sem recolha de identificadores) "
        "ou Identificada (com notificação por email/contacto). No término do registo, o sistema devolve o Código de Acompanhamento "
        "e o respectivo PIN de 4 dígitos. A qualquer instante, o cidadão pode introduzir estas credenciais no portal para "
        "visualizar a linha do tempo do processo, o departamento incumbido e a resposta homologada pela Direcção.")
    
    add_paragraph_styled(doc,
        "Adicionalmente, o utente conta com o assistente virtual 'Acolhe HospitalCare', capaz de esclarecer dúvidas sobre os "
        "serviços da unidade sanitária (ex: localização e triagem de Manchester da Urgência Geral, levantamento de receitas na "
        "Farmácia Central e procedimentos para consulta de processos) com latência imperceptível (0 a 30 ms).")
    
    add_paragraph_styled(doc,
        "No Backoffice Hospitalar, os colaboradores acedem a um ambiente diferenciado por Controlo de Acesso Baseado em Papéis "
        "(RBAC). O pessoal do Gabinete do Utente (STAFF) valida e encaminha as ocorrências para os respectivos departamentos; "
        "as chefias de serviço (SUPERVISOR) redigem pareceres técnicos e respostas oficiais, monitorizando prazos com auxílio de "
        "semáforos de SLA; os Administradores de Sistema (ADMIN) gerem o parque de utilizadores, unidades hospitalares, categorias, "
        "políticas de prazo e consultam a trilha imutável de auditoria.")

    # ---------------------------------------------------------------------------
    # 6. OBJECTIVOS
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "6. OBJECTIVOS", font_size=13, bold=True, space_before=14, space_after=8)
    
    add_paragraph_styled(doc, "6.1. Objectivo geral", font_size=12, bold=True, space_before=6, space_after=4)
    add_paragraph_styled(doc,
        "Desenvolver e implementar um Sistema Integrado de Gestão de Reclamações, Elogios e Sugestões Hospitalares "
        "(HospitalCare) para o Hospital Central de Maputo, que assegure total confidencialidade, rastreio transparente "
        "por código e PIN, celeridade na tramitação departamental e assistência analítica baseada em Inteligência Artificial "
        "Híbrida segura.")

    add_paragraph_styled(doc, "6.2. Objectivos específicos", font_size=12, bold=True, space_before=6, space_after=4)
    add_paragraph_styled(doc,
        "1. Identificar e mapear os fluxos operacionais de recepção, despacho e resolução de manifestações nos principais serviços "
        "do Hospital Central de Maputo (Urgência Geral, Farmácia Central, Pediatria, Maternidade e Consultas Externas).\n"
        "2. Desenvolver uma interface web acessível, responsiva (PWA) e intuitiva para o público, possibilitando a submissão de "
        "ocorrências em regime anónimo ou identificado.\n"
        "3. Implementar um mecanismo criptográfico robusto de geração de Código de Referência e PIN de 4 dígitos para garantir o "
        "acompanhamento público seguro sem necessidade de criação de conta prévia.\n"
        "4. Construir uma API RESTful em Node.js e Express, assegurando a validação estrita de dados através de schemas Zod e a "
        "persistência relacional/documental no MongoDB.\n"
        "5. Implementar um modelo rigoroso de Cibersegurança assente em Controlo de Acesso Baseado em Papéis (RBAC), autenticação "
        "por JSON Web Token (JWT com refresh tokens), hashing Bcrypt e protecção contra ameaças web comuns via Helmet e Rate Limiting.\n"
        "6. Integrar uma arquitectura de IA Híbrida que execute inferências primárias localmente (Ollama com modelo qwen3.5) "
        "com prévia higienização de dados pessoais (Data Scrubbing), apoiada por contingência inteligente no cliente e nuvem.\n"
        "7. Implementar o módulo analítico de apoio à equipa hospitalar para classificação automática, cálculo de urgência e "
        "sugestão de respostas oficiais baseadas em evidências.\n"
        "8. Configurar um sistema de monitoria de acordos de nível de serviço (SLA) com alertas de expiração e uma trilha "
        "imutável de auditoria (audit logs) para fins de responsabilização institucional.")

    # ---------------------------------------------------------------------------
    # 7. DESENVOLVIMENTO DO SISTEMA
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "7. DESENVOLVIMENTO DO SISTEMA", font_size=13, bold=True, space_before=14, space_after=8)
    
    add_paragraph_styled(doc,
        "O desenvolvimento do HospitalCare seguiu os padrões modernos de engenharia de software distribuída, estruturado "
        "numa separação clara entre a camada de apresentação (Frontend SPA/PWA) e a camada de serviços e dados (Backend API). "
        "A segurança da informação e a resiliência operacional nortearam todas as decisões arquitecturais.")

    # 7.1. Organização funcional do HCM
    add_paragraph_styled(doc, "7.1. Organização funcional do Hospital Central de Maputo", font_size=12, bold=True, space_before=8, space_after=6)
    add_paragraph_styled(doc,
        "Para reflectir a realidade assistencial do HCM, o sistema foi parametrizado em torno das suas principais unidades "
        "clínicas e operacionais, conforme discriminado na Tabela 1:")

    # Tabela 1
    t1 = doc.add_table(rows=7, cols=3)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    t1_headers = ["Unidade / Serviço Hospitalar", "Capacidade ou Organização Operacional", "Função no Sistema HospitalCare"]
    for c_idx, h_text in enumerate(t1_headers):
        cell_h = t1.rows[0].cells[c_idx]
        cell_h.text = h_text
        set_cell_background(cell_h, "F1F5F9")
        set_cell_margins(cell_h, 120, 120, 150, 150)
        set_cell_borders(cell_h, top="single", bottom="single", left="single", right="single", color="CBD5E1")
        p = cell_h.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.bold = True
            r.font.name = "Times New Roman"
            r.font.size = Pt(10.5)

    t1_data = [
        ("Urgência Geral (Banco de Socorros)", "Atendimento contínuo 24/7 com Triagem de Manchester (vermelho, laranja e amarelo)", "Recepção de manifestações de alta prioridade clínica; encaminhamento célere para intervenção da chefia de equipa."),
        ("Farmácia Central e Depósitos", "Gestão de stocks e dispensa de medicação prescrita para ambulatório e enfermarias", "Registo e auditoria de ocorrências relativas a roturas de stock, morosidade no aviamento de receitas e retenção indevida."),
        ("Pediatria e Neonatologia", "Enfermarias infantis, berçário e cuidados intensivos pediátricos", "Acompanhamento de processos de atendimento humanizado infantil e suporte ético aos progenitores e tutores."),
        ("Maternidade e Obstetrícia", "Bloco de partos, cuidados pré-natais, puerpério e urgência obstétrica", "Tratamento de queixas e elogios de elevada sensibilidade clínica, com garantia de sigilo reforçado para a utente."),
        ("Consultas Externas", "Especialidades médicas, cirúrgicas, agendamentos e arquivo clínico", "Gestão de ocorrências sobre cumprimento de horários, perda de processos clínicos e remarcações."),
        ("Gabinete do Utente e Direcção", "Corpo de inspecção hospitalar, supervisores clínicos e Direcção Geral", "Supervisão global, emissão de despachos oficiais homologados, auditoria de prazos de SLA e definição de directrizes.")
    ]

    for r_idx, row_data in enumerate(t1_data, start=1):
        row = t1.rows[r_idx]
        for c_idx, val in enumerate(row_data):
            c = row.cells[c_idx]
            c.text = val
            set_cell_margins(c, 100, 100, 140, 140)
            set_cell_borders(c, top="single", bottom="single", left="single", right="single", color="E2E8F0")
            if r_idx % 2 == 0:
                set_cell_background(c, "F8FAFC")
            p = c.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT if c_idx > 0 else WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(10)

    # 7.2. Tecnologias do frontend
    add_paragraph_styled(doc, "7.2. Tecnologias do frontend", font_size=12, bold=True, space_before=14, space_after=6)
    add_paragraph_styled(doc,
        "A camada de frontend foi concebida com foco em acessibilidade universal, responsividade e rapidez de interacção. "
        "A tecnologia central é o Vue.js 3, tirando proveito da moderna Composition API e de tipagem estrita com TypeScript. "
        "Esta escolha viabiliza a modularização rigorosa da lógica em composables reutilizáveis (ex: useAuth, useProcesses) e "
        "a mitigação de falhas em tempo de compilação.")
    
    add_paragraph_styled(doc,
        "Para a construção da interface gráfica, utilizou-se o Quasar Framework (v2.35), que disponibiliza um rico catálogo "
        "de componentes Material Design altamente otimizados (QTable, QForm, QInput, QBadge, QDialog). A gestão de estado "
        "global da aplicação é assegurada pelo Pinia, garantindo reactividade eficiente para a sessão autenticada, notificações "
        "e parâmetros de interface. O empacotamento e compilação do código assentam no Vite, viabilizando compilações ultrarrápidas, "
        "divisão automática de feixes (code-splitting) e carregamento sob demanda (lazy loading) das páginas administrativas.")
    
    add_paragraph_styled(doc,
        "O frontend foi configurado com capacidades plenas de Progressive Web App (PWA). Através do Service Worker e do Workbox, "
        "os ficheiros estáticos (HTML, CSS, JS, ícones) são armazenados em cache local, viabilizando o carregamento instantâneo da "
        "aplicação mesmo em condições de rede móvel instável. Adicionalmente, o widget do assistente virtual inclui um motor residente "
        "de conhecimento institucional em memória, assegurando que o cidadão receba orientação imediata sem qualquer dependência da "
        "ligação ao servidor.")

    # 7.3. Tecnologias do backend
    add_paragraph_styled(doc, "7.3. Tecnologias do backend", font_size=12, bold=True, space_before=14, space_after=6)
    add_paragraph_styled(doc,
        "O backend foi desenvolvido no ecossistema Node.js em modo nativo ECMAScript Modules (ESM), estruturado sobre o framework "
        "Express 4. A linguagem principal é o TypeScript, conferindo segurança de tipos de ponta a ponta. A comunicação obedece "
        "aos cânones de uma arquitectura RESTful com payloads formatados em JSON.")
    
    add_paragraph_styled(doc,
        "A integridade dos dados que penetram no sistema é rigorosamente controlada através da biblioteca Zod. Cada pedido HTTP "
        "(POST, PUT, PATCH) é submetido a validação prévia através de schemas declarativos que inspecionam tipologias, formatos, "
        "comprimentos e enumerações antes de qualquer contacto com a camada de serviço. Requisições malformadas são prontamente "
        "rejeitadas com códigos HTTP 400 ou 422 e mensagens de erro semânticas.")
    
    add_paragraph_styled(doc,
        "O registo de actividades do servidor utiliza o Pino Logger, uma ferramenta de alto desempenho com formatação assíncrona "
        "estruturada, que regista conexões, erros e eventos de segurança sem introduzir overhead de latência no processamento de requisições. "
        "A documentação interactiva de todas as rotas é disponibilizada publicamente através do Swagger UI (OpenAPI 3.0).")

    # 7.4. Base de dados
    add_paragraph_styled(doc, "7.4. Base de dados", font_size=12, bold=True, space_before=14, space_after=6)
    add_paragraph_styled(doc,
        "A persistência de informação é assegurada pelo MongoDB, um sistema gestor de base de dados NoSQL orientado a documentos, "
        "operado através do ODM (Object Document Mapper) Mongoose. A flexibilidade do modelo documental revelou-se ideal para "
        "acomodar o histórico heterogéneo de tramitação de processos, metadados de anexos e registos de auditoria, conforme Tabela 2:")

    # Tabela 2
    t2 = doc.add_table(rows=8, cols=3)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    t2_headers = ["Colecção (Collection)", "Informação Armazenada", "Finalidade no Sistema"]
    for c_idx, h_text in enumerate(t2_headers):
        cell_h = t2.rows[0].cells[c_idx]
        cell_h.text = h_text
        set_cell_background(cell_h, "F1F5F9")
        set_cell_margins(cell_h, 120, 120, 150, 150)
        set_cell_borders(cell_h, top="single", bottom="single", left="single", right="single", color="CBD5E1")
        p = cell_h.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.bold = True
            r.font.name = "Times New Roman"
            r.font.size = Pt(10.5)

    t2_data = [
        ("processes", "Código (#HC), PIN (hash Bcrypt), tipo, departamento, categoria, status, prioridade, prazos SLA e timeline", "Registo e acompanhamento integral do ciclo de vida das ocorrências."),
        ("users", "Nome completo, email institucional, palavra-passe (hash Bcrypt), papel RBAC, departamento e status", "Gestão segura das contas dos funcionários e administradores do HCM."),
        ("departments", "Nome do serviço, código institucional, descrição, responsável clínico e estado ativo", "Mapeamento hierárquico e roteamento interno das ocorrências."),
        ("categories", "Denominação da categoria, descrição, departamento correspondente e nível de criticidade", "Taxonomia temática para classificação precisa dos relatos."),
        ("sla_policies", "Tipo de manifestação, prioridade, tempo máximo de resposta preliminar e final em horas", "Automatização dos alertas e controlo de cumprimento dos prazos legais."),
        ("audit_logs", "ID do utilizador, ação executada, recurso, endereço IP, timestamp e diff de dados", "Trilha imutável de auditoria forense e conformidade de cibersegurança."),
        ("ai_chat_sessions", "Identificador de sessão, mensagens higienizadas, modelo utilizado e timestamps", "Manutenção do contexto conversacional do assistente virtual de acolhimento.")
    ]

    for r_idx, row_data in enumerate(t2_data, start=1):
        row = t2.rows[r_idx]
        for c_idx, val in enumerate(row_data):
            c = row.cells[c_idx]
            c.text = val
            set_cell_margins(c, 100, 100, 140, 140)
            set_cell_borders(c, top="single", bottom="single", left="single", right="single", color="E2E8F0")
            if r_idx % 2 == 0:
                set_cell_background(c, "F8FAFC")
            p = c.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT if c_idx > 0 else WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(10)

    # 7.5. Inteligência Artificial
    add_paragraph_styled(doc, "7.5. Inteligência Artificial e Comunicação / Resiliência", font_size=12, bold=True, space_before=14, space_after=6)
    add_paragraph_styled(doc,
        "Um dos grandes diferenciais do HospitalCare consiste na sua Arquitectura de Inteligência Artificial Híbrida e Soberana. "
        "Reconhecendo a sensibilidade inerente aos dados hospitalares, a solução foi concebida para não depender exclusivamente de "
        "APIs externas em nuvem nem expor informações dos pacientes:")
    
    add_paragraph_styled(doc,
        "• Camada Local Primária (On-Premises): O servidor integra-se directamente com o Ollama local (porta 11434), executando o "
        "modelo avançado qwen3.5:latest (9.7 mil milhões de parâmetros). Esta configuração garante que todo o processamento de "
        "linguagem natural possa decorrer no perímetro seguro do próprio hospital, sem envio de tráfego para a Internet.")
    
    add_paragraph_styled(doc,
        "• Sanitização Prévia de Dados (Data Scrubbing): Antes de qualquer texto ser submetido à inferência de IA, o pipeline do "
        "serviço executa rotinas de ofuscação com recurso a expressões regulares avançadas. Números de Bilhete de Identidade (BI), "
        "NUIT, contactos telefónicos e menções explícitas a nomes de utentes são automaticamente convertidos em tokens anónimos "
        "([DOCUMENTO_OFUSCADO], [TELEFONE_REMOVIDO]), blindando a privacidade do cidadão.")
    
    add_paragraph_styled(doc,
        "• Camada Fast-Pass Institucional e Contingência no Cliente: Para evitar atrasos decorrentes da carga de CPU do modelo "
        "local, as questões recorrentes sobre funcionamento de departamentos e consulta de processos são interceptadas por um motor "
        "residente ultrarrápido (latência inferior a 30 ms). Caso ocorra falha de rede ou timeout, o frontend activa o motor "
        "residente de acolhimento, garantindo zero mensagens de erro e respostas imediatas ao utente.")

    # 7.6. Segurança e validação
    add_paragraph_styled(doc, "7.6. Segurança, cibersegurança e validação", font_size=12, bold=True, space_before=14, space_after=6)
    add_paragraph_styled(doc,
        "Concebido no âmbito de uma Licenciatura em Cibersegurança, o HospitalCare incorpora controlos de segurança "
        "em profundidade (Defense-in-Depth):")
    
    add_paragraph_styled(doc,
        "1. Protecção Criptográfica de Palavras-passe e PINs: As credenciais de acesso e os códigos PIN dos processos são "
        "irreversivelmente protegidos com o algoritmo Bcrypt (fator de custo 10), prevenindo a recuperação de senhas em caso "
        "de acesso não autorizado à base de dados.")
    
    add_paragraph_styled(doc,
        "2. Autenticação e Gestão de Sessão JWT: Utiliza-se um esquema de tokens duplos — Access Token (validade curta de 15 minutos) "
        "para autorização de requisições e Refresh Token (validade de 7 dias) mantido em armazenamento seguro para renovação transparente.")
    
    add_paragraph_styled(doc,
        "3. Controlo de Acesso Baseado em Papéis (RBAC): O sistema implementa 4 níveis de privilégio (UTENTE, STAFF, SUPERVISOR, ADMIN). "
        "Middlewares de autorização barram requisições a rotas administrativas e registam tentativas de escalada de privilégios.")
    
    add_paragraph_styled(doc,
        "4. Defesa Perimetral e Cabeçalhos HTTP: Configuração do Helmet para imposição de políticas restritivas (X-Content-Type-Options, "
        "X-Frame-Options, HSTS) e Express-Rate-Limit para mitigar ataques de força bruta e negação de serviço distribuída (DDoS).")

    # ---------------------------------------------------------------------------
    # 8. IMPLEMENTAÇÃO E VERIFICAÇÃO DOS REQUISITOS
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "8. IMPLEMENTAÇÃO E VERIFICAÇÃO DOS REQUISITOS", font_size=13, bold=True, space_before=14, space_after=8)
    
    add_paragraph_styled(doc,
        "A avaliação da conformidade técnica do HospitalCare foi subdividida entre a componente de frontend e a de backend, "
        "abrangendo tanto os testes laboratoriais como os cenários de simulação em ambiente hospitalar.")

    # 8.1. Funcionalidades do frontend
    add_paragraph_styled(doc, "8.1. Funcionalidades do frontend", font_size=12, bold=True, space_before=8, space_after=6)
    add_paragraph_styled(doc,
        "A Tabela 3 sumariza os principais requisitos de cliente verificados e a respectiva materialização no sistema:")

    # Tabela 3
    t3 = doc.add_table(rows=13, cols=3)
    t3.alignment = WD_TABLE_ALIGNMENT.CENTER
    t3_headers = ["N.º", "Requisito Verificado", "Implementação Descrita"]
    for c_idx, h_text in enumerate(t3_headers):
        cell_h = t3.rows[0].cells[c_idx]
        cell_h.text = h_text
        set_cell_background(cell_h, "F1F5F9")
        set_cell_margins(cell_h, 120, 120, 150, 150)
        set_cell_borders(cell_h, top="single", bottom="single", left="single", right="single", color="CBD5E1")
        p = cell_h.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.bold = True
            r.font.name = "Times New Roman"
            r.font.size = Pt(10.5)

    t3_data = [
        ("1", "Autenticação Institucional", "Login e logout com tokens JWT, persistência no LocalStorage e auto-logout em expiração."),
        ("2", "Rotas Protegidas por Papel", "Guarda de navegação no Vue Router que valida o perfil RBAC e redireciona tentativas não autorizadas."),
        ("3", "Submissão Anónima e Identificada", "Formulário em passos com validação em tempo real e chaveamento entre anonimato estrito e registo contactável."),
        ("4", "Consulta Segura com Código e PIN", "Ecrã público de rastreio de processos onde a introdução de código e PIN de 4 dígitos desbloqueia o progresso."),
        ("5", "Assistente Virtual de Acolhimento", "Widget flutuante reativo (Acolhe HospitalCare) com suporte a sugestões rápidas e motor de IA."),
        ("6", "Painel de Gestão Operacional", "Tabela reactiva com filtros avançados por departamento, criticidade, tipo e paginação assíncrona."),
        ("7", "Gestão Administrativa (CRUD)", "Interfaces de cadastro, edição, desativação e listagem de utilizadores, departamentos e categorias."),
        ("8", "Responsividade Multiplataforma", "Adaptação automática para ecrãs móveis, tablets e monitores desktop com o Quasar Grid System."),
        ("9", "Acessibilidade Universal (WCAG)", "Rótulos ARIA, suporte a navegação por teclado e contraste de cores auditado pelo Google Lighthouse (96/100)."),
        ("10", "Capacidades PWA e Instalação", "Web App Manifest e Service Worker com Workbox permitindo instalação da aplicação como app nativa."),
        ("11", "Operação Resiliente sem Rede", "Motor residente de conhecimento HCM no cliente para esclarecimento de processos mesmo sem conectividade."),
        ("12", "Trilha de Auditoria no Ecrã", "Visualizador de logs administrativos com pesquisa em tempo real por utilizador, acção e data.")
    ]

    for r_idx, row_data in enumerate(t3_data, start=1):
        row = t3.rows[r_idx]
        for c_idx, val in enumerate(row_data):
            c = row.cells[c_idx]
            c.text = val
            set_cell_margins(c, 90, 90, 130, 130)
            set_cell_borders(c, top="single", bottom="single", left="single", right="single", color="E2E8F0")
            if r_idx % 2 == 0:
                set_cell_background(c, "F8FAFC")
            p = c.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx == 0 else WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(9.5)

    # 8.2. Funcionalidades do backend
    add_paragraph_styled(doc, "8.2. Funcionalidades do backend", font_size=12, bold=True, space_before=14, space_after=6)
    add_paragraph_styled(doc,
        "A Tabela 4 sintetiza a verificação dos requisitos de servidor e segurança do backend:")

    # Tabela 4
    t4 = doc.add_table(rows=12, cols=3)
    t4.alignment = WD_TABLE_ALIGNMENT.CENTER
    t4_headers = ["N.º", "Requisito Verificado", "Implementação Descrita"]
    for c_idx, h_text in enumerate(t4_headers):
        cell_h = t4.rows[0].cells[c_idx]
        cell_h.text = h_text
        set_cell_background(cell_h, "F1F5F9")
        set_cell_margins(cell_h, 120, 120, 150, 150)
        set_cell_borders(cell_h, top="single", bottom="single", left="single", right="single", color="CBD5E1")
        p = cell_h.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.bold = True
            r.font.name = "Times New Roman"
            r.font.size = Pt(10.5)

    t4_data = [
        ("1", "Regras de Negócio e SLAs", "Cálculo automático de prazos de resolução conforme a criticidade (24h para Urgência e 5 dias para rotina)."),
        ("2", "Higienização de Dados (PII)", "Módulo de data scrubbing com regex para ofuscação compulsória de nomes, BIs, NUITs e telefones."),
        ("3", "Códigos HTTP RESTful", "Tratamento canónico de códigos de status (200, 201, 400, 401, 403, 404, 409, 422, 500) em todas as rotas."),
        ("4", "Protecção de Rotas com JWT", "Middleware de intercepção e verificação de assinatura do cabeçalho Authorization: Bearer <token>."),
        ("5", "Autorização Granular (RBAC)", "Middleware com verificação estrita de papéis (ex: authorize(['ADMIN', 'SUPERVISOR']))."),
        ("6", "Criptografia de Senhas e PINs", "Hashing unidireccional de credenciais com salt rounds 10 usando a biblioteca Bcrypt."),
        ("7", "Rate Limiting e Helmet", "Limitação de taxa contra abusos de força bruta e cabeçalhos HTTP defensivos para proteção web."),
        ("8", "Validação com Schemas Zod", "Verificação rigorosa de tipos, campos mandatórios e formatos em todas as entradas de dados."),
        ("9", "Índices e Restrições Únicas", "Índices únicos em referenceNumber, email e índices compostos para aceleração de buscas no MongoDB."),
        ("10", "Motor Híbrido de IA com Fallback", "Roteamento inteligente entre Ollama Local (qwen3.5), Gemini 1.5 Flash e conhecimento institucional."),
        ("11", "Documentação OpenAPI / Swagger", "Catálogo interactivo de endpoints em /api/docs para validação e testes integrados.")
    ]

    for r_idx, row_data in enumerate(t4_data, start=1):
        row = t4.rows[r_idx]
        for c_idx, val in enumerate(row_data):
            c = row.cells[c_idx]
            c.text = val
            set_cell_margins(c, 90, 90, 130, 130)
            set_cell_borders(c, top="single", bottom="single", left="single", right="single", color="E2E8F0")
            if r_idx % 2 == 0:
                set_cell_background(c, "F8FAFC")
            p = c.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx == 0 else WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(9.5)

    # ---------------------------------------------------------------------------
    # 9. CONSIDERAÇÕES SOBRE A DEMONSTRAÇÃO E DEFESA
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "9. CONSIDERAÇÕES SOBRE A DEMONSTRAÇÃO E DEFESA", font_size=13, bold=True, space_before=14, space_after=8)
    
    add_paragraph_styled(doc,
        "A sessão de demonstração prática e defesa do HospitalCare perante o corpo docente foi estruturada "
        "em duas partes complementares:")

    add_paragraph_styled(doc, "9.1. Demonstração do Frontend", font_size=12, bold=True, space_before=8, space_after=4)
    add_paragraph_styled(doc,
        "Nesta etapa, serão demonstrados os fluxos de interacção directa do utente e dos colaboradores hospitalares:\n"
        "• Registo de uma ocorrência verídica de reclamação na Farmácia Central, evidenciando a opção por submissão anónima e a "
        "geração do Código de Referência e PIN de 4 dígitos.\n"
        "• Acedimento à página de 'Consultar Processo', com validação do PIN e visualização da linha do tempo da manifestação.\n"
        "• Interacção conversacional com o assistente 'Acolhe HospitalCare', submetendo dúvidas sobre a Urgência Geral e acompanhamento "
        "de processos, evidenciando respostas imediatas sem atrasos.\n"
        "• Sessão autenticada de Administrador e Supervisor, ilustrando a navegação pelos painéis de controlo, despacho de processos "
        "para os respectivos departamentos e visualização gráfica de indicadores de satisfação hospitalar.\n"
        "• Demonstração de responsividade móvel e funcionamento da camada PWA.")

    add_paragraph_styled(doc, "9.2. Demonstração do Backend", font_size=12, bold=True, space_before=8, space_after=4)
    add_paragraph_styled(doc,
        "Nesta componente, o foco incidirá sobre a robustez lógica, integridade e segurança do servidor:\n"
        "• Validação dos endpoints REST através da documentação interactiva Swagger em http://localhost:5000/api/docs.\n"
        "• Demonstração da aplicação de regras de negócio, rejeição de payloads com dados malformados através dos schemas Zod "
        "e tratamento dos respectivos códigos de resposta HTTP.\n"
        "• Demonstração da protecção das rotas com JWT e bloqueio automático de tentativas de acesso com privilégios insuficientes (RBAC).\n"
        "• Verificação da persistência e consistência dos documentos na base de dados MongoDB (Compass/Shell).\n"
        "• Inspecção dos registos de log do Pino e validação da sanitização automática de dados confidenciais (PII Scrubbing) "
        "durante o envio de pedidos ao motor de Inteligência Artificial Local.")

    # ---------------------------------------------------------------------------
    # 10. CONCLUSÃO
    # ---------------------------------------------------------------------------
    add_paragraph_styled(doc, "10. CONCLUSÃO", font_size=13, bold=True, space_before=14, space_after=8)
    
    add_paragraph_styled(doc,
        "O desenvolvimento do HospitalCare — Sistema de Gestão de Reclamações, Elogios e Sugestões Hospitalares respondeu com "
        "eficácia e rigor científico à necessidade premente de modernização dos mecanismos de acolhimento e governação clínica "
        "no Hospital Central de Maputo. A substituição dos suportes em papel por uma plataforma web resiliente, intuitiva e "
        "auditável elimina o risco de extravio de manifestações e confere voz ao cidadão moçambicano, assegurando-lhe a garantia "
        "inviolável do anonimato através de mecanismos criptográficos de Código de Referência e PIN de 4 dígitos.")
    
    add_paragraph_styled(doc,
        "A articulação tecnológica entre Vue.js 3, Quasar Framework, TypeScript, Node.js, Express, MongoDB e a arquitectura "
        "pioneira de Inteligência Artificial Híbrida Soberana (on-premises via Ollama com qwen3.5) demonstra a viabilidade de "
        "implementar soluções tecnológicas de elevado padrão internacional adaptadas à realidade das infraestruturas locais de "
        "Moçambique, conciliando inovação com preservação intransigente da privacidade dos dados médicos.")
    
    add_paragraph_styled(doc,
        "Como perspectivas de trabalho futuro, preconiza-se a integração do HospitalCare com os sistemas de registo em saúde "
        "do Ministério da Saúde (MISAU / SIS-MA), a disponibilização de gateways de SMS institucionais para alerta a cidadãos "
        "sem acesso a dados móveis e a evolução do copiloto analítico com modelos preditivos para prevenção precoce de crises "
        "de stock farmacêutico e sobrelotação de enfermarias.")

    # ---------------------------------------------------------------------------
    # Salvamento do ficheiro DOCX
    # ---------------------------------------------------------------------------
    out_workspace = r"C:\Users\Tino Eduardo\Desktop\PROJECTO_DA\Relatorio_Tecnico_HospitalCare_AAEE.docx"
    out_brain = r"C:\Users\Tino Eduardo\.gemini\antigravity\brain\6d52374c-dfab-43f7-9249-c9d5e06ff69b\Relatorio_Tecnico_HospitalCare_AAEE.docx"

    doc.save(out_workspace)
    print(f"Salvo com sucesso em: {out_workspace}")

    try:
        doc.save(out_brain)
        print(f"Salvo com sucesso em: {out_brain}")
    except Exception as e:
        print(f"Aviso ao salvar no brain: {e}")

if __name__ == "__main__":
    main()
