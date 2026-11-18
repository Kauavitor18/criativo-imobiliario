
import React from 'react';
import { Instagram } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <div className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">AI</span>
              </div>
              <span className="hidden sm:inline">Artes Imobiliárias</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a 
              href="https://www.instagram.com/anunciosparacorretores/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span className="text-sm font-medium">@anunciosparacorretores</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">
              Entrar
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-5 rounded-full shadow-lg shadow-blue-200 transition-all">
              Ver Planos
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
