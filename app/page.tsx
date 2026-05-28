"use client"

import { motion } from "framer-motion"
import { HeroSection } from "@/components/sections/hero-section"
import { ExperienceSection } from "@/components/sections/experience-section"
import { ProjectSection } from "@/components/sections/project-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { CredentialsSection } from "@/components/sections/credentials-section"
import { ContactSection } from "@/components/sections/contact-section"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
        <ExperienceSection />
        <ProjectSection />
        <SkillsSection />
        <CredentialsSection />
        <ContactSection />
      </motion.div>

      {/* Footer */}
      <footer className="bg-charcoal text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} Ishaan Sharma. Built with Next.js & Framer Motion.
          </p>
        </div>
      </footer>
    </main>
  )
}
