const badgeVariants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "text-foreground border border-input",
    destructive: "bg-destructive text-destructive-foreground",
  }
  
  const Badge = ({ className = "", variant = "default", children, ...props }) => {
    return (
      <div
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${badgeVariants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
  
  export default Badge
  