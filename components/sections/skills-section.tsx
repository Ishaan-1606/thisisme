"use client"

import { motion } from "framer-motion"

const skillCategories = [
  {
    name: "Languages",
    skills: ["Python", "SQL", "Java", "Kotlin"]
  },
  {
    name: "AI & Data",
    skills: ["Azure OpenAI", "RAG Pipelines", "ChromaDB", "pgvector", "Pandas", "Prompt Engineering"]
  },
  {
    name: "Backend",
    skills: ["FastAPI", "Flask", "SQLAlchemy (async)", "Express.js", "Pydantic", "Uvicorn", "Alembic", "Pytest", "HTTPX"]
  },
  {
    name: "Frontend",
    skills: ["React 18", "Vite", "Tailwind CSS", "Framer Motion", "Radix UI", "Recharts"]
  },
  {
    name: "DevOps",
    skills: ["Docker", "SPCS", "Nginx", "Azure SQL", "Git"]
  }
]

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

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Expertise</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">Skills & Technologies</h2>
          <div className="w-24 h-1 bg-gold mx-auto" />
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              variants={itemVariants}
              className={`${categoryIndex === skillCategories.length - 1 && skillCategories.length % 3 !== 0 ? "lg:col-span-1" : ""}`}
            >
              <div className="bg-secondary/50 rounded-2xl p-6 h-full border border-border hover:shadow-lg transition-shadow">
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-gold" />
                  <h3 className="text-lg font-bold text-foreground">{category.name}</h3>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1.5 text-sm font-medium bg-card text-foreground rounded-lg border border-border hover:border-gold hover:text-gold transition-colors cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6"
        >
          {[
            { value: "9.08", label: "CGPA" },
            { value: "4", label: "Months at EY" },
            { value: "11", label: "Months at Samsung" },
            { value: "15+", label: "Product Modules" },
            { value: "160+", label: "Paper Downloads" }
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 md:p-6 bg-charcoal dark:bg-white/5 rounded-xl">
              <div className="text-2xl md:text-4xl font-bold text-gold mb-1">{stat.value}</div>
              <div className="text-white/60 text-xs md:text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
