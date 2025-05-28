'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function RedefinirSenha() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [novaSenha, setNovaSenha] = useState('')
  const [mensagem, setMensagem] = useState('')

  const redefinir = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('http://localhost:3001/auth/resetar-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, novaSenha }),
    })

    const data = await res.json()
    setMensagem(data.mensagem || data.erro)
  }

  if (!token) return <p className="text-center p-6">Token inválido.</p>

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={redefinir} className="bg-white p-6 rounded shadow-md max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold">Redefinir Senha</h1>
        <input
          type="password"
          placeholder="Nova senha"
          className="w-full border px-4 py-2 rounded"
          value={novaSenha}
          onChange={e => setNovaSenha(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Atualizar senha
        </button>
        {mensagem && <p className="text-center text-sm text-gray-700 mt-2">{mensagem}</p>}
      </form>
    </main>
  )
}
