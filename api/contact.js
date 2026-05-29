export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, subject, message, website } = req.body;

  // Honeypot check
  if (website) return res.status(200).json({ ok: true });

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Chybí povinné údaje.' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const OWNER_EMAIL   = 'xblaster.draxia@gmail.com'; // free-tier: must match Resend account email
  const FROM          = 'pavelstudio <onboarding@resend.dev>';

  // ── 1. Confirmation email to customer ────────────────────────
  const confirmationHtml = `<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  body{margin:0;padding:0;background:#f5f5f5;font-family:'Inter','Helvetica Neue',Arial,sans-serif;}
  .wrap{max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.07);}
  .header{background:#2563EB;padding:32px 40px;}
  .logo{color:#fff;font-size:20px;font-weight:700;letter-spacing:-0.03em;text-decoration:none;}
  .logo span{color:rgba(255,255,255,.7);}
  .body{padding:40px;}
  h1{font-size:22px;font-weight:700;color:#0a0a0a;margin:0 0 12px;letter-spacing:-0.02em;}
  p{font-size:15px;color:#374151;line-height:1.65;margin:0 0 16px;}
  .highlight{background:#eff6ff;border-left:3px solid #2563EB;padding:14px 18px;border-radius:0 8px 8px 0;margin:24px 0;}
  .highlight p{margin:0;color:#1e3a8a;font-size:14px;}
  .footer{padding:24px 40px;border-top:1px solid #f0f0f0;background:#fafafa;}
  .footer p{font-size:13px;color:#9ca3af;margin:0;}
  .footer a{color:#2563EB;text-decoration:none;}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <span class="logo">pavel<span>studio</span></span>
  </div>
  <div class="body">
    <h1>Díky za zprávu, ${name}!</h1>
    <p>Vaši zprávu jsem dostal a osobně si ji přečtu. Ozvu se vám <strong>do 24 hodin</strong> v pracovní dny.</p>
    <div class="highlight">
      <p>Předmět: <strong>${subject || 'Nová poptávka'}</strong><br/>
      Odesláno: ${new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
    </div>
    <p>Pokud máte mezitím jakýkoliv dotaz, napište mi přímo na <a href="mailto:${OWNER_EMAIL}" style="color:#2563EB;">${OWNER_EMAIL}</a>.</p>
    <p>Pavel</p>
  </div>
  <div class="footer">
    <p><a href="https://pavelweb.vercel.app">pavelstudio</a> &nbsp;·&nbsp; Webař na volné noze</p>
  </div>
</div>
</body>
</html>`;

  // ── 2. Notification email to owner ───────────────────────────
  const notificationHtml = `<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="utf-8"/>
<style>
  body{margin:0;padding:0;background:#f5f5f5;font-family:'Inter','Helvetica Neue',Arial,sans-serif;}
  .wrap{max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.07);}
  .header{background:#0a0a0a;padding:24px 40px;}
  .logo{color:#fff;font-size:18px;font-weight:700;letter-spacing:-0.03em;}
  .logo span{color:#2563EB;}
  .body{padding:40px;}
  h1{font-size:20px;font-weight:700;color:#0a0a0a;margin:0 0 24px;letter-spacing:-0.02em;}
  .row{display:flex;gap:8px;margin-bottom:12px;}
  .label{font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;min-width:80px;padding-top:2px;}
  .value{font-size:15px;color:#111827;}
  .message-box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-top:24px;}
  .message-box p{font-size:15px;color:#374151;line-height:1.65;margin:0;white-space:pre-wrap;}
  .footer{padding:20px 40px;border-top:1px solid #f0f0f0;}
  .footer p{font-size:12px;color:#9ca3af;margin:0;}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <span class="logo">pavel<span>studio</span></span>
  </div>
  <div class="body">
    <h1>Nová poptávka z webu</h1>
    <div class="row"><span class="label">Jméno</span><span class="value">${name}</span></div>
    <div class="row"><span class="label">E-mail</span><span class="value"><a href="mailto:${email}" style="color:#2563EB;">${email}</a></span></div>
    ${phone ? `<div class="row"><span class="label">Telefon</span><span class="value">${phone}</span></div>` : ''}
    ${subject ? `<div class="row"><span class="label">Předmět</span><span class="value">${subject}</span></div>` : ''}
    <div class="message-box"><p>${message.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p></div>
  </div>
  <div class="footer">
    <p>Odesláno ${new Date().toLocaleString('cs-CZ')} · pavelstudio</p>
  </div>
</div>
</body>
</html>`;

  const headers = { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' };

  try {
    // Only owner notification for now — customer confirmation requires a verified domain
    const notifyRes = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers,
      body: JSON.stringify({
        from: FROM, to: OWNER_EMAIL, reply_to: email,
        subject: `Nová poptávka od ${name}${subject ? ` — ${subject}` : ''}`,
        html: notificationHtml,
      }),
    });

    if (!notifyRes.ok) {
      const err = await notifyRes.json().catch(() => ({}));
      console.error('Resend notification failed:', notifyRes.status, JSON.stringify(err));
      return res.status(500).json({ error: 'Odeslání se nezdařilo.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Odeslání se nezdařilo.' });
  }
}
