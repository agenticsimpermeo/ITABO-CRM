# MANUALE OPERATIVO — ITABO CRM
## Wine Export Lead Management System

**URL:** https://itabo-crm-wine.vercel.app
**Versione:** 1.0 — Marzo 2026

---

## 1. ACCESSO E PRIMO AVVIO

Apri il link https://itabo-crm-wine.vercel.app dal browser (Chrome consigliato).

Al primo accesso il CRM carica automaticamente tutti i 5,626 lead pre-caricati. I dati vengono salvati nel tuo browser (localStorage), quindi:
- I tuoi progressi (status, note, date) si salvano automaticamente
- Se cambi browser o dispositivo, riparti da zero
- Per resettare tutto: clicca il bottone "Reset" in alto a destra

**IMPORTANTE:** Non cancellare i dati del browser / cronologia, altrimenti perdi i progressi.

---

## 2. STRUTTURA DELL'INTERFACCIA

### Header (barra in alto)
- **ITABO CRM** — nome del sistema
- **Statistiche in tempo reale:**
  - Total Leads — numero totale lead nel sistema
  - With Email — lead che hanno un indirizzo email
  - Contacted — lead che hai gia' contattato (status 2-6)
  - Hot — lead interessati o in fase avanzata (status 7+)

### Barra Filtri
- **Country** — filtra per paese
- **Status** — filtra per stato della pipeline (1-18)
- **Has Email** — mostra solo lead con/senza email
- **Type** — filtra per tipologia business (Importer, Distributor, ecc.)
- **Search** — cerca per nome azienda, citta', telefono, email

### Barra Paesi (chips)
Bottoni rapidi per filtrare per paese. Il numero tra parentesi indica quanti lead ci sono per quel paese. I paesi prioritari sono evidenziati in arancione.

### Pannello Sinistro — Lista Lead
Elenco delle schede lead con: nome azienda, citta'/paese, tipologia, status attuale.

### Pannello Destro — Dettaglio Lead
Quando clicchi su un lead, si apre il pannello dettaglio con tutte le informazioni e azioni disponibili.

---

## 3. LA PIPELINE — 18 STEP

Ogni lead attraversa questi passaggi. Cambia lo status dal menu a tendina nel pannello dettaglio.

| # | Status | Cosa fare |
|---|--------|-----------|
| 1 | **New** | Lead non ancora contattato |
| 2 | **WA Called** | Hai chiamato su WhatsApp — ha risposto |
| 2b | **WA No Answer** | Hai chiamato su WhatsApp — non ha risposto |
| 3 | **WA Messaged** | Hai inviato messaggio WhatsApp (template First Contact) |
| 4 | **Emailed** | Hai inviato email (template First Contact) |
| 5 | **Social Sent** | Hai inviato richiesta LinkedIn/Instagram/Facebook |
| 6 | **Follow-up** | In attesa di risposta — follow-up ogni 3-5 giorni |
| 7 | **Interested** | Ha risposto positivamente, e' interessato |
| 8 | **Address Confirmed** | Ha confermato indirizzo per invio campione |
| 9 | **Proforma Invoice** | Hai inviato proforma invoice per il campione |
| 10 | **Sample Shipped** | Campione spedito — inserisci tracking number nelle note |
| 11 | **Delivered** | Campione consegnato |
| 12 | **Receipt Confirmed** | Il cliente ha confermato di aver ricevuto il campione |
| 13 | **Tasting Booked** | Video degustazione programmata |
| 14 | **Tasting Done** | Video degustazione completata |
| 15 | **Post-Tasting Follow-up** | Follow-up dopo la degustazione — chiedi feedback |
| 16 | **Negotiating** | Negoziazione MOQ, prezzo, termini di pagamento |
| 17 | **First Order** | Primo ordine: proforma inviata, pagamento, spedizione |
| 18 | **Deal Closed!** | Ordine completato e spedito |
| X | **Not Interested** | Non interessato — archiviato |

---

## 4. PROCEDURA CHIAMATA (COLD CALL)

### Prima della chiamata
1. Clicca sul lead nella lista
2. Leggi le informazioni: azienda, tipologia, paese, sito web
3. Clicca il bottone **"Call Script"** per aprire lo script guidato

### Lo script si divide in 5 fasi:

**FASE 1 — PREPARAZIONE**
- Verifica il fuso orario del paese
- Leggi le note precedenti se ci sono
- Prepara il tuo pitch mentale

