import React, { useState } from "react";
import { Button } from "./ui/button"; // shadcn button

export default function LawyerSidebar() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

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
      className={`bg-primary text-primary-foreground transition-all duration-300 flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-primary-foreground/20">
        <div className="flex items-center justify-between">
          {!collapsed && <h2 className="text-lg font-serif font-bold">Legal Practice</h2>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
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
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === item.id
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary-foreground/20">
        <button
          onClick={() => {
            alert("Logged out!");
          }}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <span className="text-lg">🚪</span>
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
