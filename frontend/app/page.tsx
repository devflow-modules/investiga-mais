'use client'

import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import Header from './components/landing/Header'
import HeroSection from './components/landing/HeroSection'
import Features from './components/landing/Features'
import HowItWorks from './components/landing/HowItWorks'
import TargetAudience from './components/landing/TargetAudience'
import FAQ from './components/landing/FAQ'
import Footer from './components/landing/Footer'
import { FloatingWhatsApp } from './components/landing/FloatingWhatsApp'
import { PlanosSection } from './components/sections/PlanosSection'
import GoogleAnalytics from './components/landing/GoogleAnalytics'
import FacebookPixel from './components/landing/FacebookPixel'

export default function HomePage() {
  return (
    <Box bg="white" color="gray.800">
      {/* SEO - Structured Data */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Investiga+",
              "description": "Verificação online de CNPJs, sites e empresas para evitar golpes e fraudes.",
              "provider": {
                "@type": "Organization",
                "name": "Investiga+"
              },
              "areaServed": {
                "@type": "Country",
                "name": "Brasil"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://investigamais.com/#pacotes",
                "priceCurrency": "BRL",
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />
      </Head>

      {/* Scripts de rastreamento */}
      <GoogleAnalytics />
      <FacebookPixel />

      {/* Seções da Landing Page */}
      <Header />
      <HeroSection />
      <Box as="section" id="features">
        <Features />
      </Box>
      <Box as="section" id="como-funciona">
        <HowItWorks />
      </Box>
      <Box as="section" id="depoimentos">
        <TargetAudience />
      </Box>
      <Box as="section" id="pacotes">
        <PlanosSection />
      </Box>
      <Box as="section" id="faq">
        <FAQ />
      </Box>
      <Footer />
      <FloatingWhatsApp />
    </Box>
  )
}
