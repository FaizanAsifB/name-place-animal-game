export function saveToSessionStorage<T>(key: string, value: T) {
  try {
    const toStorage = JSON.stringify(value)
    window.sessionStorage.setItem(key, toStorage)
  } catch (err) {
    throw Error('Session Storage not available')
  }
}

export function getFromSessionStorage<T>(key: string): T | undefined {
  try {
    const storedData = window.sessionStorage.getItem(key)
    if (!storedData) return
    return JSON.parse(storedData)
  } catch (err) {
    throw Error('Session Storage not available')
  }
}

export const getTimeInStorage = (storageKey: string) => {
  const time = getFromSessionStorage<number>(storageKey)
  if (time) return (time - Date.now()) / 1000
}
