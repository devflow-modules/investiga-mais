'use client'

import { chakra } from '@chakra-ui/react'
import { HeroHeadingSection } from '../sections/HeroHeadingSection'
import { RisksSection } from '../sections/RisksSection'

export default function HeroSection() {
  return (
    <>
      <HeroHeadingSection />
      <RisksSection />
    </>
  )
}