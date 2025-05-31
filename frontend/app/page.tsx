'use client'

import { Box } from '@chakra-ui/react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import TargetAudience from './components/TargetAudience'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import StatsSection from './components/StatsSection'

export default function HomePage() {
  return (
    <Box bg="white" color="gray.800">
      <Header />
      <HeroSection />
      <Features />
      <HowItWorks />
      <TargetAudience />
      <StatsSection />
      <Testimonials />
      <FAQ />
      <Footer />
    </Box>
  )
}
