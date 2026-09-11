"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ExternalLink, ShieldCheck, Layers, KeyRound, TerminalSquare, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

// The slides are 1080x1350 (4:5), so the phone screen below uses that same
// aspect ratio. A true 9:19.5 handset frame would crop the monospaced text on
// each card to an unreadable centre column.
const receiptsImages = [
  { src: "/images/project/p1.png", alt: "Receipts: resume claims, verified against your actual code" },
  { src: "/images/project/p2.png", alt: "How it works: Resume in. Evidence out." },
  { src: "/images/project/p3.png", alt: "Get started: Three commands. $0." },
  { src: "/images/project/p4.png", alt: "The core loop: Index. Verify. Get grilled." },
  { src: "/images/project/p5.png", alt: "Verify: Every claim, cross-examined." },
  { src: "/images/project/p6.png", alt: "Interview prep: Get grilled before they grill you." },
  { src: "/images/project/p7.png", alt: "Rewrite & score: Honest upgrades. Honest scores." },
  { src: "/images/project/p8.png", alt: "The rest of the toolbox: Remote repos, REPL & receipts." },
]

const features = [
  {
    icon: ShieldCheck,
    title: "Grounded Verification",
    description: "Classifies every resume bullet Verified, Plausible or Unsupported, citing the exact files behind each verdict"
  },
  {
    icon: Layers,
    title: "Hybrid Retrieval",
    description: "Dense embeddings fused with a from-scratch BM25 index via reciprocal rank fusion over a local ChromaDB"
  },
  {
    icon: KeyRound,
    title: "Local-First BYOK",
    description: "Ollama, Gemini, Claude and OpenAI behind one metered interface. Secrets are redacted before indexing, and nothing leaves your machine"
  },
  {
    icon: TerminalSquare,
    title: "17,594 LOC · 533 Tests",
    description: "Published on PyPI, with a calibration gate that blocks any retrieval change raising the false-Verified rate"
  }
]

// Phone mockup carousel - mirrors the MacBook carousel used for One More Light.
function PhoneCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const navigate = useCallback((newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prev) => {
      if (newDirection === 1) {
        return prev === receiptsImages.length - 1 ? 0 : prev + 1
      }
      return prev === 0 ? receiptsImages.length - 1 : prev - 1
    })
  }, [])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 md:px-16">
      {/* Navigation Arrows */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-sm border border-gold/30 text-gold hover:bg-gold hover:text-charcoal transition-all group"
        aria-label="Previous screenshot"
      >
        <ChevronLeft size={20} className="md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={() => navigate(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-sm border border-gold/30 text-gold hover:bg-gold hover:text-charcoal transition-all group"
        aria-label="Next screenshot"
      >
        <ChevronRight size={20} className="md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Phone Frame */}
      <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px]">
        {/* Side buttons */}
        <div className="absolute -left-[3px] top-[22%] w-[3px] h-10 rounded-l bg-gray-700" />
        <div className="absolute -left-[3px] top-[36%] w-[3px] h-16 rounded-l bg-gray-700" />
        <div className="absolute -right-[3px] top-[28%] w-[3px] h-20 rounded-r bg-gray-700" />

        {/* Body / bezel */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-b from-gray-700 to-gray-900 p-[3px] shadow-2xl">
          <div className="relative rounded-[2.4rem] bg-black p-2">
            {/* Screen */}
            <div
              className="relative overflow-hidden rounded-[1.9rem] bg-gray-900"
              style={{ aspectRatio: "4/5" }}
            >
              {/* Dynamic island */}
              <div className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black">
                <div className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gray-800" />
              </div>

              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    // Swipe support, since this is a phone.
                    if (info.offset.x < -60) navigate(1)
                    else if (info.offset.x > 60) navigate(-1)
                  }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src={receiptsImages[currentIndex].src}
                    alt={receiptsImages[currentIndex].alt}
                    fill
                    className="object-cover pointer-events-none select-none"
                    sizes="(max-width: 640px) 100vw, 360px"
                    priority={currentIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Screen reflection */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
            </div>

            {/* Home indicator */}
            <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-gray-700" />
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gold/10 blur-3xl" />
      </div>

      {/* Image counter and label */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="flex gap-2">
          {receiptsImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1)
                setCurrentIndex(idx)
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? "w-6 bg-gold" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to screenshot ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-center text-sm text-white/60">
        {receiptsImages[currentIndex].alt}
      </p>
    </div>
  )
}

export function ReceiptsSection() {
  return (
    <section id="receipts" className="overflow-hidden bg-charcoal py-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-gold">
            Published Project
          </span>
          <h2 className="mb-4 mt-2 text-4xl font-bold text-white md:text-5xl">Receipts</h2>
          <p className="mx-auto max-w-2xl text-white/60">
            A codebase-grounded resume verifier and interview-prep CLI, published on PyPI. It
            checks every claim on a resume against the author&apos;s real code and returns
            Unsupported outright when retrieval finds nothing above threshold.
          </p>
          <div className="mx-auto mt-6 h-1 w-24 bg-gold" />
        </motion.div>

        {/* Project Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex justify-center gap-4"
        >
          <Link
            href="https://github.com/Ishaan-1606/receipts-cli"
            target="_blank"
            className="flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-charcoal transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
          >
            <ExternalLink size={18} />
            Link to Github repository
          </Link>
        </motion.div>

        {/* Phone Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <PhoneCarousel />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-gold/50 hover:bg-white/10"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 transition-colors group-hover:bg-gold/30">
                <feature.icon className="text-gold" size={24} />
              </div>
              <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="mb-4 text-sm text-white/40">Built with</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Python", "ChromaDB", "BM25", "tree-sitter", "Pytest", "Ollama", "PyPI"].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80 transition-colors hover:border-gold/50"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
