// LawyerSidebar.jsx

import React from "react";


// Simple cn helper (works like classnames)
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}


// Basic Button component
function Button({ children, onClick, className, ...props }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2 py-1 rounded text-sm font-medium cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function LawyerSidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "cases", label: "Cases", icon: "📁" },
    { id: "chat", label: "Live Chat", icon: "💬" },
    { id: "consultation", label: "Virtual Consultation", icon: "🎥" },
    { id: "payments", label: "Payments", icon: "💳" },
    { id: "records", label: "Records", icon: "📋" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div
      className={cn(
        " bg-lightbrown  text-white transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          {!collapsed && <h2 className="text-lg font-bold">Legal Practice</h2>}
          <Button
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-white/20"
          >
            {collapsed ? "→" : "←"}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left",
                  activeTab === item.id
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={() => {
            console.log("Logging out...");
          }}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left text-white/80 hover:bg-white/10 hover:text-white"
        >
          <span className="text-lg">🚪</span>
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
