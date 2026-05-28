"use client"

import { motion } from "framer-motion"
import { Award, GraduationCap, FileText, Download, ExternalLink } from "lucide-react"
import Link from "next/link"

// Company logo components for certifications
function GitHubLogo() {
  return (
    <div className="w-10 h-10 rounded-lg bg-[#24292F] flex items-center justify-center">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    </div>
  )
}

function GoogleLogo() {
  return (
    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    </div>
  )
}

function CourseraLogo() {
  return (
    <div className="w-10 h-10 rounded-lg bg-[#0056D2] flex items-center justify-center">
      <span className="text-white font-bold text-xs">C</span>
    </div>
  )
}

function IBMLogo() {
  return (
    <div className="w-10 h-10 rounded-lg bg-[#054ADA] flex items-center justify-center">
      <span className="text-white font-bold text-xs tracking-tight">IBM</span>
    </div>
  )
}

const certifications = [
  {
    title: "GitHub Copilot Certification (GH-300)",
    issuer: "Microsoft & GitHub",
    date: "Feb 2026",
    LogoComponent: GitHubLogo
  },
  {
    title: "Google Advanced Data Analytics Professional Certificate",
    issuer: "Coursera",
    date: "Mar 2026",
    LogoComponent: GoogleLogo
  },
  {
    title: "AI Agents and Agentic AI Architecture in Python",
    issuer: "Vanderbilt University / Coursera",
    date: "Mar 2026",
    LogoComponent: CourseraLogo
  },
  {
    title: "Generative AI: Prompt Engineering Basics",
    issuer: "IBM / Coursera",
    date: "Mar 2026",
    LogoComponent: IBMLogo
  }
]

const education = [
  {
    institution: "Vellore Institute of Technology, Chennai",
    degree: "B.Tech, Computer Science Engineering",
    score: "CGPA: 9.08",
    period: "Sep 2022 to Jun 2026"
  },
  {
    institution: "Sanskriti School, New Delhi",
    degree: "CBSE Class XII",
    score: "88.8%",
    period: "Apr 2021 to Jun 2022"
  },
  {
    institution: "Sanskriti School, New Delhi",
    degree: "CBSE Class X",
    score: "95.0%",
    period: "Mar 2019 to Jun 2020"
  }
]

const publication = {
  title: "Performance Analysis of Multi-Core Architectures",
  venue: "IEEE Xplore",
  date: "Dec 2023",
  description: "Benchmarked Android/iOS CPU & GPU performance using Geekbench, OpenCL, and Vulkan. Reported thermal throttling, battery trade-offs, and multi-core scaling across chipsets.",
  stats: { downloads: "160+", citations: "1" },
  paperLink: "https://ieeexplore.ieee.org/document/10480784",
  certificateLink: "https://www.linkedin.com/in/ishaan-sharma-306b8a268/details/certifications/1723869124897/single-media-viewer/?profileId=ACoAAEGrkTYBWj2Z6zXpMUA_EfrrR4AxTeJhy6o"
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function CredentialsSection() {
  return (
    <section id="credentials" className="py-24 bg-secondary/30 dark:bg-charcoal-light/20 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201, 162, 39, 0.1) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Achievements</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">Credentials</h2>
          <div className="w-24 h-1 bg-gold mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Certifications */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <Award className="text-gold" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Certifications</h3>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {certifications.map((cert) => (
                <motion.div
                  key={cert.title}
                  variants={itemVariants}
                  className="bg-card rounded-xl p-5 border border-border hover:border-gold/50 hover:shadow-lg hover:shadow-gold/5 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <cert.LogoComponent />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1 group-hover:text-gold transition-colors">{cert.title}</h4>
                      <p className="text-muted-foreground text-sm">{cert.issuer}</p>
                    </div>
                    <span className="text-gold text-sm font-medium whitespace-nowrap">{cert.date}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Education */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <GraduationCap className="text-gold" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Education</h3>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {education.map((edu) => (
                <motion.div
                  key={edu.institution + edu.degree}
                  variants={itemVariants}
                  className="bg-card rounded-xl p-5 border border-border hover:border-gold/50 hover:shadow-lg hover:shadow-gold/5 transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{edu.institution}</h4>
                      <p className="text-muted-foreground text-sm">{edu.degree}</p>
                      <p className="text-gold font-semibold text-sm mt-1">{edu.score}</p>
                    </div>
                    <span className="text-muted-foreground text-sm whitespace-nowrap">{edu.period}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Publication */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <FileText className="text-gold" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Publication</h3>
          </div>

          <motion.div 
            className="bg-charcoal rounded-2xl p-8 text-white relative overflow-hidden group"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* IEEE Logo */}
            <div className="absolute top-6 right-6 opacity-30 group-hover:opacity-50 transition-opacity">
              <div className="px-3 py-1 rounded bg-gold/20">
                <span className="text-gold font-bold text-xl tracking-wide">IEEE</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-gold text-sm font-medium mb-2">
                  <span className="px-2 py-1 rounded bg-gold/20 text-gold text-xs font-semibold">IEEE Xplore</span>
                  <span className="text-white/40">|</span>
                  <span className="text-white/60">{publication.date}</span>
                </div>
                <h4 className="text-xl md:text-2xl font-bold mb-3">{publication.title}</h4>
                <p className="text-white/70 leading-relaxed">{publication.description}</p>

                {/* Stats */}
                <div className="flex gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <Download size={16} className="text-gold" />
                    <span className="text-sm"><span className="font-semibold text-gold">{publication.stats.downloads}</span> downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gold" />
                    <span className="text-sm"><span className="font-semibold text-gold">{publication.stats.citations}</span> citation</span>
                  </div>
                </div>
              </div>

              {/* Links - NO BORDERS */}
              <div className="flex md:flex-col gap-3">
                <Link
                  href={publication.paperLink}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-gold text-charcoal font-medium rounded-lg hover:bg-gold-light transition-all hover:shadow-lg text-sm"
                >
                  <ExternalLink size={16} />
                  View Paper
                </Link>
                <Link
                  href={publication.certificateLink}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors text-sm"
                >
                  <Award size={16} />
                  Certificate
                </Link>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gold/20 rounded-full blur-3xl" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
