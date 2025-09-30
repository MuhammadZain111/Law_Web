import React from "react";
import { useTheme } from "./theme-provider"; // Import hook from ThemeProvider

export default function LawyerSidebar() {

   const { theme, toggleTheme } = useTheme(); 
 
   return (
    <div
      className={`h-screen w-64 p-4 shadow-lg ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Lawyer Dashboard</h2>

      <ul className="space-y-3">
        <li className="hover:underline cursor-pointer">Clients</li>
        <li className="hover:underline cursor-pointer">Cases</li>
        <li className="hover:underline cursor-pointer">Messages</li>
        <li className="hover:underline cursor-pointer">Settings</li>
      </ul>

      {/* Theme Toggle Button */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="mt-6 p-2 rounded border w-full"
      >
        Switch to {theme === "dark" ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
}
