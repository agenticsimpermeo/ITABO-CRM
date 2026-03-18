#!/usr/bin/env python3
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

OUTPUT = "/Users/user/Documents/ITABO/CRM/MANUALE_CRM_ITABO.pdf"

GOLD = HexColor("#C9A84C")
DARK_BG = HexColor("#0A0A0A")
DARK_CARD = HexColor("#1A1A1A")
DARK_CARD2 = HexColor("#222222")
WHITE = HexColor("#FFFFFF")
LIGHT_GRAY = HexColor("#CCCCCC")
MID_GRAY = HexColor("#999999")
GREEN = HexColor("#4CAF50")
ORANGE = HexColor("#FF9800")

def bg_canvas(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(DARK_BG)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    # Footer
    canvas.setFillColor(MID_GRAY)
    canvas.setFont("Helvetica", 7)
    canvas.drawCentredString(A4[0]/2, 12*mm, f"ITABO SRL — Manuale CRM v1.0 — Marzo 2026 — Pag. {doc.page}")
    canvas.restoreState()

styles = {
    'title': ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=26, textColor=GOLD,
                            alignment=TA_CENTER, spaceAfter=6*mm, leading=32),
    'subtitle': ParagraphStyle('subtitle', fontName='Helvetica', fontSize=13, textColor=LIGHT_GRAY,
                               alignment=TA_CENTER, spaceAfter=10*mm, leading=17),
    'h1': ParagraphStyle('h1', fontName='Helvetica-Bold', fontSize=18, textColor=GOLD,
                         spaceBefore=10*mm, spaceAfter=4*mm, leading=22),
    'h2': ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=14, textColor=GOLD,
                         spaceBefore=6*mm, spaceAfter=3*mm, leading=18),
    'h3': ParagraphStyle('h3', fontName='Helvetica-Bold', fontSize=11, textColor=HexColor("#E0C060"),
                         spaceBefore=4*mm, spaceAfter=2*mm, leading=14),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=10, textColor=LIGHT_GRAY,
                           spaceAfter=2*mm, leading=14),
    'bold_body': ParagraphStyle('bold_body', fontName='Helvetica-Bold', fontSize=10, textColor=WHITE,
                                spaceAfter=2*mm, leading=14),
    'bullet': ParagraphStyle('bullet', fontName='Helvetica', fontSize=10, textColor=LIGHT_GRAY,
                             leftIndent=8*mm, spaceAfter=1.5*mm, leading=13,
                             bulletIndent=3*mm),
    'code': ParagraphStyle('code', fontName='Courier', fontSize=9, textColor=HexColor("#80CBC4"),
                           leftIndent=6*mm, spaceAfter=2*mm, leading=12,
                           backColor=DARK_CARD),
    'important': ParagraphStyle('important', fontName='Helvetica-Bold', fontSize=10, textColor=ORANGE,
                                spaceAfter=2*mm, leading=14),
}

