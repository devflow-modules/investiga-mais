/* istanbul ignore file */

import { ChakraProvider } from '@chakra-ui/react'
import { render } from '@testing-library/react'
import { system } from '@/theme'

export function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={system}>{ui}</ChakraProvider>)
}
