
import React from 'react';
import { Sparkles, Target, Palette, Download, Zap, Shield } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    { icon: <Sparkles />, title: "IA de Última Geração", desc: "Tecnologia avançada para resultados profissionais" },
    { icon: <Target />, title: "6 Segmentos Especializados", desc: "Prompts otimizados para cada tipo de imóvel" },
    { icon: <Palette />, title: "Design Impactante", desc: "Layouts modernos que convertem em vendas" },
    { icon: <Download />, title: "Formatos Múltiplos", desc: "Feed, Stories e Posts quadrados" },
    { icon: <Zap />, title: "Geração Rápida", desc: "Criativos prontos em segundos" },
    { icon: <Shield />, title: "Sua Logo Preservada", desc: "Qualidade perfeita da sua marca" },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100 mb-4">
            Funcionalidades
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Tudo Que Você Precisa Para Vender Mais</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Ferramentas poderosas pensadas especificamente para o mercado imobiliário.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:bg-blue-600 transition-colors">
                {React.cloneElement(f.icon as React.ReactElement, { className: "w-7 h-7 text-blue-600 group-hover:text-white transition-colors" })}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
