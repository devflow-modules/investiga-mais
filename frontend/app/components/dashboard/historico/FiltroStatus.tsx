'use client'

import {
  Select,
  Portal,
} from '@chakra-ui/react'
import { statusOptions } from './createListCollection'

interface FiltroStatusProps {
  value: string
  onChange: (value: string) => void
}

function getColorByStatus(status: string) {
  switch (status) {
    case 'consultado':
      return 'green.600'
    case 'pendente':
      return 'yellow.600'
    case 'erro':
      return 'red.600'
    default:
      return 'gray.700'
  }
}

function getLabelByStatus(status: string) {
  const found = statusOptions.items.find((item) => item.value === status)
  return found ? found.label : 'Todos os Status'
}

export function FiltroStatus({ value, onChange }: FiltroStatusProps) {
  return (
    <Select.Root
      collection={statusOptions}
      value={[value]}
      onValueChange={(val) => onChange(val?.value?.[0] ?? '')}
      size="sm"
      width="100%"
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger color={getColorByStatus(value)}>
          <Select.ValueText>{getLabelByStatus(value)}</Select.ValueText>
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Portal>
        <Select.Positioner>
          <Select.Content>
            {statusOptions.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}
