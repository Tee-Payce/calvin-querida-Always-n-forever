"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Envelope } from "@/components/Envelope";
import { Countdown } from "@/components/Countdown";
import { RsvpForm } from "@/components/RsvpForm";
import { MusicPlayer } from "@/components/MusicPlayer";
import { MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster } from "@/components/ui/sonner";
import FloatingCupid from "@/components/FloatingCupid";

function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mb-12 text-center">
      {eyebrow && (
        <p className="mb-3 text-[0.9rem] tracking-[0.5em] uppercase text-gold">{eyebrow}</p>
      )}
      <h2 className="font-display text-4xl md:text-5xl italic text-foreground">{title}</h2>
      <div className="gold-line mx-auto mt-6 w-24" />
    </div>
  );
}

export function HomePage() {
  const [phase, setPhase] = useState<"loading" | "envelope" | "site">("loading");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.play(); } else { audio.pause(); }
  }, [playing]);

  return (
    <>
      <FloatingCupid />
      <Toaster position="top-center" />

      <audio ref={audioRef} src="/background_music2.mp3" loop />

      <button
        onClick={() => setPlaying(p => !p)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gold bg-background/80 backdrop-blur-sm shadow-lg transition-all hover:bg-gold hover:text-ivory"
        aria-label={playing ? "Pause music" : "Play music"}
        style={{ color: "var(--gold)" }}
      >
        {playing ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="4" width="4" height="16" rx="1" />
            <rect x="15" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4l14 8-14 8V4z" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {phase === "loading" && (
          <LoadingScreen onComplete={() => setPhase("envelope")} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "envelope" && (
          <Envelope onOpen={() => setPhase("site")} />
        )}
      </AnimatePresence>

      {phase === "site" && (
        <>
          <MusicPlayer autoPlay />
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="min-h-screen bg-background text-foreground"
          >
            {/* HERO */}
            <section className="relative min-h-screen w-full">
              <div className="absolute inset-0">
                <video
                  src="/HOME.mp4"
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>

              <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-end px-6 pb-40 pt-50 text-center text-foreground">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 1.2 }}
                  className="mt-1 italic text-xl md:text-xl"
                  style={{ lineHeight: 1, color: "#3B3A2E" }}
                >
                  Calvin Madzivanyika <span style={{ color: "#5B6142" }}>&</span> Querida Kuzamba
                </motion.h1>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="gold-line my-4 w-40"
                />

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 1 }}
                  className="max-w-2xl font-serif text-sm md:text-sm font-bold italic"
                  style={{ color: "#4A4A3A", marginTop: 2 }}
                >
                  Our Love Story
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 1 }}
                  className="mt-2 max-w-2xl space-y-4 font-serif text-base md:text-sm leading-relaxed font-bold"
                  style={{ color: "#4A4A3A" }}
                >
                  <p>
                    Many years ago, our paths first crossed, and though our journey paused, God was still writing our story.
                    In His perfect timing, He brought us back together as we sought him and prayed for the person we would spend
                    our lives.
                  </p>
                  <p>With grateful hearts, we invite you to celebrate the beginning of our forever.</p>
                </motion.div>

                <p className="mt-1 font-bold text-[0.7rem] tracking-[0.4em] uppercase" style={{ color: "#7A7A6A" }}>
                  Ecclesiastes 3:11
                </p>
              </div>
            </section>

            {/* SCHEDULE */}
            <section className="mx-auto max-w-4xl px-6 py-8">
              <div className="mt-8 w-full align-center text-center mb-5">
                <p className="mb-6 text-[0.7rem] tracking-[0.5em] uppercase text-gold-hard">
                  Counting the days
                </p>
                <p className="text-[0.7rem] tracking-[0.5em] uppercase text-gold-hard">to</p> 
                <p className="font-display text-3xl italic text-foreground">
                6 February 2027</p>
              </div>
              <div className="flex justify-center">
                <Countdown />
              </div>
              <div className="mt-5 flex justify-center">
                <img src="/string-lights.png" alt="Floral decoration" className="w-full object-contain mb-10" />
              </div>

              <SectionHeading eyebrow="6 · February · 2027" title="Schedule of the Day" />

              <div className="relative mx-auto max-w-sm">
                {[
                  { time: "11:00", label: "Ceremony",          desc: "The most special moment of the day" },
                  { time: "13:00", label: "Canapés & Drinks",  desc: "Welcome mocktails" },
                  { time: "14:30", label: "Wedding Reception", desc: "Al fresco dining and celebration" },
                ].map((s, i, arr) => (
                  <div key={s.label} className="flex flex-col items-center text-center">
                    <p className="text-[0.65rem] tracking-[0.4em] uppercase mb-1" style={{ color: "var(--gold)" }}>
                      {s.time}
                    </p>
                    <p className="font-display text-2xl italic mb-1" style={{ color: "var(--foreground)" }}>
                      {s.label}
                    </p>
                    <p className="text-sm text-muted-foreground max-w-[18rem]">{s.desc}</p>
                    {i < arr.length - 1 && (
                      <div className="flex flex-col items-center my-2">
                        <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, var(--gold), color-mix(in oklab, var(--gold) 30%, transparent))" }} />
                        <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, color-mix(in oklab, var(--gold) 30%, transparent), var(--gold))" }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-center">
                <img src="/flowers.png" alt="Floral decoration" className="w-full max-w-md object-contain" />
              </div>
            </section>

            {/* LOCATION */}
            <section className="mx-auto align-center text-center max-w-4xl px-6">
              <SectionHeading eyebrow="The Venue" title="Where We Gather" />
              <div className="relative mx-auto flex aspect-[4/5] w-full max-w-md items-center justify-center sm:max-w-lg">
                <img
                  src="/Ornate venue badge.png"
                  alt="Ornate venue badge"
                  className="absolute inset-0 h-full w-full object-contain"
                />
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-top px-2 pt-30 text-center">
                  <p className="text-[0.65rem] tracking-[0.5em] uppercase text-gold">Location</p>
                  <div className="gold-line mx-auto my-4 w-16" />
                  <p className="italic text-xl md:text-xl text-wax leading-tight">Pabani Venue</p>
                  <p className="mt-1 font-serif text-base md:text-lg italic text-foreground/75">
                    25 Highland Glen Road, Helensvale
                  </p>
                  <p className="mt-1 font-serif text-base md:text-lg italic text-foreground/75">
                    Harare, Zimbabwe
                  </p>
                </div>
              </div>
              <a
                href="https://www.bing.com/ck/a?!&&p=2968c502f1d7e33b265806da5687e8cf3e81047fe5dd512b8b8c06c6cbb31026JmltdHM9MTc4NDQxOTIwMA&ptn=3&ver=2&hsh=4&fclid=2b0fa93d-d477-6894-05db-beabd0776a88&u=a1L21hcHM_Jm1lcGk9MH5-RW1iZWRkZWR-QWRkcmVzc19MaW5rJnR5PTE4JnE9UGFiYW5pJTIwVmVudWUmc3M9eXBpZC5ZTkM3NTkzODc5OENGQjkyMDEmcHBvaXM9LTE3LjczMDQyMTA2NjI4NDE4XzMxLjE3NTU4ODYwNzc4ODA4Nl9QYWJhbmklMjBWZW51ZV9ZTkM3NTkzODc5OENGQjkyMDF-JmNwPS0xNy43MzA0MjF-MzEuMTc1NTg5JnY9MiZzVj0xJkZPUk09TVBTUlBM"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 mx-auto inline-flex items-center gap-2 border border-gold bg-background/60 px-5 py-2.5 text-[0.65rem] tracking-[0.35em] uppercase text-foreground transition-colors hover:bg-gold hover:text-ivory"
              >
                <MapPin className="h-3.5 w-3.5" />
                Open in Maps
              </a>
            </section>

            {/* DRESS CODE */}
            <section className="py-8">
              <div className="mx-auto max-w-4xl px-6">
                <SectionHeading eyebrow="Attire" title="Formal Elegance" />
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                  <div className="border-l border-gold pl-6">
                    <p className="italic text-3xl text-wax">Ladies</p>
                    <p className="mt-3 font-serif text-lg text-foreground/85">
                      Elegant floor-length gowns or sophisticated cocktail dresses.
                    </p>
                  </div>
                  <div className="border-l border-gold pl-6">
                    <p className="italic text-3xl text-wax">Gentlemen</p>
                    <p className="mt-3 font-serif text-lg text-foreground/85">
                      A tuxedo or formal suit paired with a tie or bow tie.
                    </p>
                  </div>
                </div>
                <div className="mt-12 flex justify-center">
                  <div className="relative w-full max-w-lg">
                    <div className="absolute inset-x-4 bottom-0 rounded-3xl bg-white" style={{ top: "50%" }} />
                    <img src="/dress-code.png" alt="Dress code illustration" className="relative w-full object-contain" />
                  </div>
                </div>
              </div>
            </section>

            {/* PHOTOGRAPHS */}
            <section className="mx-auto max-w-4xl px-6 py-8 text-center">
              <SectionHeading eyebrow="Memories" title="Our Forever Begins Now" />
              <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-6">
                {["/cc01.JPG", "/cc02.jpg", "/cc03.jpg", "/cc05.jpg", "/cc04.jpg", "/couple.png"].map((src, i) => (
                  <div
                    key={i}
                    className={[i === 3 ? "md:col-start-1" : "", i === 4 ? "md:col-start-2" : ""].join(" ").trim()}
                    style={{
                      padding: "10px",
                      background: "linear-gradient(135deg, #c9a84c 0%, #f5e6a3 40%, #c9a84c 60%, #8b6914 100%)",
                      boxShadow: "0 4px 24px rgba(180,140,40,0.2), inset 0 0 0 2px rgba(255,235,150,0.3)",
                    }}
                  >
                    <div style={{ border: "1px solid rgba(201,168,76,0.5)", padding: "3px" }}>
                      <img
                        src={src}
                        alt={"Calvin and Querida " + (i + 1)}
                        className="w-full h-64 object-cover object-top"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* RSVP */}
            <section className="py-12">
              {/* <div className="mx-auto max-w-3xl px-6">
                <SectionHeading eyebrow="Kindly Respond" title="RSVP" />
                <p className="mb-4 text-center font-serif text-lg text-foreground/80">
                  Please confirm your attendance by{" "}
                  <span className="text-gold">30th October</span>.
                </p>
                <p className="mb-4 text-center text-sm italic text-muted-foreground">
                  Each invitation includes named guests. Where a plus-one is included, this will be
                  indicated on your invitation.
                </p>
                <p className="mb-4 text-center text-xsm italic text-muted-foreground">
                  if you are unable to attend, we would still love to hear from you. Please let us know by filling out the RSVP form, this will help us with our planning as we have limited capacity at the venue. We appreciate your understanding and support.
               <strong>Please be aware the wedding is strictly by invitation</strong>
                </p>
                <RsvpForm />
              </div> */}
              <div className="mx-auto max-w-3xl px-6">
                <SectionHeading eyebrow="Kindly Respond" title="RSVP" />
                <p className="mb-4 text-center font-serif text-lg text-foreground/80">
               RSVPs are now closed as we have passed the deadline to confirm guests in attendance with our venue. we wish we could celebrate with everyone! Your love and well wishes mean the world to us.
                </p>
              </div>

            </section>

            {/* GIFTS */}
            <section className="mx-auto max-w-3xl px-6 py-12 text-center">
              <div className="flex justify-center">
                <img src="/envelope5.png" alt="Gift Assets" className="w-full max-w-md object-contain" />
              </div>
              <SectionHeading eyebrow="With Gratitude" title="Gifts" />
              <p className="font-serif text-lg italic text-foreground/80">
                Should you wish to honour us with a gift, we are truly grateful for any gesture of
                love and kindness. For those who wishing to do so, gift details are provided below.
              </p>
              <Accordion type="single" collapsible className="mt-8 w-full max-w-sm mx-auto text-left">
                <AccordionItem value="bank-details" className="border-border">
                  <AccordionTrigger className="font-serif text-lg italic hover:text-gold hover:no-underline">
                    Bank Details
                  </AccordionTrigger>
                  <AccordionContent className="font-serif bg-white rounded-lg text-base text-foreground/80 space-y-1">
                    <p><span className="text-gold ml-2">Bank Name:</span> Revolut</p>
                    <p><span className="text-gold ml-2">Sort Code:</span> 23-01-20</p>
                    <p><span className="text-gold ml-2">Account:</span> 53661849</p>
                    <p><span className="text-gold ml-2">Owner:</span> Querida Kuzamba</p>
                  </AccordionContent>
                  <AccordionContent className="font-serif mt-5 bg-white rounded-lg text-base text-foreground/80 space-y-1">
                    <p><span className="text-gold ml-2">Bank Name:</span> First Capital Bank</p>
                  
                    <p><span className="text-gold ml-2">Account:</span> 199013375530</p>
                    <p><span className="text-gold ml-2">Owner:</span> Calvin Madzivanyika</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible className="mt-8 w-full max-w-sm mx-auto text-left">
                <AccordionItem value="bank-details" className="border-border">
                  <AccordionTrigger className="font-serif text-lg italic hover:text-gold hover:no-underline">
                    Ecocash Details
                  </AccordionTrigger>
                  <AccordionContent className="font-serif bg-white rounded-lg text-base text-foreground/80 space-y-1">
                    <p><span className="text-gold ml-2">Account Name:</span> Calvin Madzivanyika</p>
                    <p><span className="text-gold ml-2">Ecocash Number:</span> 078 374 6903</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible className="mt-8 w-full max-w-sm mx-auto text-left">
                <AccordionItem value="bank-details" className="border-border">
                  <AccordionTrigger className="font-serif text-lg italic hover:text-gold hover:no-underline">
                    PayPal Details
                  </AccordionTrigger>
                  <AccordionContent className="font-serif bg-white rounded-lg text-base text-foreground/80 space-y-1">
                    <p><span className="text-gold ml-2">Account Name:</span> Querida Kuzamba</p>
                    <p><span className="text-gold ml-2">Paypal Link:</span><span><a href="https://www.paypal.me/quekuz" className="italic" > Click here to send a gift</a></span></p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* MESSAGE */}
            <section className="py-8">
              <div className="mx-auto max-w-3xl px-6 text-center">
                <p className="italic text-3xl text-wax">Our Message to You</p>
                <div className="gold-line mx-auto my-4 w-16" />
                <p className="font-serif italic text-foreground/80">
                  Your love, support, and presence mean the world to us, and we can&apos;t wait to celebrate our special day with you!
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section className="mx-auto max-w-3xl px-6 py-24">
              <SectionHeading eyebrow="Good to Know" title="Frequently Asked" />
              <Accordion type="single" collapsible className="w-full">
                {[
                  { q: "What time should I arrive?", a: "Guests are kindly requested to arrive at least 30 minutes before the ceremony to allow for seating." },
                  { q: "Can I bring a plus-one?", a: "Plus-one guests are only included where indicated on your invitation." },
                  { q: "Are children invited?", a: "As much as we love little ones, we will not be including them in the ceremony or reception due to limited numbers." },
                  { q: "Is there a dress code?", a: "Yes, we kindly request Formal Elegance attire." },
                  { q: "What should I do if I have dietary requirements?", a: "Please include any dietary requirements or allergies in your RSVP form." },
                  { q: "How do I RSVP?", a: "Please complete the RSVP form on this website by the stated deadline." },
                  { q: "Will parking be available?", a: "Yes — there is plenty of parking at the venue." },
                  { q: "Who can I contact for questions?", a: "Querida on +44 7496 296 808 or Calvin on +263 0783 746 903. Sharon on +44 750 751 7649 and Natalie on +263 77 271 9986" },
                ].map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-border">
                    <AccordionTrigger className="text-left font-serif text-lg italic hover:text-gold hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="font-serif text-base text-foreground/80">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-border bg-foreground py-16 text-center text-primary-foreground">
              <p className="italic text-5xl text-gold-soft">Calvin & Querida</p>
              <div className="gold-line mx-auto my-5 w-24" />
              <p className="text-xs tracking-[0.5em] uppercase px-8 text-primary-foreground/70">
                Six · February · Two Thousand & Twenty-Seven
              </p>
            </footer>
          </motion.main>
        </>
      )}
    </>
  );
}