**FASE 2 — APERTURA**
"Hi, this is [tuo nome] from ITABO, an Italian wine export company based in Bologna. Do you have 2 minutes?"

Se dice NO: "No problem! When is a good time to call back?" → Segna data follow-up
Se dice SI: vai alla fase 3

**FASE 3 — DOMANDE**
- "What types of wine do you currently import?"
- "Which price range works best for your market?"
- "How many bottles do you typically order?"

**FASE 4 — PITCH**
- "We have 8 premium Italian wines, all at one flat price: 3.80 euro per bottle FOB"
- "2 DOC, 4 IGP, 2 IGT — certified quality"
- "We can send you a free 6-bottle sample to taste"

**FASE 5 — CHIUSURA**
- Se interessato: "Can I get your shipping address for the sample?"
- Se indeciso: "Can I send you our catalog by email/WhatsApp?"
- Se no: "Thank you for your time. Can I follow up in a few weeks?"

### Dopo la chiamata
1. Aggiorna lo **status** (WA Called, Interested, Not Interested, ecc.)
2. Scrivi **note** su cosa avete detto
3. Imposta la **data follow-up** se necessario
4. Passa al lead successivo

---

## 5. TEMPLATE MESSAGGI

Il CRM ha template pronti in **3 lingue** (English, Espanol, Francais) per:

### Tipi di template:
- **First Contact** — primo messaggio di presentazione
- **Follow-up** — messaggio di follow-up dopo il primo contatto
- **Sample Sent** — messaggio dopo aver spedito il campione

### Canali disponibili:
- **WhatsApp** — testo breve, diretto
- **Email** — testo professionale con oggetto
- **SMS** — testo ultra-breve
- **Telegram** — per mercati dove Telegram e' popolare

### Come usare i template:
1. Clicca sul lead
2. Nel pannello dettaglio, clicca **"Templates"**
3. Seleziona il tipo (First Contact / Follow-up / Sample Sent)
4. Seleziona il canale (WhatsApp / Email / SMS / Telegram)
5. Il template si riempie automaticamente con i dati del lead
6. Clicca **"Copy"** per copiare il testo
7. Incollalo nella chat WhatsApp, email, ecc.

### Variabili automatiche nei template:
- `{COMPANY}` — nome dell'azienda
- `{DM_NAME}` — nome del contatto
- `${SITE}` — link al sito web ITABO
- `[TRACKING_NUMBER]` — da compilare manualmente
- `[DATE]` — da compilare manualmente

---

## 6. BOTTONI AZIONE RAPIDA

Nel pannello dettaglio di ogni lead trovi:

- **WA Call** — apre WhatsApp per chiamare il numero
- **WA Video** — apre WhatsApp per video chiamata
- **Google Meet** — apre Google Meet per creare una call
- **Zoom** — apre Zoom per creare una call
- **LinkedIn** — cerca l'azienda su LinkedIn
- **Instagram** — cerca l'azienda su Instagram
- **Facebook** — cerca l'azienda su Facebook

---

## 7. NOTE E FOLLOW-UP

### Note
- Nel pannello dettaglio, c'e' un campo note
- Scrivi tutto: cosa avete detto, richieste speciali, preferenze vino
- Le note si salvano automaticamente
- Esempio: "Interested in Prosecco and Primitivo. Ships to Lagos port. Wants 2 pallets first order. Call back Thursday."

### Follow-up
- Imposta la data dell'ultimo contatto
- Il CRM ti aiuta a tenere traccia di chi non senti da troppo tempo
- Regola: follow-up ogni 3-5 giorni per lead in status 6 (Follow-up)

---

## 8. EXPORT

### Export CSV
- Clicca **"Export CSV"** in alto a destra
- Esporta tutti i lead filtrati in formato Excel/CSV
- Utile per report, analisi, backup

