import { NextResponse } from "next/server";
import { keepAlive } from "@/lib/db";

export const dynamic = "force-dynamic";

// Vercel cron calls this every 5 minutes to keep Supabase from pausing
export async function GET() {
  try {
    await keepAlive();
    console.log("[keepalive] pinged at", new Date().toISOString());
    return NextResponse.json({ ok: true, pinged_at: new Date().toISOString() });
  } catch (err) {
    console.error("[keepalive] failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}