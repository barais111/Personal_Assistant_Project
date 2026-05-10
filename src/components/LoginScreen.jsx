// import React, { useState } from 'react';
// import { User } from 'lucide-react';

// const LoginScreen = ({ onLogin }) => {
//   const [credentials, setCredentials] = useState({ username: '', password: '' });

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (credentials.username && credentials.password) {
//       onLogin(credentials.username);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
//       <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
//         <div className="text-center mb-8">
//           <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
//             <User className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-2">Personal Assistant</h1>
//           <p className="text-purple-200">Your AI-powered productivity companion</p>
//         </div>
        
//         <form onSubmit={handleLogin} className="space-y-6">
//           <input
//             type="text"
//             placeholder="Username"
//             className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70"
//             value={credentials.username}
//             onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/70"
//             value={credentials.password}
//             onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//           />
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold"
//           >
//             Sign In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginScreen;
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import logo from "../img/logo.png";

export default function LoginUI({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple test credentials
    if (username === "Anushka" && password === "1234@anushka") {
      setError("");
      onLogin(username);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 animate-gradient-x">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(0.5deg); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 15s ease infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>

      <div className={`w-full max-w-6xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex transition-all duration-1000 ${
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        
        {/* Left Illustration */}
        <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
          {/* Background matching with blur effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/80 via-emerald-50/80 to-teal-100/80 backdrop-blur-sm"></div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 animate-shimmer"></div>
          
          {/* Decorative particles */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-emerald-300 rounded-full opacity-70 animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-teal-300 rounded-full opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-5 h-5 bg-green-200 rounded-full opacity-50 animate-float" style={{ animationDelay: '4s' }}></div>
          
          <div className="relative z-10 w-full flex items-center justify-center p-12">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
              <img
                src={logo}
                alt="Login Illustration"
                className={`relative w-full max-w-md object-contain drop-shadow-2xl transition-all duration-700 ${
                  isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                } group-hover:scale-105 group-hover:-translate-y-2`}
              />
            </div>
          </div>
        </div>

        {/* Right Login Form */}
        <div className={`w-full lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center transition-all duration-700 delay-300 ${
          isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
        }`}>
          
          {/* Header with icon */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Welcome back
              </h1>
              <p className="text-gray-500">
                Login to your personal assistant
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Username */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="relative w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-400 outline-none transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-400 outline-none transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors duration-300 hover:scale-110"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className={`p-4 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm transition-all duration-500 ${
                error ? 'animate-shake' : ''
              }`}>
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="relative w-full py-4 bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold rounded-full shadow-lg hover:scale-[1.02] transition-all duration-300 hover:shadow-xl active:scale-95 group overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="relative">Login</span>
            </button>
          </form>

          {/* Footer */}
          <div className={`mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 transition-all duration-700 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <p className="text-sm text-gray-600 text-center">
              <span className="font-semibold text-emerald-600">credentials:</span>
              <br />
              <span className="font-medium">Anushka / 1234@anushka</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}