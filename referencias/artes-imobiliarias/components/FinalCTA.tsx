
import React from 'react';
import { Instagram, CreditCard, ArrowRight } from 'lucide-react';

const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-slate-900">
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <a 
          href="https://www.instagram.com/anunciosparacorretores/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8 hover:bg-white/20 transition-all text-white"
        >
          <Instagram className="w-5 h-5 text-pink-400" />
          <span className="text-sm font-bold">Siga @anunciosparacorretores</span>
        </a>

        <h2 className="text-4xl md:text-6xl font-black mb-8 text-white leading-tight">
          Pronto para <span className="text-blue-400">Vender Mais</span>?
        </h2>

        <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Junte-se a mais de <strong className="text-white">500 corretores</strong> que já transformaram suas vendas com artes profissionais feitas com IA.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-12 rounded-3xl shadow-2xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 text-lg group">
            <CreditCard className="w-6 h-6" />
            Escolher Meu Plano
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <p className="text-slate-400 font-medium mt-10 flex items-center justify-center gap-6 text-sm">
          <span>Acesso imediato</span>
          <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
          <span>Suporte via WhatsApp</span>
          <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
          <span>Cancele quando quiser</span>
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
