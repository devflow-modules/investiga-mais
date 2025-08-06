'use client'

import { AspectRatio, Box, Button } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

export function VideoInstitucional() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [somAtivado, setSomAtivado] = useState(false)

  const ativarSom = () => {
    if (!iframeRef.current) return

    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({
        event: 'command',
        func: 'unMute',
        args: [],
      }),
      '*'
    )

    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({
        event: 'command',
        func: 'setVolume',
        args: [100],
      }),
      '*'
    )

    setSomAtivado(true)
  }

  // Garante que o player esteja pronto para receber comandos
  useEffect(() => {
    const interval = setInterval(() => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening' }),
        '*'
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Box position="relative">
      <AspectRatio ratio={16 / 9} maxW="960px" width="100%" my={8}>
        <iframe
          ref={iframeRef}
          src="https://www.youtube.com/embed/BFo1ghoG11o?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=BFo1ghoG11o&enablejsapi=1"
          title="Vídeo Institucional Investiga+"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </AspectRatio>

      {!somAtivado && (
        <Button
          position="absolute"
          bottom="8"
          right="8"
          colorScheme="blue"
          size="sm"
          borderRadius="full"
          px={4}
          py={2}
          fontWeight="bold"
          onClick={ativarSom}
        >
          🔊 Ativar Som
        </Button>
      )}
    </Box>
  )
}
