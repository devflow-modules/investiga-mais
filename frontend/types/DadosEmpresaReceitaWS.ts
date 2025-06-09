export type Atividade = {
  code: string
  text: string
}

export type Socio = {
  nome: string
  qual: string
  pais_origem?: string
  nome_rep_legal?: string
  qual_rep_legal?: string
}

export type Simples = {
  optante: boolean
  data_opcao?: string
  data_exclusao?: string
  ultima_atualizacao?: string
}

export type Simei = {
  optante: boolean
  data_opcao?: string
  data_exclusao?: string
  ultima_atualizacao?: string
}

export type Billing = {
  free: boolean
  database: boolean
}

export type DadosEmpresaReceitaWS = {
  status: string
  ultima_atualizacao: string
  cnpj: string
  tipo: 'MATRIZ' | 'FILIAL'
  porte: string
  nome: string
  fantasia: string
  abertura: string
  atividade_principal: Atividade[]
  atividades_secundarias: Atividade[]
  natureza_juridica: string
  logradouro: string
  numero: string
  complemento: string
  cep: string
  bairro: string
  municipio: string
  uf: string
  email: string
  telefone: string
  efr: string
  situacao: string
  data_situacao: string
  motivo_situacao: string
  situacao_especial: string
  data_situacao_especial: string
  capital_social: string
  qsa: Socio[]
  simples: Simples
  simei: Simei
  billing: Billing
}
