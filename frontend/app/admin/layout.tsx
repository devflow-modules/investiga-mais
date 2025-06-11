'use client'

import { Flex, Box } from '@chakra-ui/react'
import { useAuth } from 'src/hooks/useAuth'
import { Toaster } from 'src/components/ui/toaster'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { usePathname } from 'next/navigation'
import AdminLayoutContainer from '@/components/admin/AdminLayoutContainer'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useAuth()
  const pathname = usePathname()

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar do Admin */}
      <AdminSidebar pathname={pathname}/>

      {/* Conteúdo principal */}
      <AdminLayoutContainer>
        {children}
      </AdminLayoutContainer>

      {/* Toaster global */}
      <Toaster />
    </Flex>
  )
}