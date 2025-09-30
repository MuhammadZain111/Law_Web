import React from "react"

const buttonVariants = {
  default: "bg-primary text-white hover:bg-primary/90",
  outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
  secondary: "bg-white text-gray-800 hover:bg-gray-100",
  ghost: "bg-transparent hover:bg-gray-100",
  link: "bg-transparent underline-offset-4 hover:underline",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
}

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
}

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  asChild = false,
  disabled = false,
  onClick,
  ...props
}) => {
  const Comp = asChild ? React.Fragment : "button"

  return (
    <Comp
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </Comp>
  )
}

export default Button
