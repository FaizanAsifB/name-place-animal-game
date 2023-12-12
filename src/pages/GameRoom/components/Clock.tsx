import { useEffect, useRef, useState } from 'react'

const Clock = ({ activated }: { activated: boolean }) => {
  const [timeRemaining, setTimeRemaining] = useState(5000)
  const minutes = Math.floor(timeRemaining / (1000 * 60))
  const seconds = (timeRemaining / 1000) % 60

  const timer = useRef<NodeJS.Timeout | null>(null)
  const isActive = activated

  if (timeRemaining <= 0) clearInterval(timer.current as NodeJS.Timeout)

  function handleStart() {
    timer.current = setInterval(() => {
      setTimeRemaining(prev => prev - 1000)
    }, 1000)
  }

  console.log(timeRemaining)
  useEffect(() => {
    if (!isActive) return
    if (isActive) handleStart()
    return clearInterval(timer.current as NodeJS.Timeout)
  }, [isActive])
  return (
    <>
      <div>{timeRemaining}</div>
      <div>
        min:{minutes} sec:{seconds}
      </div>
    </>
  )
}
export default Clock
