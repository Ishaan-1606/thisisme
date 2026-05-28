"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Linkedin, Github, Code, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "ishaan406061@gmail.com",
      href: "mailto:ishaan406061@gmail.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 98218 15190",
      href: "tel:+919821815190"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Delhi, New Delhi, India",
      href: null
    }
  ]

  const socialLinks = [
    { 
      icon: Linkedin, 
      href: "https://www.linkedin.com/in/ishaan-sharma-306b8a268/", 
      label: "LinkedIn",
      color: "hover:bg-[#0077B5]"
    },
    { 
      icon: Github, 
      href: "https://github.com/Ishaan-1606", 
      label: "GitHub",
      color: "hover:bg-[#333] dark:hover:bg-white/20"
    },
    { 
      icon: Code, 
      href: "https://leetcode.com/u/1_ishaan_6/", 
      label: "LeetCode",
      color: "hover:bg-[#FFA116]"
    }
  ]

  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Get in Touch</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">Contact Me</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {"Interested in discussing opportunities, collaborations, or just want to connect? I'd love to hear from you."}
          </p>
          <div className="w-24 h-1 bg-gold mx-auto mt-6" />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className="block bg-secondary/50 rounded-2xl p-6 border border-border hover:border-gold/50 hover:shadow-xl hover:shadow-gold/5 transition-all text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                      <item.icon className="text-gold" size={24} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-foreground font-medium group-hover:text-gold transition-colors">{item.value}</p>
                  </Link>
                ) : (
                  <div className="bg-secondary/50 rounded-2xl p-6 border border-border text-center">
                    <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="text-gold" size={24} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-foreground font-medium">{item.value}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-charcoal dark:bg-white/5 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {"Let's Build Something Amazing Together"}
              </h3>
              <p className="text-white/60 mb-8 max-w-lg mx-auto">
                Whether you have a project in mind, want to discuss career opportunities, or just want to say hello, my inbox is always open.
              </p>
              
              {/* Email CTA Button */}
              <Link
                href="mailto:ishaan406061@gmail.com?subject=Hello%20Ishaan%20-%20Let's%20Connect"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-charcoal font-semibold rounded-full hover:bg-gold-light transition-all hover:shadow-xl hover:shadow-gold/20 text-lg group"
              >
                <Mail size={20} />
                Send Me an Email
                <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-white/40 text-sm mb-4">Or connect with me on</p>
                <div className="flex justify-center gap-4">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      className={`p-4 rounded-full bg-white/10 text-white transition-all ${social.color} hover:text-white hover:scale-110`}
                      aria-label={social.label}
                    >
                      <social.icon size={24} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-24 pt-8 border-t border-border"
      >
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            Designed & Built by Ishaan Sharma
          </p>
          <p className="text-muted-foreground/50 text-xs mt-2">
            {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </motion.footer>
    </section>
  )
}
