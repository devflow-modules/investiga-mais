export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

export function logout() {
  localStorage.removeItem('token')
  window.location.href = '/login'
}
