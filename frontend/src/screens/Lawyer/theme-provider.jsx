import React, { createContext, useContext, useState } from "react";

// Create Theme Context
const ThemeContext = createContext();

// Custom hook for accessing theme
export function useTheme() {
  return useContext(ThemeContext);
}

// ThemeProvider Component
export function ThemeProvider({ children, defaultTheme = "light" }) {
  
  const [theme, setTheme] = useState(defaultTheme);

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}
