import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

function ModalPortal({ isOpen, onClose, title, children }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    const previousActiveElement = document.activeElement
    document.body.style.overflow = 'hidden'

    closeButtonRef.current?.focus()

    const getFocusableElements = () => {
      if (!dialogRef.current) {
        return []
      }

      return Array.from(
        dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (element) => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden')
      )
    }

    const onEscape = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }

      if (event.key === 'Tab') {
        const focusable = getFocusableElements()

        if (focusable.length === 0) {
          event.preventDefault()
          return
        }

        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const isShiftTab = event.shiftKey

        if (!isShiftTab && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }

        if (isShiftTab && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener('keydown', onEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onEscape)

      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const portalTarget = document.getElementById('modal-root') ?? document.body

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"
        aria-label="Close modal overlay"
        onClick={onClose}
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-600 px-6 py-4">
          <h2 id={titleId} className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Close dialog"
          >
            ×
          </button>
        </header>
        <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
      </section>
    </div>,
    portalTarget
  )
}

export default ModalPortal
