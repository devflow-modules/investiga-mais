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

export default function Perfil() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<JwtPayload | null>(null)

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
        setUsuario(decoded)
      }
    } catch (err) {
      console.error('Token inválido', err)
      router.replace('/login')
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white shadow rounded p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Sair
          </button>
        </div>

        {!usuario ? (
          <p className="text-gray-600">Carregando...</p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-700">
            {usuario.usuario && <li><strong>Usuário:</strong> {usuario.usuario}</li>}
            {usuario.email && <li><strong>Email:</strong> {usuario.email}</li>}
            {usuario.cpf && <li><strong>CPF:</strong> {usuario.cpf}</li>}
            <li><strong>Token expira em:</strong> {new Date(usuario.exp * 1000).toLocaleString()}</li>
          </ul>
        )}
      </div>
    </main>
  )
}
