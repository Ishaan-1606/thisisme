"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar, ExternalLink } from "lucide-react"

// Styled company logo components
function EYLogo() {
  return (
    <div className="w-12 h-12 rounded-lg bg-[#FFE600] flex items-center justify-center shadow-md">
      <span className="text-black font-bold text-lg tracking-tight">EY</span>
    </div>
  )
}

function SamsungLogo() {
  return (
    <div className="w-12 h-12 rounded-lg bg-[#1428A0] flex items-center justify-center shadow-md">
      <span className="text-white font-bold text-[9px] tracking-wide leading-none">SAMSUNG</span>
    </div>
  )
}

// EY-specific skill graph component
function EYSkillGraph() {
  const nodes = [
    { x: 15, y: 12, label: "React", size: 40 },
    { x: 85, y: 8, label: "FastAPI", size: 38 },
    { x: 50, y: 20, label: "Azure", size: 42 },
    { x: 25, y: 40, label: "Snowflake", size: 44 },
    { x: 75, y: 35, label: "ChromaDB", size: 36 },
    { x: 10, y: 65, label: "Databricks", size: 40 },
    { x: 50, y: 50, label: "OpenAI", size: 46 },
    { x: 90, y: 55, label: "SQL", size: 34 },
    { x: 35, y: 75, label: "Python", size: 38 },
    { x: 70, y: 70, label: "Express", size: 32 },
    { x: 55, y: 85, label: "Vite", size: 30 },
    { x: 20, y: 90, label: "Flask", size: 28 },
  ]

  const connections = [
    [0, 2], [0, 3], [1, 2], [1, 4], [2, 4], [2, 6], [3, 5], [3, 6], 
    [4, 6], [4, 7], [5, 8], [6, 8], [6, 9], [7, 9], [8, 10], [9, 10], [8, 11], [5, 11]
  ]

  return (
    <div className="w-full h-full relative">
      {/* Grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="ey-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ey-grid)" />
      </svg>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map(([from, to], idx) => {
          const fromNode = nodes[from]
          const toNode = nodes[to]
          return (
            <motion.line
              key={idx}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gold/40"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.03 }}
            />
          )
        })}
      </svg>

      {/* Skill Nodes */}
      {nodes.map((node, idx) => (
        <motion.div
          key={idx}
          className="absolute flex items-center justify-center"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 + idx * 0.04 }}
        >
          <div 
            className="absolute rounded-full bg-gold/10 animate-pulse"
            style={{ width: node.size + 12, height: node.size + 12 }}
          />
          <div 
            className="relative rounded-full bg-gradient-to-br from-gold/50 to-gold/30 border border-gold/60 flex items-center justify-center shadow-lg shadow-gold/20"
            style={{ width: node.size, height: node.size }}
          >
            <span className="text-[8px] font-bold text-charcoal dark:text-white text-center leading-tight">
              {node.label}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`ey-particle-${i}`}
          className="absolute w-1.5 h-1.5 bg-gold/60 rounded-full"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2.5 + Math.random() * 1.5,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

// Samsung-specific skill graph component
function SamsungSkillGraph() {
  const nodes = [
    { x: 50, y: 10, label: "Kotlin", size: 46 },
    { x: 15, y: 25, label: "Android", size: 44 },
    { x: 85, y: 20, label: "Detekt", size: 42 },
    { x: 30, y: 50, label: "Static\nAnalysis", size: 40 },
    { x: 70, y: 45, label: "YAML", size: 34 },
    { x: 50, y: 65, label: "JVM", size: 38 },
    { x: 15, y: 75, label: "XML", size: 32 },
    { x: 85, y: 70, label: "Code\nQuality", size: 36 },
    { x: 50, y: 90, label: "Gradle", size: 30 },
  ]

  const connections = [
    [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [2, 4], [3, 5], [3, 6], 
    [4, 5], [4, 7], [5, 6], [5, 7], [5, 8], [6, 8], [7, 8]
  ]

  return (
    <div className="w-full h-full relative">
      {/* Grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="samsung-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#samsung-grid)" />
      </svg>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map(([from, to], idx) => {
          const fromNode = nodes[from]
          const toNode = nodes[to]
          return (
            <motion.line
              key={idx}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gold/40"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.03 }}
            />
          )
        })}
      </svg>

      {/* Skill Nodes */}
      {nodes.map((node, idx) => (
        <motion.div
          key={idx}
          className="absolute flex items-center justify-center"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 + idx * 0.04 }}
        >
          <div 
            className="absolute rounded-full bg-gold/10 animate-pulse"
            style={{ width: node.size + 12, height: node.size + 12 }}
          />
          <div 
            className="relative rounded-full bg-gradient-to-br from-gold/50 to-gold/30 border border-gold/60 flex items-center justify-center shadow-lg shadow-gold/20"
            style={{ width: node.size, height: node.size }}
          >
            <span className="text-[7px] font-bold text-charcoal dark:text-white text-center leading-tight whitespace-pre-line">
              {node.label}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`samsung-particle-${i}`}
          className="absolute w-1.5 h-1.5 bg-gold/60 rounded-full"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2.5 + Math.random() * 1.5,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

const experiences = [
  {
    company:"Ernst & Young Global Delivery Services",
    role: "Data & AI Intern",
    location: "Chennai",
    period: "Jan 2026 to May 2026",
    duration: "4 months",
    LogoComponent: EYLogo,
    GraphComponent: EYSkillGraph,
    graphPosition: "right" as const,
    highlights: [
      {
        title: "xIQ Platform",
        description: "Architected a dual-warehouse profitability analytics platform unifying Snowflake and Databricks behind a React 18 + Vite SPA, Express API gateway, and 12 FastAPI/Flask microservices. Delivered the product's first production deployment in 2 years."
      },
      {
        title: "X-Platform Header Routing",
        description: "Designed dynamic header routing for single-contract warehouse switching and refactored the highest-latency endpoint to async fire-and-forget, eliminating 100% of Nginx 502 errors and reducing frontend duplication by ~40%."
      },
      {
        title: "xQuery NL-to-SQL",
        description: "Developed a production-grade NL-to-SQL assistant over Azure SQL with grammar-level SQL sanitizer (14-keyword denylist, single-SELECT enforcement, 10K row cap, 30s timeout). Guaranteed zero write operations reach the database."
      },
      {
        title: "xRAG Conversational Engine",
        description: "Engineered a hybrid-retrieval engine with ChromaDB (HNSW + cosine, 1536-dim embeddings), LLM filter extraction, SHA-256 idempotent ingestion, and per-message Pipeline Inspector. Reduced manual rule authoring by ~70%."
      }
    ],
    tech: ["React 18", "FastAPI", "Azure OpenAI", "ChromaDB", "Snowflake", "Databricks"]
  },
  {
    company: "Samsung R&D Institute India",
    role: "Samsung PRISM Research Intern",
    location: "Remote",
    period: "Aug 2024 to Jun 2025",
    duration: "11 months",
    LogoComponent: SamsungLogo,
    GraphComponent: SamsungSkillGraph,
    graphPosition: "left" as const,
    certificateLink: "https://www.linkedin.com/in/ishaan-sharma-306b8a268/details/certifications/1751553407328/single-media-viewer/?profileId=ACoAAEGrkTYBWj2Z6zXpMUA_EfrrR4AxTeJhy6o",
    highlights: [
      {
        title: "Detekt Static Analysis Rules",
        description: "Developed and validated 4 custom Detekt static-analysis rules targeting object-creation anti-patterns, UI recomposition, collection traversal, and resource-release violations in Kotlin/Android codebases."
      },
      {
        title: "Automated Analysis Reports",
        description: "Generated automated YAML/XML analysis reports from benchmarked sample test suites, enabling reproducible code-quality metrics across Samsung's internal Android projects."
      }
    ],
    tech: ["Kotlin", "Android", "Detekt", "Static Analysis", "YAML/XML"]
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Career</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">Professional Experience</h2>
          <div className="w-24 h-1 bg-gold mx-auto" />
        </motion.div>

        {/* Experience Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-20"
        >
          {experiences.map((exp) => (
            <motion.div
              key={exp.company}
              variants={itemVariants}
              className="relative"
            >
              {/* Two-column layout: Graph + Card */}
              <div className={`flex flex-col lg:flex-row gap-8 items-stretch ${exp.graphPosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
                {/* Experience Card */}
                <div className="lg:w-3/5">
                  <motion.div 
                    className="h-full bg-card/90 dark:bg-jet-black/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border dark:border-gold/20 hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500 group"
                    whileHover={{ y: -5 }}
                  >
                    {/* Header Row - Logo, Role, Certificate */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-4">
                        <exp.LogoComponent />
                        <div className="flex items-center gap-2 text-gold">
                          <Briefcase size={16} />
                          <span className="text-sm font-semibold">{exp.role}</span>
                        </div>
                      </div>
                      {exp.certificateLink && (
                        <a
                          href={exp.certificateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-gold hover:text-gold-dark transition-colors font-medium"
                        >
                          Certificate <ExternalLink size={14} />
                        </a>
                      )}
                    </div>

                    {/* Company Name - directly below logo */}
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{exp.company}</h3>

                    {/* Date, Duration Badge, Location */}
                    <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm mb-6">
                      <Calendar size={14} />
                      <span>{exp.period}</span>
                      <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-semibold">{exp.duration}</span>
                      <span className="text-gold">|</span>
                      <span>{exp.location}</span>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-4">
                      {exp.highlights.map((highlight, hIndex) => (
                        <motion.div 
                          key={hIndex} 
                          className="border-l-2 border-gold/30 pl-4 hover:border-gold transition-colors"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: hIndex * 0.1 }}
                        >
                          <h4 className="font-semibold text-foreground text-sm">{highlight.title}</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">{highlight.description}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2 mt-6">
                      {exp.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs font-medium bg-charcoal dark:bg-white/10 text-white rounded-full group-hover:bg-gold group-hover:text-charcoal transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Skill Graph - separate for each company */}
                <div className="lg:w-2/5 min-h-[350px] md:min-h-[400px] relative rounded-2xl overflow-hidden border border-gold/10 bg-charcoal/30 dark:bg-jet-black/50">
                  <exp.GraphComponent />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
