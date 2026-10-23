// Netlify Forms event: fires after a verified form submission.
// Requires RESEND_API_KEY and LAW_FROM_EMAIL in Netlify environment (Functions scope).
exports.handler = async (event) => {
  let payload;
  try { payload = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400 }; }
  const data = payload.payload?.data || payload.data || {};
  const formName = payload.payload?.form_name || payload.form_name || payload.payload?.name;
  if (formName && formName !== 'the-law-rebirth') return { statusCode: 200 };
  const pseudo = String(data.pseudo || '').trim().slice(0, 32);
  const email = String(data.email || '').trim();
  if (!pseudo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || data.consent !== 'oui') return { statusCode: 200 };
  const key = process.env.RESEND_API_KEY;
  const from = process.env.LAW_FROM_EMAIL;
  if (!key || !from) { console.error('Welcome email not configured: RESEND_API_KEY / LAW_FROM_EMAIL'); return { statusCode: 503 }; }
  const escape = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const name = escape(pseudo);
  const html = `<div style="background:#0c0909;color:#f1e5da;padding:42px 20px;font-family:Georgia,serif;text-align:center"><div style="letter-spacing:4px;font:12px Arial;color:#b79588">CONVOCATION OFFICIELLE</div><h1 style="font-size:44px;font-weight:normal;margin:24px 0">THE LAW<br><span style="font-size:24px;letter-spacing:7px">REBIRTH</span></h1><p style="font-size:20px">Bonsoir, ${name}.</p><p style="color:#d2bdb5;line-height:1.8">Votre nom a été inscrit au registre.<br>Vous avez fait le premier choix.<br>Il n'y a désormais plus de retour en arrière.</p><p style="font-size:24px;color:#d35c50;margin:32px 0">LE TEMPS EST COMPTÉ.</p><p style="letter-spacing:3px">31 OCTOBRE 2026</p><p style="color:#9b8580;font-size:12px;margin-top:42px">Vous recevrez l'annonce de l'ouverture de THE LAW: REBIRTH.</p></div>`;
  const response = await fetch('https://api.resend.com/emails', { method:'POST', headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({from, to:[email], subject:'THE LAW: REBIRTH — Le temps est compté, '+pseudo, html, text:'Bonsoir '+pseudo+'. Votre nom a été inscrit au registre. Le temps est compté. Rendez-vous le 31 octobre 2026. — THE LAW: REBIRTH'}) });
  if (!response.ok) { console.error('Resend failed', response.status, await response.text()); return {statusCode:502}; }
  return { statusCode:200 };
};