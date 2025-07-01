import { useSidebar } from '@/context/SidebarContext'
import { Box } from '@chakra-ui/react'

export default function AdminLayoutContainer({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar()

  return (
    <Box
      ml={{ base: 0, md: isExpanded ? '240px' : '72px' }}
      p={{ base: 4, md: 6 }}
      pt={8}
      flex="1"
      minH="100vh"
      bg="background"
    >
      {children}
    </Box>
  )
}