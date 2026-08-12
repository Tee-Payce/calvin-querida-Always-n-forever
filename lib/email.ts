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
  const emailTo = process.env.EMAIL_TO || "onboarding@resend.dev";

  if (!apiKey) {
    console.error("[email] RESEND_API_KEY missing. RSVP saved to database only.");
    return;
  }

  const resend = new Resend(apiKey);

  const subject = `New RSVP from ${data.full_name} - ${data.attendance}`;

  const attendanceColor = data.attendance === "decline" ? "#c0392b" : "#27ae60";
  const attendanceLabel = data.attendance === "decline" ? "❌ Declining" : "✅ Attending";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New RSVP - Calvin & Querida</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f0eb;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0eb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2c1810 0%,#8b5e3c 100%);padding:48px 40px;text-align:center;">
              <p style="margin:0 0 8px 0;color:#d4a96a;font-size:13px;letter-spacing:4px;text-transform:uppercase;font-family:Arial,sans-serif;">You have a new</p>
              <h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:normal;letter-spacing:2px;">RSVP Response</h1>
              <div style="width:60px;height:1px;background:#d4a96a;margin:16px auto;"></div>
              <p style="margin:0;color:#d4a96a;font-size:18px;font-style:italic;">Calvin &amp; Querida</p>
            </td>
          </tr>

          <!-- Attendance Badge -->
          <tr>
            <td style="padding:32px 40px 0;text-align:center;">
              <span style="display:inline-block;background-color:${attendanceColor};color:#ffffff;padding:10px 28px;border-radius:30px;font-size:15px;font-family:Arial,sans-serif;letter-spacing:1px;font-weight:bold;">
                ${attendanceLabel}
              </span>
            </td>
          </tr>

          <!-- Guest Name -->
          <tr>
            <td style="padding:24px 40px 8px;text-align:center;">
              <h2 style="margin:0;color:#2c1810;font-size:26px;font-weight:normal;">${data.full_name}</h2>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px 24px;">
              <div style="border-top:1px solid #ede0d4;margin-top:16px;"></div>
            </td>
          </tr>

          <!-- Details Grid -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                
                ${data.partner_name ? `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f5ede4;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#a08060;text-transform:uppercase;letter-spacing:1.5px;">Partner / Plus One</p>
                    <p style="margin:4px 0 0;font-size:16px;color:#2c1810;">${data.partner_name}</p>
                  </td>
                </tr>` : ""}

                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f5ede4;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#a08060;text-transform:uppercase;letter-spacing:1.5px;">Contact</p>
                    <p style="margin:4px 0 0;font-size:16px;color:#2c1810;">${data.contact}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f5ede4;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#a08060;text-transform:uppercase;letter-spacing:1.5px;">Dietary Requirements</p>
                    <p style="margin:4px 0 0;font-size:16px;color:#2c1810;">${data.dietary || "None specified"}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f5ede4;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#a08060;text-transform:uppercase;letter-spacing:1.5px;">Song Request 🎵</p>
                    <p style="margin:4px 0 0;font-size:16px;color:#2c1810;">${data.song || "None"}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:10px 0;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#a08060;text-transform:uppercase;letter-spacing:1.5px;">Submitted At</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#7a6a5a;font-family:Arial,sans-serif;">${data.submitted_at || new Date().toLocaleString()}</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#2c1810;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#d4a96a;font-size:13px;font-family:Arial,sans-serif;letter-spacing:1px;">Calvin &amp; Querida · Wedding RSVP System</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
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
