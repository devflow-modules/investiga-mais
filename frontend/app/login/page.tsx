'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()

  const login = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha }),
    })

    const data = await res.json()

    if (data.token) {
      document.cookie = `token=${data.token}; path=/`
      router.push('/dashboard')
    } else {
      setErro(data.erro || 'Erro ao logar')
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={login} className="bg-white p-6 rounded shadow-md max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          type="text"
          placeholder="Usuário"
          className="w-full border px-4 py-2 rounded"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full border px-4 py-2 rounded"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Entrar
        </button>
        {erro && <p className="text-center text-sm text-red-600">{erro}</p>}

        <div className="text-center mt-4">
          <a href="/recuperar" className="text-blue-500 hover:underline text-sm">
            Esqueceu a senha?
          </a>
        </div>
      </form>
    </main>
  )
}
