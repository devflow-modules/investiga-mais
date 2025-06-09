export interface ApiResponse {
  success: boolean
  statusCode: number
  message: string
  error?: string
  data?: any
}

interface ApiFetchOptions extends RequestInit {
  timeoutMs?: number
  retryCount?: number
  logEnabled?: boolean
}

export async function apiFetchJSON(
  url: string,
  options: ApiFetchOptions = {}
): Promise<ApiResponse> {
  const timeoutMs = options.timeoutMs ?? 10000 // 10 segundos padrão
  const retryCount = options.retryCount ?? 1 // 1 tentativa de retry
  const logEnabled = options.logEnabled ?? true // log por padrão habilitado

  let controller = new AbortController()
  let timeoutId: NodeJS.Timeout

  const doFetch = async (attempt: number): Promise<ApiResponse> => {
    controller = new AbortController()
    const startTime = Date.now()

    timeoutId = setTimeout(() => {
      controller.abort()
    }, timeoutMs)

    try {
      const res = await fetch(url, {
        credentials: 'include',
        ...options,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const statusCode = res.status
      const durationMs = Date.now() - startTime

      if (logEnabled) {
        console.log(
          `[apiFetchJSON] [${attempt + 1}/${retryCount}] ${options.method ?? 'GET'} ${url} → ${statusCode} (${durationMs} ms)`
        )
      }

      // Tratar 304 Not Modified
      if (statusCode === 304) {
        return {
          success: true,
          statusCode,
          message: 'Not Modified',
          data: undefined,
        }
      }

      // Tenta fazer res.json()
      let json: any = {}
      try {
        json = await res.json()
      } catch {
        json = {}
      }

      // Sucesso
      if (res.ok) {
        return {
          success: json.success ?? true,
          statusCode,
          message: json.message ?? res.statusText,
          error: json.error,
          data: json.data,
        }
      }

      // Se falha mas não é 500/network → não faz retry
      if (statusCode < 500 || attempt >= retryCount) {
        return {
          success: false,
          statusCode,
          message: json.message ?? res.statusText,
          error: json.error ?? 'Erro inesperado',
          data: json.data,
        }
      }

      // Retry para 500
      if (logEnabled) {
        console.warn(`[apiFetchJSON] Retry ${attempt + 1}/${retryCount} para ${url}...`)
      }
      return await doFetch(attempt + 1)

    } catch (err: any) {
      clearTimeout(timeoutId)

      const durationMs = Date.now() - startTime

      if (err.name === 'AbortError') {
        if (logEnabled) {
          console.error(`[apiFetchJSON] Timeout → ${url} (${durationMs} ms)`)
        }
        return {
          success: false,
          statusCode: 0,
          message: 'Timeout ao conectar com o servidor.',
          error: 'Timeout',
        }
      }

      if (attempt < retryCount) {
        if (logEnabled) {
          console.warn(`[apiFetchJSON] Network retry ${attempt + 1}/${retryCount} → ${url}`)
        }
        return await doFetch(attempt + 1)
      }

      if (logEnabled) {
        console.error(`[apiFetchJSON] Erro de rede → ${url}`, err)
      }

      return {
        success: false,
        statusCode: 0,
        message: 'Erro de rede ao conectar com o servidor.',
        error: err.message,
      }
    }
  }

  return doFetch(0)
}
