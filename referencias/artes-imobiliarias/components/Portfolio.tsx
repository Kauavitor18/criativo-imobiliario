
import React from 'react';
import { Sparkles } from 'lucide-react';

const Portfolio: React.FC = () => {
  const images = [
    { src: 'https://picsum.photos/seed/port1/600/600', label: 'Litoral' },
    { src: 'https://picsum.photos/seed/port2/600/600', label: 'Alto Padrão' },
    { src: 'https://picsum.photos/seed/port3/600/600', label: 'MCMV' },
    { src: 'https://picsum.photos/seed/port4/600/600', label: 'Lançamentos' },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100 mb-4">
            <Sparkles className="w-3 h-3 mr-2 text-blue-700" />
            Portfólio Real
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Criativos 100% Feitos com Nossa IA</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Exemplos reais gerados em segundos pela nossa inteligência artificial.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((img, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-xl bg-white border border-slate-100">
              <img src={img.src} alt={img.label} className="w-full h-auto group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-white font-bold">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
