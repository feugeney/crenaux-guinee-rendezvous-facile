import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, subject, text, html } = req.body;

  // Configurer le transporteur SMTP (ici exemple avec Gmail)
  // ATTENTION : Pour Gmail, il faut activer "less secure apps" ou utiliser OAuth2
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,      // ton adresse Gmail
      pass: process.env.GMAIL_PASS,      // ton mot de passe ou app password
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ message: 'Error sending email' });
  }
}
