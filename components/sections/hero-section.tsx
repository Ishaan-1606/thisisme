"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowDown, Github, Linkedin, Mail, FileText, Code } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center bg-charcoal overflow-hidden"
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Gold accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
            >
              Ishaan
              <span className="block bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">Sharma</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-white/70 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Data & AI Engineer building intelligent enterprise systems. 
              Previously crafted production-grade AI solutions as intern at{" "}
              <span className="text-gold font-semibold">Ernst & Young GDS</span>.
            </motion.p>

            {/* Location & Education */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8 text-sm text-white/50"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                Delhi, New Delhi, India
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                VIT Chennai (CGPA: 9.11)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                IEEE Published Author
              </span>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4 justify-center lg:justify-start"
            >
              <Link
                href="mailto:ishaan406061@gmail.com"
                className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-gold hover:border-gold hover:text-charcoal transition-all duration-300 group"
                aria-label="Email"
              >
                <Mail size={20} className="group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/ishaan-sharma-306b8a268/"
                target="_blank"
                className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-gold hover:border-gold hover:text-charcoal transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="https://github.com/Ishaan-1606"
                target="_blank"
                className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-gold hover:border-gold hover:text-charcoal transition-all duration-300 group"
                aria-label="GitHub"
              >
                <Github size={20} className="group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="https://leetcode.com/u/1_ishaan_6/"
                target="_blank"
                className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-gold hover:border-gold hover:text-charcoal transition-all duration-300 group"
                aria-label="LeetCode"
              >
                <Code size={20} className="group-hover:scale-110 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Animated rings */}
              <motion.div 
                className="absolute -inset-4 rounded-full border-2 border-gold/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute -inset-8 rounded-full border border-gold/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute -inset-12 rounded-full border border-gold/5"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Image container */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-gold shadow-2xl shadow-gold/20">
                <Image
                  src="/images/profile.jpg"
                  alt="Ishaan Sharma"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <Link href="#experience" className="flex flex-col items-center gap-2 text-white/50 hover:text-gold transition-colors">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowDown size={20} />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  )
}
