import { Link } from "react-router-dom"
import Button from "./ui/Button.jsx"
import { Scale } from "./icons/Icons.jsx"

const Header = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center">
          <Scale className="h-6 w-6 mr-2 text-primary" />
          LawSphere
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link to="/lawyers" className="text-gray-600 hover:text-gray-900 transition-colors">
            Find Lawyers
          </Link>
          <Link to="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
            Services
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
            Contact
          </Link>
        </div>
        <div className="flex space-x-3">
          <Link to="/auth/login">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Lawyer Login
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button size="sm">Lawyer Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Header
