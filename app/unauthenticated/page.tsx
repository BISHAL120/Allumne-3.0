"use client"
import Link from "next/link";


const Page = () => {

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="z-10 w-full max-w-4xl text-center">
        {/* Animated Logo/Icon */}
        <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
                {/* SVG Art Palette */}
                <svg className="w-full h-full text-indigo-600 drop-shadow-lg animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                {/* Floating Brush */}
                <svg className="absolute -right-4 -bottom-2 w-16 h-16 text-pink-500 animate-sway-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            </div>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-pink-600 mb-6 animate-fade-in-up">
          Smart Inventory
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
          Discover, Buy, and Sell Unique Digital & Physical Art.
          <br />
          <span className="text-indigo-500 font-medium">Your canvas for global exposure.</span>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
          <Link
            href="/sign-in"
            className="group relative px-8 py-3 w-48 bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 font-semibold">Sign In</span>
            <div className="absolute inset-0 h-full w-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
          </Link>
          
          <Link
            href="/sign-up"
            className="group px-8 py-3 w-48 bg-white text-indigo-600 border-2 border-indigo-100 rounded-full shadow-sm hover:border-indigo-600 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            <span className="font-semibold">Join Now</span>
          </Link>
        </div>

        {/* Interactive Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-800">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 mx-auto text-indigo-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Showcase</h3>
                <p className="text-gray-600 text-sm">Display your portfolio in high-resolution galleries.</p>
            </div>
             {/* Card 2 */}
             <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-1000">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4 mx-auto text-pink-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Sell</h3>
                <p className="text-gray-600 text-sm">Connect with buyers and sell securely.</p>
            </div>
             {/* Card 3 */}
             <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-1200">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto text-purple-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Community</h3>
                <p className="text-gray-600 text-sm">Join a vibrant community of creators.</p>
            </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes sway-slow {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          50% { transform: rotate(10deg) translateX(5px); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-sway-slow { animation: sway-slow 4s ease-in-out infinite; }
        .animate-blob { animation: blob 7s infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1.0s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default Page;
