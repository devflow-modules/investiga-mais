'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

type JwtPayload = {
  usuario?: string
  email?: string
  cpf?: string
  exp: number
}

type Consulta = {
  id: number
  nome: string
  cpf: string
  status: string
  criadoEm: string
}

export default function Dashboard() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<string | null>(null)
  const [consultas, setConsultas] = useState<Consulta[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    try {
      const decoded: JwtPayload = jwtDecode(token)

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
        router.replace('/login')
      } else {
        setUsuario(decoded.usuario || decoded.email || 'Usuário')
        fetchConsultas(token)
      }
    } catch (err) {
      console.error('Token inválido', err)
      router.replace('/login')
    }
  }, [])

  const fetchConsultas = async (token: string) => {
    try {
      const res = await fetch('http://localhost:3000/consulta', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Erro ao buscar consultas.')

      const data = await res.json()
      setConsultas(data.resultados || [])
    } catch (err) {
      console.error(err)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Painel do Usuário</h1>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Sair
          </button>
        </div>

        <p className="mb-4 text-gray-600">Olá, <strong>{usuario}</strong> 👋</p>

        <h2 className="text-xl font-semibold mb-2">Últimas Consultas</h2>
        {consultas.length === 0 ? (
          <p className="text-gray-500">Nenhuma consulta encontrada.</p>
        ) : (
          <ul className="space-y-2">
            {consultas.map((c) => (
              <li key={c.id} className="border p-3 rounded bg-gray-50">
                <p><strong>Nome:</strong> {c.nome}</p>
                <p><strong>CPF:</strong> {c.cpf}</p>
                <p><strong>Status:</strong> {c.status}</p>
                <p><strong>Data:</strong> {new Date(c.criadoEm).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}