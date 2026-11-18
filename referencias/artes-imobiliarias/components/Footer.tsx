
import React from 'react';
import { Instagram, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <div>
            <div className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">AI</span>
              </div>
              Artes Imobiliárias
            </div>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Criativos profissionais com Inteligência Artificial para o mercado imobiliário. Transformamos sua presença digital.
            </p>
            <a 
              href="https://www.instagram.com/anunciosparacorretores/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-bold"
            >
              <Instagram className="w-5 h-5" />
              <span>@anunciosparacorretores</span>
            </a>
          </div>

          <div>
            <h4 className="text-slate-900 font-black mb-6 uppercase tracking-widest text-sm">Links Úteis</h4>
            <ul className="space-y-4 font-medium text-slate-600">
              <li><button className="hover:text-blue-600 transition-colors">Área do Cliente</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Ver Planos</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Perguntas Frequentes</button></li>
              <li><a href="https://wa.me/5531996835764" className="hover:text-blue-600 transition-colors">Suporte via WhatsApp</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-black mb-6 uppercase tracking-widest text-sm">Contato</h4>
            <ul className="space-y-4 font-medium text-slate-600">
              <li className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-pink-500" />
                <a href="https://www.instagram.com/anunciosparacorretores/" target="_blank" className="hover:text-blue-600 transition-colors">@anunciosparacorretores</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <a href="https://wa.me/5531996835764" target="_blank" className="hover:text-blue-600 transition-colors">WhatsApp Suporte</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm font-medium">
            © 2026 Artes Imobiliárias. Todos os direitos reservados.
          </p>
          <p className="text-slate-500 text-sm font-medium">
            Desenvolvido por <a href="https://www.instagram.com/anunciosparacorretores/" target="_blank" className="text-blue-600 hover:underline font-black">@anunciosparacorretores</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
