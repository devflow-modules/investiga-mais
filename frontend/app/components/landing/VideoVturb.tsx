'use client'

import { AspectRatio } from '@chakra-ui/react'

export function VideoVturb() {
  return (
    <AspectRatio ratio={16 / 9} maxW="960px" mx="auto" my={8}>
      <iframe
        src="https://player.vturb.com/video/SEU_ID_AQUI"
        title="Vídeo do Investiga+"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </AspectRatio>
  )
}
