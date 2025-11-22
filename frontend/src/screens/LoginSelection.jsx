import { BookOpen, ChevronRight, Scale, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Welcome to Law Sphere</h1>
        </div>
        <p className="text-gray-600 mb-10">Choose how you'd like to sign in to our legal community</p>

        <div className="space-y-6">
          {/* User Login */}
          <button
            onClick={() => navigate('/user/login')}
            className="w-full text-left rounded-2xl border bg-white p-6 shadow-sm hover:shadow transition-shadow"
          >
            <div className="flex gap-4">
              <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                <User2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">User Login</h2>
                <p className="text-gray-600">Sign in to find and book qualified lawyers</p>
                <div className="mt-3 inline-flex items-center font-medium text-blue-600">
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>
          </button>

          {/* Lawyer Login */}
          <button
            onClick={() => navigate('/lawyer/login')}
            className="w-full text-left rounded-2xl border bg-white p-6 shadow-sm hover:shadow transition-shadow"
          >
            <div className="flex gap-4">
              <div className="h-14 w-14 rounded-xl bg-lightbrown/20 flex items-center justify-center">
                <Scale className="h-6 w-6 text-lightbrown" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">Lawyer Login</h2>
                <p className="text-gray-600">Sign in to manage your profile and appointments</p>
                <div className="mt-3 inline-flex items-center font-medium text-lightbrown">
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/')}
            className="mt-8 inline-flex items-center text-gray-600 hover:text-gray-800"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}


