
import React from 'react';
import { Waves, Building2, House, Rocket, MapPin, TreePine, Target } from 'lucide-react';

const Specialization: React.FC = () => {
  const segments = [
    { icon: <Waves />, title: "Litoral", desc: "Imóveis costeiros e resorts" },
    { icon: <Building2 />, title: "Alto Padrão", desc: "Luxo e arquitetura premium" },
    { icon: <House />, title: "Popular", desc: "Acessibilidade e clareza" },
    { icon: <Rocket />, title: "Lançamentos", desc: "Inovação e exclusividade" },
    { icon: <MapPin />, title: "Terrenos", desc: "Lotes e localização" },
    { icon: <TreePine />, title: "Rural", desc: "Propriedades e fazendas" },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100 mb-4">
            <Target className="w-3 h-3 mr-2" />
            Especialização
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">6 Segmentos com IA Especializada</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Cada segmento possui prompts otimizados e design específico para maximizar suas conversões.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {segments.map((s, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 hover:scale-105 hover:shadow-xl transition-all text-center group">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                {React.cloneElement(s.icon as React.ReactElement, { className: "w-8 h-8 text-blue-600 group-hover:text-white transition-colors" })}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialization;
