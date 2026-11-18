
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  return (
    <a 
      href="https://wa.me/5531996835764?text=Olá!%20Preciso%20de%20suporte%20com%20o%20Artes%20Imobiliárias." 
      target="_blank" 
      rel="noopener noreferrer" 
      className="fixed bottom-6 right-6 z-50 group flex flex-col items-end"
    >
      <div className="mb-2 px-4 py-2 bg-white text-slate-900 text-xs font-black rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 border border-slate-100 whitespace-nowrap">
        Suporte WhatsApp
      </div>
      <div className="w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/30 group-hover:scale-110 transition-all duration-300">
        <MessageCircle className="w-8 h-8 fill-white" />
      </div>
    </a>
  );
};

export default WhatsAppButton;
