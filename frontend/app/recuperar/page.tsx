'use client'
import { useState } from 'react'

export default function Recuperar() {
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('http://localhost:3001/auth/recuperar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    setMensagem(data.mensagem || data.erro)
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={enviar} className="bg-white p-6 rounded shadow-md max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold">Recuperar Senha</h1>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          className="w-full border px-4 py-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Enviar link de recuperação
        </button>
        {mensagem && <p className="text-center text-sm text-gray-700 mt-2">{mensagem}</p>}
      </form>
    </main>
  )
}
