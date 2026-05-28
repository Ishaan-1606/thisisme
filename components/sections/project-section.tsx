"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ExternalLink, Users, Sparkles, Brain, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const projectImages = [
  { src: "/images/project/screenshot-1.png", alt: "One More Light Onboarding" },
  { src: "/images/project/screenshot-2.png", alt: "AI Chat Interface" },
  { src: "/images/project/screenshot-3.png", alt: "Mood Analytics & 365-Day Heatmap" },
  { src: "/images/project/screenshot-4.png", alt: "AI Generated Wellbeing Plans" },
  { src: "/images/project/screenshot-5.png", alt: "Blog Creation Interface" },
  { src: "/images/project/screenshot-6.png", alt: "Onboarding Flow Glimpse" },
  { src: "/images/project/screenshot-7.png", alt: "Theme Customization" },
]

const features = [
  {
    icon: Brain,
    title: "AI-Powered Journaling",
    description: "Context-aware retrieval pipeline using vector embeddings and sentiment analysis"
  },
  {
    icon: Heart,
    title: "Wellness Tracking",
    description: "365-day activity heatmaps, mood trends, and behavioral engagement metrics"
  },
  {
    icon: Sparkles,
    title: "Personalized Recovery",
    description: "AI-generated recovery plans with sub-2s streamed first-token latency"
  },
  {
    icon: Users,
    title: "40+ Active Users",
    description: "Production platform with JWT auth, optimistic UI, and 30+ theme presets"
  }
]

// MacBook mockup component - optimized for screenshot aspect ratio
function MacBookCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const navigate = useCallback((newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prev) => {
      if (newDirection === 1) {
        return prev === projectImages.length - 1 ? 0 : prev + 1
      }
      return prev === 0 ? projectImages.length - 1 : prev - 1
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
    <div className="relative w-full max-w-4xl mx-auto px-4 md:px-16">
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

      {/* MacBook Frame - Compact height */}
      <div className="relative mx-auto">
        {/* Screen bezel - thinner */}
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-2xl pt-2 px-2 pb-1 md:pt-3 md:px-3 md:pb-2 shadow-2xl">
          {/* Camera notch */}
          <div className="absolute top-1 md:top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-700 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
          </div>
          
          {/* Screen - 16:9 aspect ratio to match screenshots better */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
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
                className="absolute inset-0"
              >
                <Image
                  src={projectImages[currentIndex].src}
                  alt={projectImages[currentIndex].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Screen reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* MacBook base - slimmer */}
        <div className="relative">
          {/* Hinge */}
          <div className="h-2 md:h-3 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-sm" />
          
          {/* Base */}
          <div className="h-2 md:h-2.5 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-xl mx-8 md:mx-16 shadow-xl" />
          
          {/* Bottom edge */}
          <div className="h-0.5 md:h-1 bg-gray-500 rounded-b-xl mx-12 md:mx-24" />
        </div>

        {/* Glow effect */}
        <div className="absolute -inset-4 bg-gold/10 rounded-3xl blur-3xl -z-10" />
      </div>

      {/* Image counter and label */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="flex gap-2">
          {projectImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1)
                setCurrentIndex(idx)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex 
                  ? "bg-gold w-6" 
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to screenshot ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      <p className="text-center text-white/60 text-sm mt-2">
        {projectImages[currentIndex].alt}
      </p>
    </div>
  )
}

export function ProjectSection() {
  return (
    <section id="project" className="py-24 bg-jet-black dark:bg-jet-black overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Flagship Project</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">One More Light</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            AI-Powered Mental Wellness Journal with 40+ active users. A full-stack platform enabling multimodal journaling, 
            semantic memory retrieval, and personalized recovery-plan generation.
          </p>
          <div className="w-24 h-1 bg-gold mx-auto mt-6" />
        </motion.div>

        {/* Project Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-12"
        >
          <Link
            href="https://one-more-light.onrender.com/"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 bg-gold text-charcoal font-semibold rounded-full hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/20"
          >
            <ExternalLink size={18} />
            Live Demo
          </Link>
        </motion.div>

        {/* MacBook Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <MacBookCarousel />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-gold/50 transition-all group hover:bg-white/10"
            >
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-4 group-hover:bg-gold/30 transition-colors">
                <feature.icon className="text-gold" size={24} />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
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
          <p className="text-white/40 text-sm mb-4">Built with</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["React 18", "TypeScript", "FastAPI", "PostgreSQL", "pgvector", "Clerk", "Framer Motion"].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-white/10 text-white/80 rounded-full text-sm border border-white/10 hover:border-gold/50 transition-colors"
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
