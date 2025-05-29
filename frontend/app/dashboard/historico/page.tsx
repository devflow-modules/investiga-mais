'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Consulta {
  id: number
  nome: string
  cpf: string
  cnpj: string
  status: string
  criadoEm: string
}

export default function Historico() {
  const router = useRouter()
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [status, setStatus] = useState('')
  const [data, setData] = useState('')
  const [buscaNome, setBuscaNome] = useState('')
  const [buscaCnpj, setBuscaCnpj] = useState('')
  const [carregando, setCarregando] = useState(true)

  const [page, setPage] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const limit = 5

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    buscarConsultas(token)
  }, [page])

  const buscarConsultas = async (token: string) => {
    setCarregando(true)
    try {
      const res = await fetch(`http://localhost:3000/consulta?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()
      setConsultas(data.resultados || [])
      setTotalPaginas(Math.ceil(data.total / limit))
    } catch (err) {
      console.error('Erro ao buscar consultas', err)
    } finally {
      setCarregando(false)
    }
  }

  const atualizarFiltros = () => {
    const token = localStorage.getItem('token')
    if (token) buscarConsultas(token)
  }

  const filtrar = (c: Consulta) => {
    return (
      (!status || c.status === status) &&
      (!data || c.criadoEm.startsWith(data)) &&
      (!buscaNome || c.nome.toLowerCase().includes(buscaNome.toLowerCase())) &&
      (!buscaCnpj || c.cnpj.includes(buscaCnpj))
    )
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Histórico de Consultas</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            value={buscaNome}
            onChange={e => setBuscaNome(e.target.value)}
            placeholder="Buscar por nome"
            className="border px-4 py-2 rounded"
          />

          <input
            type="text"
            value={buscaCnpj}
            onChange={e => setBuscaCnpj(e.target.value)}
            placeholder="Buscar por CNPJ"
            className="border px-4 py-2 rounded"
          />

          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="">Todos os Status</option>
            <option value="consultado">Consultado</option>
            <option value="pendente">Pendente</option>
            <option value="erro">Erro</option>
          </select>

          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            className="border px-4 py-2 rounded"
          />

          <button
            onClick={atualizarFiltros}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Atualizar
          </button>
        </div>

        {carregando ? (
          <p>Carregando...</p>
        ) : consultas.filter(filtrar).length === 0 ? (
          <p className="text-gray-600">Nenhuma consulta encontrada com os filtros aplicados.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {consultas.filter(filtrar).map(c => (
                <li key={c.id} className="border rounded p-4 bg-gray-50">
                  <p><strong>Nome:</strong> {c.nome}</p>
                  <p><strong>CNPJ:</strong> {c.cnpj}</p>
                  <p><strong>Status:</strong> {c.status}</p>
                  <p><strong>Data:</strong> {new Date(c.criadoEm).toLocaleString()}</p>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-gray-700">
                Página {page} de {totalPaginas}
              </span>
              <button
                disabled={page === totalPaginas}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}