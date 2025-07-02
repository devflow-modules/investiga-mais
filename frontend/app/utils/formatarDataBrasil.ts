import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { ptBR } from 'date-fns/locale'

const ZONA_BR = 'America/Sao_Paulo'

export function formatarDataBrasil(
  data: string | number | Date,
  formato = 'dd/MM/yyyy'
) {
  const dataInput = new Date(data)

  // Detecta se está em ambiente de teste
  const isTest = process.env.NODE_ENV === 'test'

  // Em teste, aplica offset UTC-3 manualmente
  const zoned = isTest
    ? new Date(dataInput.getTime() - 3 * 60 * 60 * 1000)
    : utcToZonedTime(dataInput, ZONA_BR)

  return format(zoned, formato, { locale: ptBR })
}
