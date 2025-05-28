'use client'

import { useState } from 'react'

// Validação simples de CNPJ
function validarCNPJ(cnpj: string) {
  cnpj = cnpj.replace(/[^\d]+/g, '')
  if (cnpj.length !== 14) return false

  let tamanho = cnpj.length - 2
  let numeros = cnpj.substring(0, tamanho)
  let digitos = cnpj.substring(tamanho)
  let soma = 0
  let pos = tamanho - 7
  for (let i = tamanho; i >= 1; i--) {
    soma += +numeros.charAt(tamanho - i) * pos--
    if (pos < 2) pos = 9
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado != +digitos.charAt(0)) return false

  tamanho += 1
  numeros = cnpj.substring(0, tamanho)
  soma = 0
  pos = tamanho - 7
  for (let i = tamanho; i >= 1; i--) {
    soma += +numeros.charAt(tamanho - i) * pos--
    if (pos < 2) pos = 9
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  return resultado == +digitos.charAt(1)
}

export default function ConsultaCNPJ() {
  const [cnpj, setCnpj] = useState('')
  const [resultado, setResultado] = useState<any>(null)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  const formatarCNPJ = (valor: string) => {
    valor = valor.replace(/\D/g, '')
    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2')
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2')
    valor = valor.replace(/(\d{4})(\d)/, '$1-$2')
    return valor
  }

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setMensagem('')
    setResultado(null)

    const cnpjLimpo = cnpj.replace(/[^\d]+/g, '')
    if (!validarCNPJ(cnpjLimpo)) {
      setErro('CNPJ inválido')
      return
    }

    setCarregando(true)
    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`http://localhost:3000/cnpj/${cnpjLimpo}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || 'Erro na consulta')

      setResultado(data.dados)

      await fetch('http://localhost:3000/consulta', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: data.dados.nome,
          cnpj: data.dados.cnpj,
          status: 'consultado'
        })
      })

      setMensagem('Consulta realizada e salva com sucesso.')
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded space-y-4">
        <h1 className="text-2xl font-bold">Consulta de CNPJ</h1>

        <form onSubmit={buscar} className="space-y-4">
          <input
            type="text"
            value={formatarCNPJ(cnpj)}
            onChange={e => setCnpj(e.target.value)}
            placeholder="Digite o CNPJ (somente números)"
            className="w-full border px-4 py-2 rounded"
            required
            maxLength={18}
          />
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {carregando ? 'Consultando...' : 'Buscar'}
          </button>
        </form>

        {carregando && (
          <div className="flex justify-center">
            <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        )}

        {erro && <p className="text-red-600">{erro}</p>}
        {mensagem && <p className="text-green-600">{mensagem}</p>}

        {resultado && (
          <div className="bg-gray-100 p-4 rounded mt-4 text-sm space-y-1">
            <p><strong>Nome:</strong> {resultado.nome}</p>
            <p><strong>Fantasia:</strong> {resultado.fantasia}</p>
            <p><strong>Situação:</strong> {resultado.situacao}</p>
            <p><strong>Abertura:</strong> {resultado.abertura}</p>
            <p><strong>Tipo:</strong> {resultado.tipo}</p>
          </div>
        )}
      </div>
    </main>
  )
}