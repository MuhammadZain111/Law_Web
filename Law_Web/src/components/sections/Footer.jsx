import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            ⚖️ LawSphere
          </h2>
          <p className="mt-3 text-gray-400">
            Connecting clients with the right legal professionals.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li><a href="#" className="hover:text-yellow-400">Find Lawyers</a></li>
            <li><a href="#" className="hover:text-yellow-400">Services</a></li>
            <li><a href="#" className="hover:text-yellow-400">About Us</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold text-white">Legal</h3>
          <ul className="mt-3 space-y-2">
            <li><a href="#" className="hover:text-yellow-400">Terms of Service</a></li>
            <li><a href="#" className="hover:text-yellow-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-yellow-400">Cookie Policy</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white">Contact Us</h3>
          <p className="mt-3">📧 info@lawsphere.com</p>
          <p className="mt-1">📞 (123) 456-7890</p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-yellow-400"><Facebook /></a>
            <a href="#" className="hover:text-yellow-400"><Instagram /></a>
            <a href="#" className="hover:text-yellow-400"><Twitter /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8">
        <p className="text-center text-gray-400 py-6">
          © 2025 LawSphere. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
