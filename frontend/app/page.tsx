'use client'

import { Box } from '@chakra-ui/react'
import Header from './components/landing/Header'
import HeroSection from './components/landing/HeroSection'
import Features from './components/landing/Features'
import HowItWorks from './components/landing/HowItWorks'
import TargetAudience from './components/landing/TargetAudience'
import Testimonials from './components/landing/Testimonials'
import FAQ from './components/landing/FAQ'
import Footer from './components/landing/Footer'
import StatsSection from './components/landing/StatsSection'
import TrustSection from './components/landing/TrustSection'

export default function HomePage() {
  return (
    <Box bg="white" color="gray.800">
      <Header />
      <HeroSection />
      <Box as="section" id="como-funciona">
        <Features />
      </Box>
      <Box as="section" id="publico-alvo">
        <TargetAudience />
      </Box>
      <TrustSection />
      <Box as="section" id="estatisticas">
        <StatsSection />
      </Box>
      <Box as="section" id="depoimentos">
        <Testimonials />
      </Box>
      <Box as="section" id="faq">
        <FAQ />
      </Box>
      <Footer />
    </Box>
  )
}
