
import React from 'react';
import { Instagram, BadgeCheck, Sparkles, ArrowRight, Play, Zap, Clock, Shield, TrendingUp, Layers } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-32 pb-16 md:pb-24 bg-slate-50">
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <a 
              href="https://www.instagram.com/anunciosparacorretores/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-full px-4 py-2 mb-6 hover:from-pink-500/20 hover:to-purple-500/20 transition-all group"
            >
              <Instagram className="w-4 h-4 text-pink-500" />
              <span className="text-sm text-slate-700 font-medium">por <strong className="text-pink-500 group-hover:underline">@anunciosparacorretores</strong></span>
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            </a>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-slate-900">
              Crie Artes Imobiliárias<br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">que Vendem em Segundos</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Transforme suas fotos de imóveis em criativos profissionais com <strong className="text-slate-900">Inteligência Artificial</strong>. Usado por mais de <strong className="text-blue-600">500 corretores</strong> em todo Brasil.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-blue-200 group transition-all">
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Ver Planos e Preços
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-4 px-8 rounded-2xl transition-all">
                <Play className="w-5 h-5 fill-slate-700" />
                Ver Demonstração
              </button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><Zap className="w-4 h-4 text-green-600" /></div>
                <span>Resultados em segundos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Clock className="w-4 h-4 text-blue-600" /></div>
                <span>Acesso imediato</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"><Shield className="w-4 h-4 text-purple-600" /></div>
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img src="https://picsum.photos/seed/re1/400/500" alt="Exemplo" className="w-full rounded-3xl shadow-2xl border border-white hover:scale-105 transition-transform duration-500" />
                  <img src="https://picsum.photos/seed/re2/400/400" alt="Exemplo" className="w-full rounded-3xl shadow-2xl border border-white hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="space-y-4 pt-8">
                  <img src="https://picsum.photos/seed/re3/400/400" alt="Exemplo" className="w-full rounded-3xl shadow-2xl border border-white hover:scale-105 transition-transform duration-500" />
                  <img src="https://picsum.photos/seed/re4/400/500" alt="Exemplo" className="w-full rounded-3xl shadow-2xl border border-white hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </div>

            <div className="absolute -left-8 top-1/4 bg-white border border-slate-100 rounded-2xl p-4 shadow-2xl hidden lg:block animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-white" /></div>
                <div>
                  <p className="text-xl font-bold text-slate-900">+500</p>
                  <p className="text-xs text-slate-500">Corretores ativos</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 bottom-1/4 bg-white border border-slate-100 rounded-2xl p-4 shadow-2xl hidden lg:block animate-bounce-slow" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center"><Layers className="w-5 h-5 text-white" /></div>
                <div>
                  <p className="text-xl font-bold text-slate-900">10k+</p>
                  <p className="text-xs text-slate-500">Artes geradas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
