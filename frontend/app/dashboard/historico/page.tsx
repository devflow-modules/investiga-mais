import { Suspense } from 'react'
import HistoricoClient from '../../components/dashboard/historico/HistoricoClient'

export default function HistoricoPage() {
  return (
    <Suspense fallback={null}>
      <HistoricoClient />
    </Suspense>
  )
}