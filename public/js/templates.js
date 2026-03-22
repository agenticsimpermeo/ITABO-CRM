// ==================== ITABO CRM — Message Templates ====================
import { SITE } from './config.js';

export const TEMPLATE_TYPES = ['first', 'followup', 'sample'];
export const TEMPLATE_TYPE_LABELS = { first: 'First Contact', followup: 'Follow-up', sample: 'Sample Sent' };

export const TEMPLATES = {
  whatsapp: {
    first: {
      en: `Hi, I'm Alessandro from *ITABO* — Italian wines, Bologna.\n\n8 premium DOC/IGP wines from *\u20ac3.80/bottle FOB*. Ready to ship worldwide.\n\nCatalog: ${SITE}/catalogo\nPrice list: ${SITE}/listino_prezzi\n\nI can send you the PDF catalog right here on WhatsApp. Interested?\n\nAlessandro Rimondi | ITABO\nitaboitalianwine.com`,
      es: `Hola, soy Alessandro de *ITABO* — vinos italianos, Bologna.\n\n8 vinos premium DOC/IGP desde *\u20ac3.80/botella FOB*. Listos para env\u00edo mundial.\n\nCat\u00e1logo: ${SITE}/catalogo\nLista de precios: ${SITE}/listino_prezzi\n\nPuedo enviarte el cat\u00e1logo PDF aqu\u00ed por WhatsApp. \u00bfTe interesa?\n\nAlessandro Rimondi | ITABO`,
      fr: `Bonjour, je suis Alessandro de *ITABO* — vins italiens, Bologne.\n\n8 vins premium DOC/IGP \u00e0 partir de *3,80\u20ac/bouteille FOB*. Pr\u00eats pour exp\u00e9dition mondiale.\n\nCatalogue : ${SITE}/catalogo\nTarifs : ${SITE}/listino_prezzi\n\nJe peux vous envoyer le catalogue PDF ici sur WhatsApp. Int\u00e9ress\u00e9 ?\n\nAlessandro Rimondi | ITABO`,
    },
    followup: {
      en: `Hi again from ITABO. Just following up on my message about our Italian wines.\n\nDid you have a chance to look at our catalog?\n${SITE}/catalogo\n\nI can send you the PDF right here. Happy to answer any questions.\n\nAlessandro | ITABO`,
      es: `Hola de nuevo desde ITABO. Solo hago seguimiento sobre nuestros vinos italianos.\n\n\u00bfPudiste ver nuestro cat\u00e1logo?\n${SITE}/catalogo\n\nPuedo enviarte el PDF aqu\u00ed. Disponible para cualquier pregunta.\n\nAlessandro | ITABO`,
      fr: `Bonjour, c'est Alessandro de ITABO. Je fais suite \u00e0 mon message sur nos vins italiens.\n\nAvez-vous pu consulter notre catalogue ?\n${SITE}/catalogo\n\nJe peux vous envoyer le PDF ici. Disponible pour toute question.\n\nAlessandro | ITABO`,
    },
    sample: {
      en: `Great news! Your ITABO sample is on the way.\n\nTracking: [TRACKING_NUMBER]\nEstimated delivery: [DATE]\n\nWhile you wait, explore our full range:\n${SITE}/catalogo\n${SITE}/listino_prezzi\n\nLooking forward to your feedback!\n\nAlessandro | ITABO`,
      es: `\u00a1Buenas noticias! Tu muestra ITABO est\u00e1 en camino.\n\nTracking: [TRACKING_NUMBER]\nEntrega estimada: [DATE]\n\nMientras tanto, explora nuestra gama completa:\n${SITE}/catalogo\n${SITE}/listino_prezzi\n\n\u00a1Espero tus comentarios!\n\nAlessandro | ITABO`,
      fr: `Bonne nouvelle ! Votre \u00e9chantillon ITABO est en route.\n\nSuivi : [TRACKING_NUMBER]\nLivraison estim\u00e9e : [DATE]\n\nEn attendant, d\u00e9couvrez notre gamme compl\u00e8te :\n${SITE}/catalogo\n${SITE}/listino_prezzi\n\nAu plaisir de recevoir vos retours !\n\nAlessandro | ITABO`,
    },
  },
  email: {
    first: {
      en: { subject: `ITABO \u2014 Italian Wines, from \u20ac3.80/bottle FOB \u2014 {COUNTRY}`, body: `Hi {NAME},\n\nI'm Alessandro from ITABO, an Italian wine exporter based in Bologna.\n\nWe offer 8 premium DOC/IGP wines \u2014 Prosecco, Primitivo, Negroamaro, Lambrusco, Sangiovese, Chardonnay, Pignoletto and Cabernet/Merlot \u2014 from \u20ac3.80/bottle FOB. Ready to ship worldwide.\n\n\u2022 Catalog: ${SITE}/catalogo\n\u2022 Price list: ${SITE}/listino_prezzi\n\nContainer-ready (20ft/40ft), MOQ 1 europallet.\n\nI'd love to send you our full portfolio and discuss how we can work together.\n\nInterested? Just reply to this email.\n\nBest,\nAlessandro Rimondi\nExport Manager \u2014 ITABO\nitaboitalianwine.com | itabo.srl@gmail.com` },
      es: { subject: `ITABO \u2014 Vinos Italianos, desde \u20ac3.80/botella FOB \u2014 {COUNTRY}`, body: `Hola {NAME},\n\nSoy Alessandro de ITABO, exportador de vinos italianos, Bologna.\n\nOfrecemos 8 vinos premium DOC/IGP \u2014 Prosecco, Primitivo, Negroamaro, Lambrusco, Sangiovese, Chardonnay, Pignoletto y Cabernet/Merlot \u2014 desde \u20ac3.80/botella FOB. Listos para env\u00edo mundial.\n\n\u2022 Cat\u00e1logo: ${SITE}/catalogo\n\u2022 Lista de precios: ${SITE}/listino_prezzi\n\nContainer-ready (20ft/40ft), MOQ 1 europallet.\n\nMe encantar\u00eda enviarte nuestro portfolio completo y hablar de c\u00f3mo podemos colaborar.\n\n\u00bfTe interesa? Responde a este email.\n\nSaludos,\nAlessandro Rimondi\nExport Manager \u2014 ITABO\nitaboitalianwine.com | itabo.srl@gmail.com` },
      fr: { subject: `ITABO \u2014 Vins Italiens, d\u00e8s 3,80\u20ac/bouteille FOB \u2014 {COUNTRY}`, body: `Bonjour {NAME},\n\nJe suis Alessandro de ITABO, exportateur de vins italiens, Bologne.\n\nNous proposons 8 vins premium DOC/IGP \u2014 Prosecco, Primitivo, Negroamaro, Lambrusco, Sangiovese, Chardonnay, Pignoletto et Cabernet/Merlot \u2014 d\u00e8s 3,80\u20ac/bouteille FOB. Pr\u00eats pour exp\u00e9dition mondiale.\n\n\u2022 Catalogue : ${SITE}/catalogo\n\u2022 Tarifs : ${SITE}/listino_prezzi\n\nContainer-ready (20ft/40ft), MOQ 1 europalette.\n\nJe serais ravi de vous envoyer notre portfolio complet et discuter d'une collaboration.\n\nInt\u00e9ress\u00e9 ? R\u00e9pondez \u00e0 cet email.\n\nCordialement,\nAlessandro Rimondi\nExport Manager \u2014 ITABO\nitaboitalianwine.com | itabo.srl@gmail.com` },
    },
    followup: {
      en: { subject: `Re: ITABO Italian Wines \u2014 follow-up`, body: `Hi {NAME},\n\nI reached out last week about ITABO's Italian wines. Just wanted to make sure my email didn't get lost.\n\nQuick recap: 8 premium wines, from \u20ac3.80 FOB, container-ready.\n\nHave a look at our catalog:\n${SITE}/catalogo\n\nHappy to jump on a quick call or send our full portfolio. Whatever works for you.\n\nBest,\nAlessandro Rimondi\nITABO | itabo.srl@gmail.com` },
      es: { subject: `Re: Vinos italianos ITABO \u2014 seguimiento`, body: `Hola {NAME},\n\nTe escrib\u00ed la semana pasada sobre los vinos de ITABO. Solo quiero asegurarme de que mi email no se perdi\u00f3.\n\nResumen: 8 vinos premium, desde \u20ac3.80 FOB, container-ready.\n\nEcha un vistazo a nuestro cat\u00e1logo:\n${SITE}/catalogo\n\nDisponible para una llamada r\u00e1pida o enviar nuestro portfolio completo.\n\nSaludos,\nAlessandro Rimondi\nITABO | itabo.srl@gmail.com` },
      fr: { subject: `Re: Vins italiens ITABO \u2014 suivi`, body: `Bonjour {NAME},\n\nJe vous ai \u00e9crit la semaine derni\u00e8re au sujet des vins ITABO. Je voulais m'assurer que mon email ne s'est pas perdu.\n\nR\u00e9sum\u00e9 : 8 vins premium, d\u00e8s 3,80\u20ac FOB, container-ready.\n\nConsultez notre catalogue :\n${SITE}/catalogo\n\nDisponible pour un appel rapide ou pour envoyer notre portfolio complet.\n\nCordialement,\nAlessandro Rimondi\nITABO | itabo.srl@gmail.com` },
    },
    sample: {
      en: { subject: `Your ITABO sample is on the way!`, body: `Hi {NAME},\n\nGreat news \u2014 your ITABO wine sample has been shipped!\n\nTracking number: [TRACKING_NUMBER]\nEstimated delivery: [DATE]\n\nFull catalog and pricing:\n${SITE}/catalogo\n${SITE}/listino_prezzi\n\nI'll follow up once it arrives. Looking forward to your feedback!\n\nBest,\nAlessandro Rimondi\nITABO | itabo.srl@gmail.com` },
      es: { subject: `\u00a1Tu muestra ITABO est\u00e1 en camino!`, body: `Hola {NAME},\n\n\u00a1Buenas noticias! Tu muestra de vinos ITABO ha sido enviada.\n\nN\u00famero de seguimiento: [TRACKING_NUMBER]\nEntrega estimada: [DATE]\n\nCat\u00e1logo completo y precios:\n${SITE}/catalogo\n${SITE}/listino_prezzi\n\nTe contactar\u00e9 cuando llegue. \u00a1Espero tus comentarios!\n\nSaludos,\nAlessandro Rimondi\nITABO | itabo.srl@gmail.com` },
      fr: { subject: `Votre \u00e9chantillon ITABO est en route !`, body: `Bonjour {NAME},\n\nBonne nouvelle \u2014 votre \u00e9chantillon ITABO a \u00e9t\u00e9 exp\u00e9di\u00e9 !\n\nNum\u00e9ro de suivi : [TRACKING_NUMBER]\nLivraison estim\u00e9e : [DATE]\n\nCatalogue complet et tarifs :\n${SITE}/catalogo\n${SITE}/listino_prezzi\n\nJe vous recontacterai une fois arriv\u00e9. Au plaisir de recevoir vos retours !\n\nCordialement,\nAlessandro Rimondi\nITABO | itabo.srl@gmail.com` },
    },
  },
  sms: {
    first: {
      en: `ITABO: 8 Italian wines from \u20ac3.80/bottle FOB. Catalog: ${SITE}/catalogo — Alessandro`,
      es: `ITABO: 8 vinos italianos desde \u20ac3.80/botella FOB. Cat\u00e1logo: ${SITE}/catalogo — Alessandro`,
      fr: `ITABO: 8 vins italiens d\u00e8s 3,80\u20ac/bouteille FOB. Catalogue: ${SITE}/catalogo — Alessandro`,
    },
    followup: {
      en: `Hi from ITABO. Did you see our Italian wine catalog? ${SITE}/catalogo — Happy to chat! Alessandro`,
      es: `Hola desde ITABO. \u00bfViste nuestro cat\u00e1logo? ${SITE}/catalogo — \u00a1Hablemos! Alessandro`,
      fr: `Bonjour, ITABO. Avez-vous vu notre catalogue ? ${SITE}/catalogo — Disponible ! Alessandro`,
    },
    sample: {
      en: `ITABO: Your sample is shipped! Tracking: [TRACKING_NUMBER]. Feedback? Reply here! — Alessandro`,
      es: `ITABO: \u00a1Tu muestra fue enviada! Tracking: [TRACKING_NUMBER]. \u00bfComentarios? \u00a1Responde aqu\u00ed! — Alessandro`,
      fr: `ITABO: Votre \u00e9chantillon est exp\u00e9di\u00e9 ! Suivi: [TRACKING_NUMBER]. Retours ? R\u00e9pondez ici ! — Alessandro`,
    },
  },
  telegram: {
    first: {
      en: `Hi, I'm Alessandro from ITABO — Italian wines, Bologna.\n\n8 premium DOC/IGP wines from \u20ac3.80/bottle FOB.\n\nCatalog: ${SITE}/catalogo\nPrices: ${SITE}/listino_prezzi\n\nInterested? Let's talk!\n\nAlessandro Rimondi | ITABO`,
      es: `Hola, soy Alessandro de ITABO — vinos italianos, Bologna.\n\n8 vinos premium DOC/IGP desde \u20ac3.80/botella FOB.\n\nCat\u00e1logo: ${SITE}/catalogo\nPrecios: ${SITE}/listino_prezzi\n\n\u00bfInteresado? \u00a1Hablemos!\n\nAlessandro Rimondi | ITABO`,
      fr: `Bonjour, je suis Alessandro de ITABO — vins italiens, Bologne.\n\n8 vins premium DOC/IGP d\u00e8s 3,80\u20ac/bouteille FOB.\n\nCatalogue : ${SITE}/catalogo\nTarifs : ${SITE}/listino_prezzi\n\nInt\u00e9ress\u00e9 ? Discutons !\n\nAlessandro Rimondi | ITABO`,
    },
    followup: {
      en: `Hi again from ITABO. Following up on Italian wines. Catalog: ${SITE}/catalogo — Alessandro`,
      es: `Hola de nuevo desde ITABO. Seguimiento sobre vinos italianos. Cat\u00e1logo: ${SITE}/catalogo — Alessandro`,
      fr: `Bonjour, ITABO. Suivi vins italiens. Catalogue : ${SITE}/catalogo — Alessandro`,
    },
    sample: {
      en: `Your ITABO sample is shipped! Tracking: [TRACKING_NUMBER]. Full catalog: ${SITE}/catalogo — Alessandro`,
      es: `\u00a1Tu muestra ITABO fue enviada! Tracking: [TRACKING_NUMBER]. Cat\u00e1logo: ${SITE}/catalogo — Alessandro`,
      fr: `Votre \u00e9chantillon ITABO est exp\u00e9di\u00e9 ! Suivi : [TRACKING_NUMBER]. Catalogue : ${SITE}/catalogo — Alessandro`,
    },
  },
};