def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT, pagesize=A4,
        leftMargin=20*mm, rightMargin=20*mm,
        topMargin=20*mm, bottomMargin=20*mm
    )

    story = []
    S = story.append

    # ── COVER PAGE ──
    S(Spacer(1, 40*mm))
    S(Paragraph("MANUALE OPERATIVO", styles['title']))
    S(Paragraph("ITABO CRM", styles['title']))
    S(Spacer(1, 6*mm))
    S(HRFlowable(width="60%", thickness=1, color=GOLD, spaceAfter=6*mm, spaceBefore=2*mm))
    S(Paragraph("Wine Export Lead Management System", styles['subtitle']))
    S(Paragraph("Versione 1.0 — Marzo 2026", styles['subtitle']))
    S(Spacer(1, 20*mm))
    S(Paragraph("URL: https://itabo-crm-wine.vercel.app", styles['body']))
    S(PageBreak())

    # ── 1. ACCESSO ──
    S(Paragraph("1. ACCESSO E PRIMO AVVIO", styles['h1']))
    S(Paragraph("Apri il link <b>https://itabo-crm-wine.vercel.app</b> dal browser (Chrome consigliato).", styles['body']))
    S(Paragraph("Al primo accesso il CRM carica automaticamente tutti i <b>5.626 lead</b> pre-caricati. I dati vengono salvati nel tuo browser (localStorage):", styles['body']))
    S(Paragraph("\u2022  I tuoi progressi (status, note, date) si salvano automaticamente", styles['bullet']))
    S(Paragraph("\u2022  Se cambi browser o dispositivo, riparti da zero", styles['bullet']))
    S(Paragraph("\u2022  Per resettare tutto: clicca il bottone \"Reset\" in alto a destra", styles['bullet']))
    S(Paragraph("IMPORTANTE: Non cancellare i dati del browser / cronologia, altrimenti perdi i progressi.", styles['important']))

    # ── 2. STRUTTURA INTERFACCIA ──
    S(Paragraph("2. STRUTTURA DELL'INTERFACCIA", styles['h1']))

    S(Paragraph("Header (barra in alto)", styles['h2']))
    S(Paragraph("\u2022  <b>ITABO CRM</b> \u2014 nome del sistema", styles['bullet']))
    S(Paragraph("\u2022  <b>Total Leads</b> \u2014 numero totale lead nel sistema", styles['bullet']))
    S(Paragraph("\u2022  <b>With Email</b> \u2014 lead che hanno un indirizzo email", styles['bullet']))
    S(Paragraph("\u2022  <b>Contacted</b> \u2014 lead che hai gia' contattato (status 2-6)", styles['bullet']))
    S(Paragraph("\u2022  <b>Hot</b> \u2014 lead interessati o in fase avanzata (status 7+)", styles['bullet']))

    S(Paragraph("Barra Filtri", styles['h2']))
    S(Paragraph("\u2022  <b>Country</b> \u2014 filtra per paese", styles['bullet']))
    S(Paragraph("\u2022  <b>Status</b> \u2014 filtra per stato della pipeline (1-18)", styles['bullet']))
    S(Paragraph("\u2022  <b>Has Email</b> \u2014 mostra solo lead con/senza email", styles['bullet']))
    S(Paragraph("\u2022  <b>Type</b> \u2014 filtra per tipologia business", styles['bullet']))
    S(Paragraph("\u2022  <b>Search</b> \u2014 cerca per nome azienda, citta', telefono, email", styles['bullet']))

    S(Paragraph("Barra Paesi (chips)", styles['h2']))
    S(Paragraph("Bottoni rapidi per filtrare per paese. Il numero tra parentesi indica quanti lead ci sono. I paesi prioritari sono evidenziati in arancione.", styles['body']))

    S(Paragraph("Pannello Sinistro \u2014 Lista Lead", styles['h2']))
    S(Paragraph("Elenco delle schede lead con: nome azienda, citta'/paese, tipologia, status attuale.", styles['body']))

    S(Paragraph("Pannello Destro \u2014 Dettaglio Lead", styles['h2']))
    S(Paragraph("Quando clicchi su un lead, si apre il pannello dettaglio con tutte le informazioni e azioni disponibili.", styles['body']))

    # ── 3. PIPELINE ──
    S(PageBreak())
    S(Paragraph("3. LA PIPELINE \u2014 18 STEP", styles['h1']))
    S(Paragraph("Ogni lead attraversa questi passaggi. Cambia lo status dal menu a tendina nel pannello dettaglio.", styles['body']))

    pipeline_data = [
        ["#", "Status", "Cosa fare"],
        ["1", "New", "Lead non ancora contattato"],
        ["2", "WA Called", "Hai chiamato su WhatsApp \u2014 ha risposto"],
        ["2b", "WA No Answer", "Hai chiamato su WhatsApp \u2014 non ha risposto"],
        ["3", "WA Messaged", "Hai inviato messaggio WhatsApp"],
        ["4", "Emailed", "Hai inviato email (template First Contact)"],
        ["5", "Social Sent", "Hai inviato richiesta LinkedIn/Instagram/Facebook"],
        ["6", "Follow-up", "In attesa di risposta \u2014 follow-up ogni 3-5 giorni"],
        ["7", "Interested", "Ha risposto positivamente, e' interessato"],
        ["8", "Address Confirmed", "Ha confermato indirizzo per invio campione"],
        ["9", "Proforma Invoice", "Hai inviato proforma invoice per il campione"],
        ["10", "Sample Shipped", "Campione spedito \u2014 inserisci tracking number"],
        ["11", "Delivered", "Campione consegnato"],
        ["12", "Receipt Confirmed", "Il cliente ha confermato ricezione campione"],
        ["13", "Tasting Booked", "Video degustazione programmata"],
        ["14", "Tasting Done", "Video degustazione completata"],
        ["15", "Post-Tasting Follow-up", "Follow-up dopo degustazione \u2014 chiedi feedback"],
        ["16", "Negotiating", "Negoziazione MOQ, prezzo, termini pagamento"],
        ["17", "First Order", "Primo ordine: proforma, pagamento, spedizione"],
        ["18", "Deal Closed!", "Ordine completato e spedito"],
        ["X", "Not Interested", "Non interessato \u2014 archiviato"],
    ]

    col_widths = [12*mm, 42*mm, 116*mm]
    t = Table(pipeline_data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), GOLD),
        ('TEXTCOLOR', (0, 0), (-1, 0), DARK_BG),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('TEXTCOLOR', (0, 1), (-1, -1), LIGHT_GRAY),
        ('BACKGROUND', (0, 1), (-1, -1), DARK_CARD),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [DARK_CARD, DARK_CARD2]),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor("#333333")),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ]))
    S(t)

    # ── 4. PROCEDURA CHIAMATA ──
    S(PageBreak())
    S(Paragraph("4. PROCEDURA CHIAMATA (COLD CALL)", styles['h1']))

    S(Paragraph("Prima della chiamata", styles['h2']))
    S(Paragraph("1. Clicca sul lead nella lista", styles['bullet']))
    S(Paragraph("2. Leggi le informazioni: azienda, tipologia, paese, sito web", styles['bullet']))
    S(Paragraph("3. Clicca il bottone <b>\"Call Script\"</b> per aprire lo script guidato", styles['bullet']))

    S(Paragraph("FASE 1 \u2014 PREPARAZIONE", styles['h3']))
    S(Paragraph("\u2022  Verifica il fuso orario del paese", styles['bullet']))
    S(Paragraph("\u2022  Leggi le note precedenti se ci sono", styles['bullet']))
    S(Paragraph("\u2022  Prepara il tuo pitch mentale", styles['bullet']))

    S(Paragraph("FASE 2 \u2014 APERTURA", styles['h3']))
    S(Paragraph("<i>\"Hi, this is [tuo nome] from ITABO, an Italian wine export company based in Bologna. Do you have 2 minutes?\"</i>", styles['body']))
    S(Paragraph("\u2022  Se dice NO: \"No problem! When is a good time to call back?\" \u2192 Segna data follow-up", styles['bullet']))
    S(Paragraph("\u2022  Se dice SI: vai alla fase 3", styles['bullet']))

    S(Paragraph("FASE 3 \u2014 DOMANDE", styles['h3']))
    S(Paragraph("\u2022  \"What types of wine do you currently import?\"", styles['bullet']))
    S(Paragraph("\u2022  \"Which price range works best for your market?\"", styles['bullet']))
    S(Paragraph("\u2022  \"How many bottles do you typically order?\"", styles['bullet']))

    S(Paragraph("FASE 4 \u2014 PITCH", styles['h3']))
    S(Paragraph("\u2022  \"We have 8 premium Italian wines, all at one flat price: 3.80 euro per bottle FOB\"", styles['bullet']))
    S(Paragraph("\u2022  \"2 DOC, 4 IGP, 2 IGT \u2014 certified quality\"", styles['bullet']))
    S(Paragraph("\u2022  \"We can send you a free 6-bottle sample to taste\"", styles['bullet']))

    S(Paragraph("FASE 5 \u2014 CHIUSURA", styles['h3']))
    S(Paragraph("\u2022  Se interessato: \"Can I get your shipping address for the sample?\"", styles['bullet']))
    S(Paragraph("\u2022  Se indeciso: \"Can I send you our catalog by email/WhatsApp?\"", styles['bullet']))
    S(Paragraph("\u2022  Se no: \"Thank you for your time. Can I follow up in a few weeks?\"", styles['bullet']))

    S(Paragraph("Dopo la chiamata", styles['h2']))
    S(Paragraph("1. Aggiorna lo <b>status</b> (WA Called, Interested, Not Interested, ecc.)", styles['bullet']))
    S(Paragraph("2. Scrivi <b>note</b> su cosa avete detto", styles['bullet']))
    S(Paragraph("3. Imposta la <b>data follow-up</b> se necessario", styles['bullet']))
    S(Paragraph("4. Passa al lead successivo", styles['bullet']))

    # ── 5. TEMPLATE MESSAGGI ──
    S(Paragraph("5. TEMPLATE MESSAGGI", styles['h1']))
    S(Paragraph("Il CRM ha template pronti in <b>3 lingue</b> (English, Espanol, Francais) per:", styles['body']))

    S(Paragraph("Tipi di template:", styles['h3']))
    S(Paragraph("\u2022  <b>First Contact</b> \u2014 primo messaggio di presentazione", styles['bullet']))
    S(Paragraph("\u2022  <b>Follow-up</b> \u2014 messaggio di follow-up dopo il primo contatto", styles['bullet']))
    S(Paragraph("\u2022  <b>Sample Sent</b> \u2014 messaggio dopo aver spedito il campione", styles['bullet']))

    S(Paragraph("Canali disponibili:", styles['h3']))
    S(Paragraph("\u2022  <b>WhatsApp</b> \u2014 testo breve, diretto", styles['bullet']))
    S(Paragraph("\u2022  <b>Email</b> \u2014 testo professionale con oggetto", styles['bullet']))
    S(Paragraph("\u2022  <b>SMS</b> \u2014 testo ultra-breve", styles['bullet']))
    S(Paragraph("\u2022  <b>Telegram</b> \u2014 per mercati dove Telegram e' popolare", styles['bullet']))

    S(Paragraph("Come usare i template:", styles['h3']))
    S(Paragraph("1. Clicca sul lead", styles['bullet']))
    S(Paragraph("2. Nel pannello dettaglio, clicca <b>\"Templates\"</b>", styles['bullet']))
    S(Paragraph("3. Seleziona il tipo (First Contact / Follow-up / Sample Sent)", styles['bullet']))
    S(Paragraph("4. Seleziona il canale (WhatsApp / Email / SMS / Telegram)", styles['bullet']))
    S(Paragraph("5. Il template si riempie automaticamente con i dati del lead", styles['bullet']))
    S(Paragraph("6. Clicca <b>\"Copy\"</b> per copiare il testo", styles['bullet']))
    S(Paragraph("7. Incollalo nella chat WhatsApp, email, ecc.", styles['bullet']))

    # ── 6. BOTTONI AZIONE RAPIDA ──
    S(Paragraph("6. BOTTONI AZIONE RAPIDA", styles['h1']))
    S(Paragraph("Nel pannello dettaglio di ogni lead trovi:", styles['body']))
    S(Paragraph("\u2022  <b>WA Call</b> \u2014 apre WhatsApp per chiamare il numero", styles['bullet']))
    S(Paragraph("\u2022  <b>WA Video</b> \u2014 apre WhatsApp per video chiamata", styles['bullet']))
    S(Paragraph("\u2022  <b>Google Meet</b> \u2014 apre Google Meet per creare una call", styles['bullet']))
    S(Paragraph("\u2022  <b>Zoom</b> \u2014 apre Zoom per creare una call", styles['bullet']))
    S(Paragraph("\u2022  <b>LinkedIn</b> \u2014 cerca l'azienda su LinkedIn", styles['bullet']))
    S(Paragraph("\u2022  <b>Instagram</b> \u2014 cerca l'azienda su Instagram", styles['bullet']))
    S(Paragraph("\u2022  <b>Facebook</b> \u2014 cerca l'azienda su Facebook", styles['bullet']))

    # ── 7. NOTE E FOLLOW-UP ──
    S(Paragraph("7. NOTE E FOLLOW-UP", styles['h1']))
    S(Paragraph("Note", styles['h2']))
    S(Paragraph("\u2022  Nel pannello dettaglio, c'e' un campo note", styles['bullet']))
    S(Paragraph("\u2022  Scrivi tutto: cosa avete detto, richieste speciali, preferenze vino", styles['bullet']))
    S(Paragraph("\u2022  Le note si salvano automaticamente", styles['bullet']))
    S(Paragraph("Esempio: <i>\"Interested in Prosecco and Primitivo. Ships to Lagos port. Wants 2 pallets first order. Call back Thursday.\"</i>", styles['body']))

    S(Paragraph("Follow-up", styles['h2']))
    S(Paragraph("\u2022  Imposta la data dell'ultimo contatto", styles['bullet']))
    S(Paragraph("\u2022  Il CRM ti aiuta a tenere traccia di chi non senti da troppo tempo", styles['bullet']))
    S(Paragraph("\u2022  Regola: follow-up ogni 3-5 giorni per lead in status 6 (Follow-up)", styles['bullet']))

    # ── 8. EXPORT ──
    S(Paragraph("8. EXPORT", styles['h1']))

    S(Paragraph("Export CSV", styles['h2']))
    S(Paragraph("\u2022  Clicca <b>\"Export CSV\"</b> in alto a destra", styles['bullet']))
    S(Paragraph("\u2022  Esporta tutti i lead filtrati in formato Excel/CSV", styles['bullet']))
    S(Paragraph("\u2022  Utile per report, analisi, backup", styles['bullet']))

    S(Paragraph("Export Rubrica (VCF)", styles['h2']))
    S(Paragraph("\u2022  Clicca <b>\"Export Rubrica\"</b> in alto a destra", styles['bullet']))
    S(Paragraph("\u2022  Scarica un file .vcf con tutti i contatti (nome, telefono, email, citta')", styles['bullet']))
    S(Paragraph("\u2022  Apri il file sul telefono \u2192 tutti i contatti vengono importati nella rubrica", styles['bullet']))
    S(Paragraph("\u2022  Funziona su iPhone e Android", styles['bullet']))
    S(Paragraph("<b>Consiglio:</b> filtra prima per paese, cosi' importi solo i contatti che ti servono", styles['important']))

    # ── 9. USO MOBILE + PC ──
    S(PageBreak())
    S(Paragraph("9. USO DA MOBILE + PC (SETUP CONSIGLIATO)", styles['h1']))
    S(Paragraph("Il modo migliore per lavorare e' <b>telefono + PC insieme</b>:", styles['body']))
    S(Paragraph("\u2022  <b>PC</b> \u2014 hai il CRM aperto con tutti i dettagli, filtri, note, script, template", styles['bullet']))
    S(Paragraph("\u2022  <b>Telefono</b> \u2014 lo usi per chiamare su WhatsApp", styles['bullet']))

    S(Paragraph("Come funziona su mobile", styles['h2']))
    S(Paragraph("Il CRM da telefono mostra una versione semplificata:", styles['body']))
    S(Paragraph("\u2022  <b>Solo la lista lead</b> con nome azienda e citta'/paese", styles['bullet']))
    S(Paragraph("\u2022  <b>Bottone verde WhatsApp</b> per ogni lead con numero di telefono", styles['bullet']))
    S(Paragraph("\u2022  Tocca il bottone verde \u2192 si apre <b>WhatsApp</b> e parte la chiamata vocale", styles['bullet']))
    S(Paragraph("\u2022  Filtri e pannello dettaglio sono nascosti (li usi dal PC)", styles['bullet']))

    S(Paragraph("Workflow consigliato (telefono davanti al PC)", styles['h2']))
    S(Paragraph("1. <b>Sul PC:</b> apri il CRM \u2014 filtra i lead, leggi le info", styles['bullet']))
    S(Paragraph("2. <b>Sul telefono:</b> apri lo stesso link", styles['bullet']))
    S(Paragraph("3. <b>Sul telefono:</b> tocca il bottone verde del lead \u2192 parte la chiamata WhatsApp", styles['bullet']))
    S(Paragraph("4. <b>Sul PC:</b> mentre parli, leggi lo script di vendita (bottone \"Call Script\")", styles['bullet']))
    S(Paragraph("5. <b>Sul PC:</b> dopo la chiamata, aggiorna lo status, scrivi le note", styles['bullet']))
    S(Paragraph("6. <b>Sul PC:</b> se serve, copia il template WhatsApp/Email e invialo", styles['bullet']))
    S(Paragraph("7. Passa al lead successivo", styles['bullet']))

    # ── 10. WORKFLOW GIORNALIERO ──
    S(Paragraph("10. WORKFLOW GIORNALIERO CONSIGLIATO", styles['h1']))

    S(Paragraph("Mattina (1 ora)", styles['h2']))
    S(Paragraph("1. Apri il CRM su desktop", styles['bullet']))
    S(Paragraph("2. Filtra per status \"6. Follow-up\" \u2192 chiama/scrivi chi aspetta risposta", styles['bullet']))
    S(Paragraph("3. Filtra per status \"New\" \u2192 seleziona 20-30 lead nuovi", styles['bullet']))

    S(Paragraph("Chiamate (2-3 ore) \u2014 telefono + PC insieme", styles['h2']))
    S(Paragraph("4. Per ogni lead nuovo:", styles['bullet']))
    S(Paragraph("   \u2022  PC: clicca sul lead, apri lo script", styles['bullet']))
    S(Paragraph("   \u2022  Telefono: tocca il bottone verde WhatsApp per chiamare", styles['bullet']))
    S(Paragraph("   \u2022  Se risponde \u2192 segui lo script \u2192 aggiorna status dal PC", styles['bullet']))
    S(Paragraph("   \u2022  Se non risponde \u2192 metti \"WA No Answer\" \u2192 invia messaggio WhatsApp", styles['bullet']))
    S(Paragraph("5. Obiettivo: <b>30-50 contatti al giorno</b>", styles['bullet']))

    S(Paragraph("Pomeriggio (1 ora)", styles['h2']))
    S(Paragraph("6. Filtra per \"Interested\" e \"Address Confirmed\" \u2192 gestisci campioni", styles['bullet']))
    S(Paragraph("7. Filtra per \"Tasting Booked\" \u2192 prepara video degustazioni", styles['bullet']))
    S(Paragraph("8. Aggiorna note per tutti i lead contattati oggi", styles['bullet']))

    S(Paragraph("Fine giornata", styles['h2']))
    S(Paragraph("9. Controlla le statistiche nell'header", styles['bullet']))
    S(Paragraph("10. Export CSV per backup settimanale", styles['bullet']))

    # ── 11. KPI ──
    S(Paragraph("11. OBIETTIVI E KPI", styles['h1']))

    kpi_data = [
        ["Metrica", "Obiettivo Giornaliero", "Obiettivo Settimanale"],
        ["Chiamate totali", "30-50", "150-250"],
        ["Nuovi contatti", "20-30", "100-150"],
        ["Lead interessati", "3-5", "15-25"],
        ["Campioni inviati", "1-2", "5-10"],
        ["Video degustazioni", "1", "3-5"],
    ]
    kpi_widths = [60*mm, 50*mm, 50*mm]
    kt = Table(kpi_data, colWidths=kpi_widths, repeatRows=1)
    kt.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), GOLD),
        ('TEXTCOLOR', (0, 0), (-1, 0), DARK_BG),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TEXTCOLOR', (0, 1), (-1, -1), LIGHT_GRAY),
        ('BACKGROUND', (0, 1), (-1, -1), DARK_CARD),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [DARK_CARD, DARK_CARD2]),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor("#333333")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ]))
    S(kt)

    # ── 12. RISOLUZIONE PROBLEMI ──
    S(Paragraph("12. RISOLUZIONE PROBLEMI", styles['h1']))

    S(Paragraph("I dati sono spariti", styles['h3']))
    S(Paragraph("Il browser ha cancellato il localStorage. Clicca \"Reset\" per ricaricare i 5.626 lead originali. Le note e gli status modificati andranno persi.", styles['body']))

    S(Paragraph("Il sito non si carica", styles['h3']))
    S(Paragraph("Verifica la connessione internet. Il CRM richiede internet per caricarsi.", styles['body']))

    S(Paragraph("Voglio usare un altro dispositivo", styles['h3']))
    S(Paragraph("I dati sono salvati nel browser locale. Se vuoi trasferire i progressi, usa \"Export CSV\" dal primo dispositivo.", styles['body']))

    S(Paragraph("Come faccio backup", styles['h3']))
    S(Paragraph("Clicca \"Export CSV\" regolarmente (almeno 1 volta a settimana). Salva il file su Google Drive o computer.", styles['body']))

    # ── 13. LINK UTILI ──
    S(Paragraph("13. LINK UTILI", styles['h1']))
    S(Paragraph("\u2022  <b>CRM Online:</b> https://itabo-crm-wine.vercel.app", styles['bullet']))
    S(Paragraph("\u2022  <b>Sito ITABO:</b> (in costruzione su Lovable)", styles['bullet']))
    S(Paragraph("\u2022  <b>Catalogo PDF:</b> da caricare su /download", styles['bullet']))
    S(Paragraph("\u2022  <b>Firma Email:</b> file FIRMA_EMAIL_ITABO.html nella cartella SALES_KIT", styles['bullet']))

    S(Spacer(1, 20*mm))
    S(HRFlowable(width="40%", thickness=1, color=GOLD, spaceAfter=4*mm))
    S(Paragraph("Manuale creato il 16 Marzo 2026 \u2014 ITABO SRL", ParagraphStyle('footer', fontName='Helvetica', fontSize=9, textColor=MID_GRAY, alignment=TA_CENTER)))

    doc.build(story, onFirstPage=bg_canvas, onLaterPages=bg_canvas)
    print(f"PDF generato: {OUTPUT}")

if __name__ == "__main__":
    build_pdf()