### Export Rubrica (VCF)
- Clicca **"Export Rubrica"** in alto a destra
- Scarica un file .vcf con tutti i contatti (nome, telefono, email, citta')
- Apri il file sul telefono → tutti i contatti vengono importati nella rubrica
- Funziona su iPhone e Android
- **Consiglio:** filtra prima per paese, cosi' importi solo i contatti che ti servono

---

## 9. USO DA MOBILE + PC (SETUP CONSIGLIATO)

Il modo migliore per lavorare e' **telefono + PC insieme**:
- **PC** — hai il CRM aperto con tutti i dettagli, filtri, note, script, template
- **Telefono** — lo usi per chiamare su WhatsApp

### Come funziona su mobile
Il CRM da telefono mostra una versione semplificata:
- **Solo la lista lead** con nome azienda e citta'/paese
- **Bottone verde WhatsApp** per ogni lead con numero di telefono
- Tocca il bottone verde → si apre **WhatsApp** e parte la chiamata vocale
- Filtri e pannello dettaglio sono nascosti (li usi dal PC)

### Workflow consigliato (telefono davanti al PC)
1. **Sul PC:** apri https://itabo-crm-wine.vercel.app — filtra i lead, leggi le info
2. **Sul telefono:** apri lo stesso link https://itabo-crm-wine.vercel.app
3. **Sul telefono:** tocca il bottone verde del lead che vuoi chiamare → parte la chiamata WhatsApp
4. **Sul PC:** mentre parli, leggi lo script di vendita (bottone "Call Script")
5. **Sul PC:** dopo la chiamata, aggiorna lo status, scrivi le note, imposta follow-up
6. **Sul PC:** se serve, copia il template WhatsApp/Email e invialo
7. Passa al lead successivo

### Perche' questo setup
- WhatsApp funziona meglio dal telefono (qualita' audio, rubrica, cronologia chat)
- Il PC ti da' tutte le info del lead, lo script, i template — senza dover scrollare sul telefono
- Aggiorni status e note con la tastiera, molto piu' veloce

---

## 10. WORKFLOW GIORNALIERO CONSIGLIATO

### Mattina (1 ora)
1. Apri il CRM su desktop
2. Filtra per status "6. Follow-up" → chiama/scrivi chi aspetta risposta
3. Filtra per status "New" → seleziona 20-30 lead nuovi

### Chiamate (2-3 ore) — telefono + PC insieme
4. Per ogni lead nuovo:
   - **PC:** clicca sul lead, apri lo script (bottone "Call Script")
   - **Telefono:** tocca il bottone verde WhatsApp per chiamare
   - Mentre parli, leggi lo script dal PC
   - Se risponde → segui lo script → aggiorna status dal PC
   - Se non risponde → metti "WA No Answer" dal PC → invia messaggio WhatsApp (template First Contact)
   - Invia anche email se disponibile (copia template dal PC)
5. Obiettivo: 30-50 contatti al giorno

### Pomeriggio (1 ora)
6. Filtra per "Interested" e "Address Confirmed" → gestisci campioni
7. Filtra per "Tasting Booked" → prepara video degustazioni
8. Aggiorna note per tutti i lead contattati oggi

### Fine giornata
9. Controlla le statistiche nell'header
10. Export CSV per backup settimanale

---

## 11. OBIETTIVI E KPI

| Metrica | Obiettivo Giornaliero | Obiettivo Settimanale |
|---------|----------------------|----------------------|
| Chiamate totali | 30-50 | 150-250 |
| Nuovi contatti | 20-30 | 100-150 |
| Lead interessati | 3-5 | 15-25 |
| Campioni inviati | 1-2 | 5-10 |
| Video degustazioni | 1 | 3-5 |

---

## 12. RISOLUZIONE PROBLEMI

**I dati sono spariti:**
Il browser ha cancellato il localStorage. Clicca "Reset" per ricaricare i 5,626 lead originali. Le note e gli status modificati andranno persi.

**Il sito non si carica:**
Verifica la connessione internet. Il CRM e' ospitato su https://itabo-crm-wine.vercel.app e richiede internet.

**Voglio usare un altro dispositivo:**
I dati sono salvati nel browser locale. Se vuoi trasferire i progressi, usa "Export CSV" dal primo dispositivo e tieni traccia manualmente.

**Come faccio backup:**
Clicca "Export CSV" regolarmente (almeno 1 volta a settimana). Salva il file su Google Drive o computer.

---

## 13. LINK UTILI

- **CRM Online:** https://itabo-crm-wine.vercel.app
- **Sito ITABO:** (in costruzione su Lovable)
- **Catalogo PDF:** da caricare su /download
- **Firma Email:** file FIRMA_EMAIL_ITABO.html nella cartella SALES_KIT

---

*Manuale creato il 16 Marzo 2026 — ITABO SRL*
