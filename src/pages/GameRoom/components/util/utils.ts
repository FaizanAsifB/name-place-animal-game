export function setTimerEndTime(key: string, roundTime: number) {
  const timerEndTime = Date.now() + roundTime * 1000

  try {
    const toStorage = JSON.stringify(timerEndTime)
    window.sessionStorage.setItem(key, toStorage)
  } catch (err) {
    console.log(err)
  }
}

export function getTimerEndTime(key: string) {
  try {
    const storedData = window.sessionStorage.getItem(key)
    if (storedData) return JSON.parse(storedData)
  } catch (err) {
    console.log(err)
  }
}
