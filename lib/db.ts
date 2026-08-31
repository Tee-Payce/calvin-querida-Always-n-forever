import postgres from "postgres";

let _sql: ReturnType<typeof postgres> | null = null;

function getDb() {
  if (!_sql) {
    // Strip any accidental wrapping (quotes, prefix) that may come from env var misconfiguration
    const raw = process.env.DATABASE_URL ?? "";
    const url = raw.replace(/^DATABASE_URL=/, "").replace(/^"|"$/g, "").replace(/^'|'$/g, "").trim();
    _sql = postgres(url, {
      ssl: { rejectUnauthorized: false },
      max: 1,
      prepare: false,
    });
  }
  return _sql;
}

export interface Rsvp {
  id: number;
  full_name: string;
  attendance: string;
  partner_name: string | null;
  contact: string;
  dietary: string | null;
  song: string | null;
  submitted_at: string;
}

export async function insertRsvp(data: Omit<Rsvp, "id" | "submitted_at">) {
  const sql = getDb();
  const rows = await sql<{ id: number }[]>`
    INSERT INTO rsvps (full_name, attendance, partner_name, contact, dietary, song)
    VALUES (${data.full_name}, ${data.attendance}, ${data.partner_name}, ${data.contact}, ${data.dietary}, ${data.song})
    RETURNING id
  `;
  return rows[0];
}

export async function getAllRsvps() {
  const sql = getDb();
  const rows = await sql<Rsvp[]>`SELECT * FROM rsvps ORDER BY submitted_at DESC`;
  return rows;
}


export async function keepAlive(): Promise<void> {
  const sql = getDb();
  await sqlINSERT INTO keepalive (id, pinged_at) VALUES (1, NOW()) ON CONFLICT (id) DO UPDATE SET pinged_at = NOW();
}