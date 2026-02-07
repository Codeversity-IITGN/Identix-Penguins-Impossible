import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, Building2, ShieldCheck, ArrowRight, Presentation, Video } from "lucide-react";
import "@/components/FlipCard.css";
import { motion, AnimatePresence } from "motion/react";
import DotGrid from "@/components/DotGrid";
import DecryptedText from "@/components/DecryptedText";

const SECTIONS = {
  description: "project-description",
  prototypes: "working-prototypes",
  references: "hackathon-references",
} as const;

const prototypes = [
  {
    key: "wallet",
    label: "Wallet",
    desc: "Create your decentralized identity, store and share verifiable credentials.",
    icon: Wallet,
    href: "/wallet",
  },
  {
    key: "issuer",
    label: "Issuer",
    desc: "Issue verifiable credentials to holders as a university, employer, or authority.",
    icon: Building2,
    href: "/issuer",
  },
  {
    key: "verifier",
    label: "Verifier",
    desc: "Instantly verify credentials with cryptographic proof and revocation checks.",
    icon: ShieldCheck,
    href: "/verifier",
  },
];

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    const navHeight = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

type SplashPhase = "reveal" | "transition" | "done";

const Index = () => {
  const [splashPhase, setSplashPhase] = useState<SplashPhase>("reveal");

  const handleDecryptComplete = () => {
    setSplashPhase("transition");
  };

  const handleTransitionComplete = () => {
    setSplashPhase("done");
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Splash overlay - black bg, Identix reveal (3s) then zoom in + fade away */}
      <AnimatePresence mode="wait">
        {(splashPhase === "reveal" || splashPhase === "transition") && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
            initial={false}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <motion.div
              className="text-5xl font-bold tracking-tight sm:text-6xl"
              initial={false}
              animate={
                splashPhase === "transition"
                  ? { scale: 20, opacity: 0 }
                  : { scale: 2, opacity: 1 }
              }
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
              onAnimationComplete={splashPhase === "transition" ? handleTransitionComplete : undefined}
            >
              <DecryptedText
                text="IdentiX"
                speed={143}
                sequential
                revealDirection="start"
                animateOn="mount"
                onComplete={handleDecryptComplete}
                className="text-white"
                encryptedClassName="text-primary/60"
                getCharClassName={(char, index) =>
                  index === 6 ? "text-primary" : "text-white"
                }
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - only visible after splash */}
      <AnimatePresence>
        {splashPhase === "done" && (
          <motion.div
            className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
      {/* DotGrid Background */}
      <div className="fixed inset-0 z-0">
        <DotGrid
          dotSize={7}
          gap={30}
          baseColor="#141315"
          activeColor="#f0a44c"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logoonly.png" alt="IdentiX" className="h-8 w-auto" />
            <span className="text-lg font-semibold tracking-tight">Identi<span className="text-primary">X</span></span>
          </Link>
          <div className="flex items-center gap-8">
            <button
              onClick={() => scrollTo(SECTIONS.description)}
              className="text-sm text-white/70 transition-colors hover:text-primary"
            >
              Project Description
            </button>
            <button
              onClick={() => scrollTo(SECTIONS.prototypes)}
              className="text-sm text-white/70 transition-colors hover:text-primary"
            >
              Working Prototypes
            </button>
            <button
              onClick={() => scrollTo(SECTIONS.references)}
              className="text-sm text-white/70 transition-colors hover:text-primary"
            >
              Hackathon References
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
            Decentralized Identity Platform
          </p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Secure credentials,{" "}
            <span className="text-primary">trustless</span> verification
          </h1>
          <p className="mt-8 text-lg text-white/60">
            Blockchain-backed DIDs and verifiable credentials for education and workforce.
          </p>
        </div>
      </section>

      {/* Project Description */}
      <section
        id={SECTIONS.description}
        className="relative z-10 border-t border-white/5 px-6 py-24"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-16 text-center text-2xl font-semibold tracking-tight">
            Project <span className="text-primary">Description</span>
          </h2>
          <div className="space-y-12 text-white/80">
            <p className="text-lg leading-relaxed">
              IdentiX is a blockchain-backed decentralized identity (DID) and verifiable credentials (VC) platform.
              It enables secure, privacy-preserving credential issuance, ownership, and verification for education and workforce use cases.
            </p>
            <div className="space-y-6">
              <h3 className="text-base font-medium text-white">How it works</h3>
              <ol className="space-y-4 text-sm leading-relaxed">
                <li className="flex gap-3">
                  <span className="shrink-0 text-primary">1.</span>
                  <span><strong className="text-white">Create identity</strong> — Users create a decentralized identity (DID) and receive a seed phrase. Credentials are stored off-chain in their wallet.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-primary">2.</span>
                  <span><strong className="text-white">Issue credentials</strong> — Trusted institutions (universities, employers) issue cryptographically signed verifiable credentials. Credential hashes are anchored on-chain for tamper-proof verification.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-primary">3.</span>
                  <span><strong className="text-white">Verify trustlessly</strong> — Verifiers scan a QR code, verify the signature and revocation status on-chain, and get instant confirmation—no need to contact the issuer.</span>
                </li>
              </ol>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h3 className="mb-3 text-base font-medium text-white">Blockchain security</h3>
              <p className="text-sm leading-relaxed text-white/80">
                The blockchain serves as a trust anchor: credential hashes are anchored on-chain for immutability,
                and a revocation registry enables instant revocation checks. No personal data is stored on-chain—only
                cryptographic commitments—ensuring privacy while leveraging blockchain&apos;s tamper-evident properties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Working Prototypes */}
      <section
        id={SECTIONS.prototypes}
        className="relative z-10 border-t border-white/5 px-6 py-24"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-16 text-center text-2xl font-semibold tracking-tight">
            Working <span className="text-primary">Prototypes</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-3 place-items-center">
            {prototypes.map((p) => (
              <div key={p.key} className="flip-card w-full max-w-[320px]">
                <div className="flip-card-inner">
                  <div className="flip-card-front flex flex-col items-center justify-center rounded-xl p-6">
                    <h3 className="mb-2 text-[1.6875rem] font-semibold text-primary">{p.label}</h3>
                    <p className="text-sm leading-relaxed text-white/60">{p.desc}</p>
                  </div>
                  <Link
                    to={p.href}
                    className="flip-card-back flex flex-col items-center justify-center rounded-xl cursor-pointer"
                    aria-label={`Go to ${p.label}`}
                  >
                    <p.icon className="h-16 w-16 text-primary" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathon References */}
      <section
        id={SECTIONS.references}
        className="relative z-10 border-t border-white/5 px-6 py-24"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-16 text-center text-2xl font-semibold tracking-tight">
            Hackathon <span className="text-primary">References</span>
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-transform duration-300 hover:scale-[1.05]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm text-primary">
                <Presentation className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Presentation</h3>
              <p className="mb-4 text-sm text-white/60">
                Slide deck and technical overview of IdentiX.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View presentation <ArrowRight className="h-3 w-3 rotate-[315deg]" />
              </a>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-transform duration-300 hover:scale-[1.05]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm text-primary">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Demo Video</h3>
              <p className="mb-4 text-sm text-white/60">
                End-to-end walkthrough of the credential flow.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Watch demo <ArrowRight className="h-3 w-3 rotate-[315deg]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-white/40">
          IdentiX — IITGN Codeversity Hackathon
        </div>
      </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
