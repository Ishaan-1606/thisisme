import type { Metadata } from 'next'
import { Inter, Playfair_Display, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair'
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
});

export const metadata: Metadata = {
  title: 'Ishaan Sharma | Data & AI Engineer',
  description: 'Portfolio of Ishaan Sharma - Data & AI Engineer specializing in RAG pipelines, full-stack development, and enterprise AI solutions. Currently at Ernst & Young GDS.',
  keywords: ['Data Engineer', 'AI Engineer', 'Full Stack Developer', 'RAG', 'Machine Learning', 'React', 'FastAPI', 'Python'],
  authors: [{ name: 'Ishaan Sharma' }],
  openGraph: {
    title: 'Ishaan Sharma | Data & AI Engineer',
    description: 'Portfolio of Ishaan Sharma - Data & AI Engineer specializing in RAG pipelines, full-stack development, and enterprise AI solutions.',
    type: 'website',
  },
  icons: {
    icon: '/images/favicon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
