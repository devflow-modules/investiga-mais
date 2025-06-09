'use client'

import {
  Tooltip as ChakraTooltip,
  Portal,
  type TooltipContentProps,
} from '@chakra-ui/react'
import {
  forwardRef,
  type ReactNode,
  type RefObject,
  type ReactElement,
} from 'react'

interface CustomTooltipProps {
  content: ReactNode
  contentProps?: TooltipContentProps
  showArrow?: boolean
  portalled?: boolean
  portalRef?: RefObject<HTMLElement>
  openDelay?: number
  children: ReactElement
}

export const Tooltip = forwardRef<HTMLDivElement, CustomTooltipProps>(
  function Tooltip(
    {
      content,
      contentProps,
      showArrow = true,
      portalled = true,
      portalRef,
      openDelay = 300,
      children,
    },
    ref,
  ) {
    return (
      <ChakraTooltip.Root
        openDelay={openDelay}
      >
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content ref={ref} {...contentProps}>
              {showArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip />
                </ChakraTooltip.Arrow>
              )}
              {content}
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    )
  },
)
