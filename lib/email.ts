import { Resend } from "resend";

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
  const apiKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.EMAIL_TO || "teepayce11@gmail.com";

  if (!apiKey) {
    console.error("[email] RESEND_API_KEY missing. RSVP saved to database only.");
    return;
  }

  const resend = new Resend(apiKey);

  const subject = `New RSVP from ${data.full_name} - ${data.attendance}`;
  const html = `
    <h2>New RSVP Submission</h2>
    <p><strong>Name:</strong> ${data.full_name}</p>
    <p><strong>Attendance:</strong> ${data.attendance}</p>
    <p><strong>Partner Name:</strong> ${data.partner_name || "N/A"}</p>
    <p><strong>Contact:</strong> ${data.contact}</p>
    <p><strong>Dietary Requirements:</strong> ${data.dietary || "None"}</p>
    <p><strong>Song Request:</strong> ${data.song || "None"}</p>
    <p><strong>Submitted At:</strong> ${data.submitted_at || new Date().toLocaleString()}</p>
  `;

  const { data: result, error } = await resend.emails.send({
    from: "Calvin & Querida RSVP <onboarding@resend.dev>",
    to: emailTo,
    subject,
    html,
  });

  if (error) {
    console.error("[email] Resend failed:", error);
    throw new Error(error.message);
  }

  console.log("[email] Sent successfully via Resend:", result?.id);
}
