'use client'

import { Flex } from '@chakra-ui/react'
import { SidebarProvider } from '../../src/context/SidebarContext'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../src/hooks/useAuth'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardLayoutContainer from '@/components/dashboard/DashboardLayoutContainer'

export default function Layout({ children }: { children: React.ReactNode }) {
  useAuth()
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Flex minH="100vh" bg="primary">
        <Sidebar pathname={pathname} />
        <DashboardLayoutContainer>{children}</DashboardLayoutContainer>
      </Flex>
    </SidebarProvider>
  )
}
