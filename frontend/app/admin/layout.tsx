'use client'

import { Flex } from '@chakra-ui/react'
import { Toaster } from 'src/components/ui/toaster'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { usePathname } from 'next/navigation'
import AdminLayoutContainer from '@/components/admin/AdminLayoutContainer'
import { useAuth } from '@/hooks/useAuth'

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