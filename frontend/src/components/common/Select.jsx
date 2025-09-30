"use client"

import { createContext, useContext, useState } from "react"
import { ChevronDown } from "../../assets/icons/Icons.jsx"

const SelectContext = createContext({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
})

export const Select = ({ value, defaultValue, onValueChange, children }) => {
  const [selectValue, setSelectValue] = useState(defaultValue || "")
  const [open, setOpen] = useState(false)

  const contextValue = {
    value: value !== undefined ? value : selectValue,
    onValueChange: onValueChange || setSelectValue,
    open,
    setOpen,
  }

  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>
}

export const SelectTrigger = ({ className = "", children, ...props }) => {
  const { open, setOpen } = useContext(SelectContext)

  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

export const SelectValue = ({ placeholder, className = "", children, ...props }) => {
  const { value } = useContext(SelectContext)

  return (
    <span className={className} {...props}>
      {value ? children : placeholder}
    </span>
  )
}

export const SelectContent = ({ className = "", children, ...props }) => {
  const { open, setOpen } = useContext(SelectContext)

  if (!open) return null

  return (
    <div className="relative z-50">
      <div className="fixed inset-0" onClick={() => setOpen(false)} />
      <div
        className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 ${className}`}
        {...props}
      >
        <div className="p-1">{children}</div>
      </div>
    </div>
  )
}

export const SelectItem = ({ className = "", value, children, ...props }) => {
  const { value: selectedValue, onValueChange, setOpen } = useContext(SelectContext)
  const isSelected = selectedValue === value

  return (
    <div
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
        isSelected ? "bg-accent text-accent-foreground" : ""
      } ${className}`}
      onClick={() => {
        onValueChange(value)
        setOpen(false)
      }}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
      {children}
    </div>
  )
}
