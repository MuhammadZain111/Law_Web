import React, { useState, useEffect } from "react"
import { Toaster as Sonner } from "sonner"

// Small hook to detect system theme (light/dark)
function useSystemTheme() {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const updateTheme = () => setTheme(media.matches ? "dark" : "light")

    updateTheme()
    media.addEventListener("change", updateTheme)

    return () => media.removeEventListener("change", updateTheme)
  }, [])

  return theme
}

function Toaster(props) {
  const theme = useSystemTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      }}
      {...props}
    />
  )
}

export default Toaster
