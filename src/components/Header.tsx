import { Atom, BookOpen, GraduationCap, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-primary/10 shadow-[0_2px_15px_rgba(var(--primary-rgb),0.2)]">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-3 transition-all duration-300 hover:scale-105 group">
          <div className="relative flex items-center justify-center">
            <Atom className="h-8 w-8 md:h-9 md:w-9 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl scale-110 opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent uppercase tracking-wider">
            Dilatação Térmica
          </h1>
        </Link>
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white rounded-lg hover:bg-cyan-500/10"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        )}
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex gap-6 items-center">
            <Link 
              to="/linear"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-cyan-500/10 ${
                location.pathname === '/linear' 
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                  : 'text-gray-300 hover:text-cyan-400'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Dilatação Linear</span>
            </Link>
            <Link 
              to="/surface"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-purple-500/10 ${
                location.pathname === '/surface' 
                  ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                  : 'text-gray-300 hover:text-purple-400'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Dilatação Superficial</span>
            </Link>
            <Link 
              to="/questions"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-yellow-500/10 ${
                location.pathname === '/questions' 
                  ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]' 
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            >
              <GraduationCap className="h-5 w-5" />
              <span>Exercícios</span>
              {location.pathname === '/questions' && (
                <span className="flex h-1.5 w-1.5 relative ml-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-500"></span>
                </span>
              )}
            </Link>
          </nav>
        )}
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="bg-black/80 backdrop-blur-md border-b border-primary/10 shadow-[0_5px_15px_rgba(var(--primary-rgb),0.2)]">
          <nav className="flex flex-col py-3 px-4">
            <Link 
              to="/linear"
              className={`flex items-center gap-2 px-3 py-3 rounded-lg transition-all duration-300 hover:bg-cyan-500/10 ${
                location.pathname === '/linear' 
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                  : 'text-gray-300 hover:text-cyan-400'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Dilatação Linear</span>
            </Link>
            <Link 
              to="/surface"
              className={`flex items-center gap-2 px-3 py-3 mt-2 rounded-lg transition-all duration-300 hover:bg-purple-500/10 ${
                location.pathname === '/surface' 
                  ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                  : 'text-gray-300 hover:text-purple-400'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Dilatação Superficial</span>
            </Link>
            <Link 
              to="/questions"
              className={`flex items-center gap-2 px-3 py-3 mt-2 rounded-lg transition-all duration-300 hover:bg-yellow-500/10 ${
                location.pathname === '/questions' 
                  ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]' 
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            >
              <GraduationCap className="h-5 w-5" />
              <span>Exercícios</span>
              {location.pathname === '/questions' && (
                <span className="flex h-1.5 w-1.5 relative ml-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-500"></span>
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
