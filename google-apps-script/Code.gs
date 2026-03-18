// Code.gs — ITABO Gmail Proxy
const ALLOWED_ORIGINS = ['https://itabo-crm-wine.vercel.app'];
const SECRET_KEY = 'ITABO_SECRET_2026';

function doPost(e) {
  try {
    const origin = (e && e.parameter && e.parameter.origin) || '';
    const data = JSON.parse(e.postData.contents);

    if (data.secret !== SECRET_KEY) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const { to, subject, body, replyTo } = data;

    if (!to || !subject || !body) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Missing fields' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    GmailApp.sendEmail(to, subject, body, {
      name: 'ITABO — Italian Wine Export',
      replyTo: replyTo || 'itabo.srl@gmail.com',
      htmlBody: body.replace(/\n/g, '<br>')
    });

    console.log('Email sent to: ' + to + ' | Subject: ' + subject);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, sentTo: to }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error(err);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testSend() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        secret: 'ITABO_SECRET_2026',
        to: 'itabo.srl@gmail.com',
        subject: 'Test ITABO Proxy',
        body: 'Test funzionante!'
      })
    },
    parameter: {}
  };
  const result = doPost(testData);
  console.log(result.getContent());
}
