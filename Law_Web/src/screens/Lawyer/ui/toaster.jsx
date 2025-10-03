import React from "react"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed z-[100] bottom-4 right-4 flex flex-col gap-2 max-w-sm">
      {toasts.map(({ id, title, description, open, variant }) => (
        open && (
          <div
            key={id}
            className={
              `rounded-md border p-4 shadow bg-white text-sm ` +
              (variant === 'destructive'
                ? 'border-red-300 bg-red-50 text-red-900'
                : 'border-gray-200 text-gray-900')
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {title && <div className="font-semibold truncate">{title}</div>}
                {description && (
                  <div className="text-xs text-gray-600 mt-1 break-words">{description}</div>
                )}
              </div>
              <button
                onClick={() => dismiss(id)}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
        )
      ))}
    </div>
  )
}