export const LINKEDIN_TEMPLATES = {
  connect: {
    en: `Hi {DM_NAME}, I'm Alessandro from ITABO \u2014 Italian wines, Bologna.\n\n8 premium DOC/IGP wines from \u20ac3.80/bottle FOB. Your brand on Italian wine.\n\nI'd love to explore a partnership with {COMPANY}. Open to a quick chat?`,
    es: `Hola {DM_NAME}, soy Alessandro de ITABO \u2014 vinos italianos, Bologna.\n\n8 vinos premium DOC/IGP desde \u20ac3.80/botella FOB. Tu marca en vino italiano.\n\nMe gustar\u00eda explorar una colaboraci\u00f3n con {COMPANY}. \u00bfHablamos?`,
    fr: `Bonjour {DM_NAME}, je suis Alessandro de ITABO \u2014 vins italiens, Bologne.\n\n8 vins premium DOC/IGP d\u00e8s 3,80\u20ac/bouteille FOB. Votre marque sur du vin italien.\n\nJ'aimerais explorer un partenariat avec {COMPANY}. Disponible pour un \u00e9change ?`,
  },
  message: {
    en: `Hi {DM_NAME}, thanks for connecting!\n\nI wanted to share our portfolio \u2014 8 premium Italian DOC/IGP wines from \u20ac3.80/bottle FOB, ready to ship. Direct from producers in Puglia, Emilia-Romagna, and Veneto.\n\nCatalog: ${SITE}/catalogo\nPrices: ${SITE}/listino_prezzi\n\nHappy to send you the full details for {COMPANY}.\n\nBest,\nAlessandro Rimondi | ITABO`,
    es: `Hola {DM_NAME}, \u00a1gracias por conectar!\n\nQuiero compartir nuestro portfolio \u2014 8 vinos italianos premium DOC/IGP desde \u20ac3.80/botella FOB, ready to ship. Directos de productores en Puglia, Emilia-Romagna y Veneto.\n\nCat\u00e1logo: ${SITE}/catalogo\nPrecios: ${SITE}/listino_prezzi\n\nEncantado de enviarte m\u00e1s detalles para {COMPANY}.\n\nSaludos,\nAlessandro Rimondi | ITABO`,
    fr: `Bonjour {DM_NAME}, merci pour la connexion !\n\nJe souhaitais partager notre portfolio \u2014 8 vins italiens premium DOC/IGP d\u00e8s 3,80\u20ac/bouteille FOB, ready to ship. Directement des producteurs de Puglia, Emilia-Romagna et V\u00e9n\u00e9tie.\n\nCatalogue : ${SITE}/catalogo\nTarifs : ${SITE}/listino_prezzi\n\nJe serais ravi de vous envoyer plus de d\u00e9tails pour {COMPANY}.\n\nCordialement,\nAlessandro Rimondi | ITABO`,
  },
};

/**
 * Get the template text for a given channel, type, and language.
 */
export function getTemplate(channel, type, lang) {
  const channelTemplates = TEMPLATES[channel];
  if (!channelTemplates) return '';
  const typeTemplates = channelTemplates[type] || channelTemplates.first;
  if (!typeTemplates) return '';
  const tpl = typeTemplates[lang] || typeTemplates.en;
  if (typeof tpl === 'object') return tpl.body || '';
  return tpl || '';
}

export function getEmailSubject(type, lang) {
  const emailTemplates = TEMPLATES.email?.[type];
  if (!emailTemplates) return '';
  const tpl = emailTemplates[lang] || emailTemplates.en;
  return tpl?.subject || '';
}

/**
 * Replace template placeholders with lead data.
 */
export function fillTemplate(text, lead) {
  if (!text || !lead) return text;
  return text
    .replace(/{COMPANY}/g, lead.azienda || '')
    .replace(/{NAME}/g, lead.azienda?.split(/\s/)[0] || '')
    .replace(/{COUNTRY}/g, lead.paese || '')
    .replace(/{CITY}/g, lead.citta || '')
    .replace(/{DM_NAME}/g, '[Name]');
}
