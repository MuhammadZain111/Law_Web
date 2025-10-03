import React from 'react'

function Header() {
  return (

     <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Lawyer</h2>
      <div className="flex items-center space-x-4">
        <span>Hello! Erick Rowan</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="User avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </div> 

  )
}

export default Header
