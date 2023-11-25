const decodeJwtPayload = (token: string) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
  return JSON.parse(jsonPayload)
}

export const checkTokenExpired = (token: string) => {
  const payload = decodeJwtPayload(token)
  const expirationTime = payload.exp * 1000 + 7 * 60 * 60 * 1000
  const currentTime = Date.now()
  return currentTime > expirationTime
}

export const setLocalStorage = (key: string, value: unknown) => {
  if (!value) return
  if (typeof value === 'object') {
    window.localStorage.setItem(key, JSON.stringify(value))
  } else window.localStorage.setItem(key, value as string)
}
export const getLocalStorage = (key: string) => {
  try {
    const data = JSON.parse(window.localStorage.getItem(key) || '')
    if (data) return data
  } catch (error) {
    return window.localStorage.getItem(key)
  }
}

export const removeLocalStorage = (key: string) => {
  window.localStorage.removeItem(key)
}

export const formatVND = (price: number) => {
  return price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
}
