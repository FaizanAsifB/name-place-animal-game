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

  // function handleBlur(e: React.MouseEvent<HTMLDialogElement, MouseEvent>) {
  //   console.log(e.target)
  //   console.log(e.currentTarget)
  //   if (e.target) return
  //   dialog.current!.close()
  // }

  return createPortal(
    <dialog
      ref={dialog}
      className={`modal ${className}`}
      onClose={onClose}
      // onClick={handleBlur}
    >
      {children}
    </dialog>,
    document.getElementById('modal') as HTMLDivElement
  )
}
export default Modal
