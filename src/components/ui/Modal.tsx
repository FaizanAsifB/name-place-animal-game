import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  children: React.ReactNode
  isOpen: boolean
  className?: string
  onClose: () => void
}

function Modal({ children, isOpen, className = '', onClose }: ModalProps) {
  const dialog = useRef<HTMLDialogElement | null>(null)
  useEffect(() => {
    const modal = dialog.current!
    if (isOpen) {
      modal.showModal()
    }
    return () => modal.close()
  }, [isOpen])

  return createPortal(
    <dialog ref={dialog} className={`modal ${className}`} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById('modal') as HTMLDivElement
  )
}
export default Modal
