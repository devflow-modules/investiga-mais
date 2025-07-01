'use client'

import { Flex } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardLayoutContainer from '@/components/dashboard/DashboardLayoutContainer'
import { Toaster } from '@/components/ui/toaster'
import { SidebarProvider } from '@/context/SidebarContext'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Flex minH="100vh" bg="primary">
        <Sidebar pathname={pathname} />
        <DashboardLayoutContainer>{children}</DashboardLayoutContainer>
      </Flex>

      {/* Adiciona o Toaster globalmente aqui */}
      <Toaster />
    </SidebarProvider>
  )
}
