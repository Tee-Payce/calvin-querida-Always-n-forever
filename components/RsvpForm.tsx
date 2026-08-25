"use client";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  fullName:    z.string().trim().min(2, "Please share your full name").max(100),
  attendance:  z.enum(["accept", "decline"]),
  partnerName: z.string().trim().max(100).optional().or(z.literal("")),
  contact:     z.string().trim().min(5, "Email or phone required").max(150),
  dietary:     z.string().trim().max(300).optional().or(z.literal("")),
  song:        z.string().trim().max(150).optional().or(z.literal("")),
});

type FormErrors = Record<string, string>;

export function RsvpForm() {
  const [submitted,   setSubmitted]   = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [errors,      setErrors]      = useState<FormErrors>({});
  const [attendance,  setAttendance]  = useState<"accept" | "decline">("accept");
  const [withPartner, setWithPartner] = useState(false);

  // Warm up the serverless function before the user submits
  useEffect(() => {
    fetch("/api/rsvp", { method: "GET", headers: { "x-warmup": "1" } }).catch(() => {});
  }, []);



  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const payload = {
      fullName:    fd.get("fullName")    as string,
      attendance,
      partnerName: fd.get("partnerName") as string ?? "",
      contact:     fd.get("contact")     as string,
      dietary:     fd.get("dietary")     as string ?? "",
      song:        fd.get("song")        as string ?? "",
    };

    // Client-side validation first
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      const errs: FormErrors = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/rsvp", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(json.error ?? `Server error ${res.status}`);
      }

      setSubmitted(true);
      toast.success("Your RSVP has been received. Thank you!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl border border-gold/40 bg-ivory/50 px-8 py-14 text-center">
        <p className="script text-4xl text-wax">With gratitude</p>
        <div className="gold-line mx-auto my-5 w-16" />
        <p className="text-base text-foreground/80">
          Thank you for your response. Your RSVP has been received and a confirmation
          has been sent to the couple.
        </p>
      </div>
    );
  }

  const field =
    "w-full border-0 border-b border-border bg-transparent px-1 py-3 text-base focus:border-gold focus:outline-none placeholder:text-muted-foreground/60 disabled:opacity-50";
  const label =
    "block text-[0.7rem] tracking-[0.3em] uppercase text-muted-foreground mb-1";

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-8" noValidate>

      {/* Full name */}
      <div>
        <label className={label}>Full Name *</label>
        <input name="fullName" className={field} placeholder="Your name" disabled={loading} />
        {errors.fullName && (
          <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>
        )}
      </div>

      {/* Attendance toggle */}
      <div>
        <label className={label}>Attendance *</label>
        <div className="mt-2 flex gap-3">
          {(["accept", "decline"] as const).map((v) => (
            <button
              type="button"
              key={v}
              onClick={() => setAttendance(v)}
              disabled={loading}
              className={`flex-1 border px-4 py-3 text-sm tracking-[0.25em] uppercase transition disabled:opacity-50 ${
                attendance === v
                  ? "border-gold bg-gold/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-gold/60"
              }`}
            >
              {v === "accept" ? "Joyfully Accept" : "Regretfully Decline"}
            </button>
          ))}
        </div>
      </div>
      
      {/* Contact */}
      <div>
        <label className={label}>Email or Phone *</label>
        <input
          name="contact"
          className={field}
          placeholder="you@example.com or +44…"
          disabled={loading}
        />
        {errors.contact && (
          <p className="mt-1 text-xs text-destructive">{errors.contact}</p>
        )}
      </div>

      {attendance === "accept" && (
        <>
          {/* Dietary */}
          <div>
            <label className={label}>Dietary Requirements</label>
            <input
              name="dietary"
              className={field}
              placeholder="Allergies or preferences (optional)"
              disabled={loading}
            />
          </div>

          {/* Song request */}
          <div>
            <label className={label}>Song Request</label>
            <input
              name="song"
              className={field}
              placeholder="A song to make you dance (optional)"
              disabled={loading}
            />
          </div>
        </>
      )}

      {/* Submit */}
      <div className="pt-4 text-center">
        <button
          type="submit"
          disabled={loading}
          className="border border-foreground/80 bg-foreground px-10 py-4 text-xs tracking-[0.4em] uppercase text-primary-foreground transition hover:bg-transparent hover:text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Sending…" : "Send RSVP"}
        </button>
      </div>
    </form>
  );
}
