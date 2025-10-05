"use client"

import React, { useState, useRef, useEffect } from "react"

export const Popover = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child.type === PopoverTrigger) {
          return React.cloneElement(child, { isOpen, setIsOpen })
        }
        if (child.type === PopoverContent) {
          return React.cloneElement(child, { isOpen, setIsOpen })
        }
        return child
      })}
    </div>
  )
}

export const PopoverTrigger = ({ asChild = false, children, isOpen, setIsOpen, ...props }) => {
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }
  
  if (asChild) {
    return React.cloneElement(children, { 
      ...props, 
      onClick: handleClick,
      type: "button"
    })
  }
  
  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

export const PopoverContent = ({ className = "", children, isOpen, setIsOpen, ...props }) => {
  const ref = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, setIsOpen])

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className={`z-50 w-72 rounded-md border bg-white p-4 text-gray-900 shadow-lg outline-none absolute top-full left-0 mt-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
