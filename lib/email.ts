// Email sending temporarily disabled.
// Re-enable once SMTP provider is configured.

interface RsvpEmailData {
 full_name: string;
 attendance: string;
 partner_name?: string | null;
 contact: string;
 dietary?: string | null;
 song?: string | null;
 submitted_at?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function sendRsvpEmail(_data: RsvpEmailData): Promise<void> {
 console.log('[email] Disabled. RSVP saved to database only.');
}
