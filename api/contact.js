// Vercel Serverless Function — envoi de mail via Resend
// Variable d'env requise : RESEND_API_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};

  // Validation côté serveur
  if (
    !name || name.trim().length < 2 ||
    !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !message || message.trim().length < 10
  ) {
    return res.status(400).json({ error: 'Champs invalides' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message trop long' });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Tant que ton domaine n'est pas vérifié sur Resend, garde onboarding@resend.dev
        from: 'Portfolio <onboarding@resend.dev>',
        to: ['m.canada13960@gmail.com'],
        reply_to: email,
        subject: `Nouveau message de ${name}`,
        text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('Resend error:', detail);
      return res.status(502).json({ error: 'Échec de l\'envoi' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
