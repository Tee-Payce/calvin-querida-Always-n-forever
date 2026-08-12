import nodemailer from "nodemailer";

interface RsvpEmailData {
  full_name: string;
  attendance: string;
  partner_name?: string | null;
  contact: string;
  dietary?: string | null;
  song?: string | null;
  submitted_at?: string;
}

export async function sendRsvpEmail(data: RsvpEmailData): Promise<void> {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_FROM,
    EMAIL_TO,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.error("[email] SMTP credentials missing. RSVP saved to database only.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587", 10),
    secure: false, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  const subject = `New RSVP from ${data.full_name} - ${data.attendance}`;
  const html = `
    <h2>New RSVP Submission</h2>
    <p><strong>Name:</strong> ${data.full_name}</p>
    <p><strong>Attendance:</strong> ${data.attendance}</p>
    <p><strong>Partner Name:</strong> ${data.partner_name || 'N/A'}</p>
    <p><strong>Contact:</strong> ${data.contact}</p>
    <p><strong>Dietary Requirements:</strong> ${data.dietary || 'None'}</p>
    <p><strong>Song Request:</strong> ${data.song || 'None'}</p>
    <p><strong>Submitted At:</strong> ${data.submitted_at || new Date().toLocaleString()}</p>
  `;

  try 
    const info = await transporter.sendMail({
    from: `"Calvin & Querida RSVP" <${SMTP_FROM || SMTP_USER}>`,
    to: EMAIL_TO || 'sizibapatrickjnr@gmail.com',
    subject,
    html,
  });
  console.log("[email] Sent successfully: %s", info.messageId);
} catch (error) {
  console.error("[email] Failed to send:", error);
  throw error;
}
}
