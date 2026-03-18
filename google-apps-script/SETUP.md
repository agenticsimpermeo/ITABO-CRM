# ITABO CRM — Gmail Integration Setup

## Step 1: Create the Apps Script

1. Login a Google con **itabo.srl@gmail.com**
2. Vai a [script.google.com](https://script.google.com)
3. Click **New project**
4. Cancella il codice di default e incolla il contenuto di `Code.gs`
5. Rinomina il progetto: "ITABO CRM Mail"
6. Salva (Ctrl+S)

## Step 2: Test

1. Seleziona la funzione `testSend` dal dropdown in alto
2. Click **Run**
3. Autorizza quando richiesto (seleziona itabo.srl@gmail.com, click "Advanced" > "Go to ITABO CRM Mail")
4. Controlla la inbox di itabo.srl@gmail.com — dovresti ricevere l'email di test

## Step 3: Deploy come Web App

1. Click **Deploy** > **New deployment**
2. Click l'icona ingranaggio > **Web app**
3. Settings:
   - Description: "ITABO CRM Email Sender"
   - Execute as: **Me** (itabo.srl@gmail.com)
   - Who has access: **Anyone**
4. Click **Deploy**
5. **Copia l'URL** del deployment (tipo `https://script.google.com/macros/s/AKfyc.../exec`)

## Step 4: Configura il CRM

Apri `CRM/public/index.html` e trova questa riga (circa riga 415):

```js
const GMAIL_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
```

Sostituisci `YOUR_APPS_SCRIPT_URL_HERE` con l'URL copiato allo Step 3.

## Step 5: Verifica

1. Apri il CRM
2. Seleziona un lead con email
3. Click "Email" > "Send Email"
4. L'email viene inviata direttamente da itabo.srl@gmail.com

## Sicurezza

- L'API key `ITABO_CRM_2026` previene uso non autorizzato
- Per cambiarla: modificala sia in `Code.gs` che in `index.html` (variabile `GMAIL_API_KEY`)
- Lo script gira con i permessi di itabo.srl@gmail.com — solo quell'account puo' inviare
- Nessun token o password nel codice del CRM

## Limiti Gmail

- 500 email/giorno (account Gmail gratuito)
- 2000 email/giorno (Google Workspace)
