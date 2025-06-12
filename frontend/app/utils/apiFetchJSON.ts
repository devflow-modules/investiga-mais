export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode: number
  message: string
  error?: string
  data?: T
}

interface ApiFetchOptions extends RequestInit {
  timeoutMs?: number
  retryCount?: number
  logEnabled?: boolean
}

export async function apiFetchJSON<T = unknown>(
  url: string,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> {
  const timeoutMs = options.timeoutMs ?? 10000
  const retryCount = options.retryCount ?? 1
  const logEnabled = options.logEnabled ?? true

  let controller = new AbortController()
  let timeoutId: NodeJS.Timeout

  const doFetch = async (attempt: number): Promise<ApiResponse<T>> => {
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

      if (statusCode === 304) {
        return {
          success: true,
          statusCode,
          message: 'Not Modified',
          data: undefined,
        }
      }

      let json: unknown = {}
      try {
        json = await res.json()
      } catch {
        json = {}
      }

      const jsonObj = (typeof json === 'object' && json !== null) ? json as Record<string, unknown> : {}

      const response: ApiResponse<T> = {
        success: jsonObj.success as boolean ?? res.ok,
        statusCode,
        message: jsonObj.message as string ?? res.statusText,
        error: jsonObj.error as string | undefined,
        data: jsonObj.data as T ?? undefined,
      }

      if (res.ok) {
        return response
      }

      if (statusCode < 500 || attempt >= retryCount) {
        return response
      }

      if (logEnabled) {
        console.warn(`[apiFetchJSON] Retry ${attempt + 1}/${retryCount} para ${url}...`)
      }
      return await doFetch(attempt + 1)

    } catch (err: unknown) {
      clearTimeout(timeoutId)

      const durationMs = Date.now() - startTime

      const errorMessage = err instanceof Error ? err.message : 'Erro de rede ao conectar com o servidor.'

      if (err instanceof DOMException && err.name === 'AbortError') {
        if (logEnabled) {
          console.error(`[apiFetchJSON] Timeout → ${url} (${durationMs} ms)`)
        }
        return {
          success: false,
          statusCode: 0,
          message: 'Timeout ao conectar com o servidor.',
          error: 'Timeout',
          data: undefined,
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
        message: errorMessage,
        error: errorMessage,
        data: undefined,
      }
    }
  }

  return doFetch(0)
}
