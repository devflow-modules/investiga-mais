'use client'

import { Box } from '@chakra-ui/react'
import Header from './components/Main/Header'
import HeroSection from './components/Main/HeroSection'
import Features from './components/Main/Features'
import HowItWorks from './components/Main/HowItWorks'
import TargetAudience from './components/Main/TargetAudience'
import Testimonials from './components/Main/Testimonials'
import FAQ from './components/Main/FAQ'
import Footer from './components/Main/Footer'
import StatsSection from './components/Main/StatsSection'
import TrustSection from './components/Main/TrustSection'

export default function HomePage() {
  return (
    <Box bg="white" color="gray.800">
      <Header />
      <HeroSection />
      <Features />
      <HowItWorks />
      <TargetAudience />
      <TrustSection/>
      <StatsSection />
      <Testimonials />
      <FAQ />
      <Footer />
    </Box>
  )
}
