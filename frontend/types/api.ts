import type { Consulta } from './Consulta'
import type { DadosEmpresaReceitaWS } from './DadosEmpresaReceitaWS'

export type UserRole = 'cliente' | 'operador' | 'admin'

export interface ApiResponse<T = any> {
  success: boolean
  statusCode: number
  message: string
  error?: string
  data?: T
}

// /api/auth/login
export interface UsuarioResponse {
  usuario: {
    id: number
    email: string
    role: UserRole
    nome?: string
  }
}

// /api/perfil
export interface PerfilResponse {
  email: string
  cpf: string
  nome?: string
  telefone?: string
  nascimento?: string
  cidade?: string
  uf?: string
  genero?: string
  bonusConcedidoAt?: string
}

// /api/consulta
export interface ConsultaListResponse {
  resultados: Consulta[]
  total: number
  usuario?: {
    id: number
    email: string
    nome?: string
  }
}

// /api/consulta/:cnpj
export interface ConsultaCNPJResponse {
  empresa?: DadosEmpresaReceitaWS
  origem: string
}

// /api/seguranca/ip-check
export interface IpCheckResponse {
  ip: string
  fraud_score: number
  proxy: boolean
  vpn: boolean
  tor: boolean
  hosting: boolean
  connection_type: string
  abuse_velocity: string
  bot_status: boolean
  isp: string
  organization: string
  country_code: string
  country_name: string
  region: string
  city: string
  timezone: string
  latitude: number
  longitude: number
  asn: string
  active_vpn: boolean
  active_tor: boolean
  recent_abuse: boolean
  is_crawler: boolean
  is_bot: boolean
  is_relay: boolean
  is_mobile: boolean
  is_hosting_provider: boolean
  operating_system: string | null
  browser: string | null
  fonte: string
  risk_level: string
  risk_recommendation: string
}

// /api/seguranca/email-verify/:email
export interface EmailVerifyResponse {
  email: string
  autocorrect?: string
  deliverability: string
  quality_score: number
  is_valid_format?: boolean
  is_free_email?: boolean
  is_disposable_email?: boolean
  is_role_email?: boolean
  is_catchall_email?: boolean
  is_mx_found?: boolean
  is_smtp_valid?: boolean
  smtp_response?: string
  mx_record?: string
  domain?: string
  source?: string
  suggested_correction?: string
  fonte: string
}

// /api/seguranca/safe-browsing
export interface SafeBrowsingResponse {
  url: string
  threat_found: boolean
  matches: any[]
  fonte: string
}
