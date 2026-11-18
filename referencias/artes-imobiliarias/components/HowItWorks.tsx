
import React from 'react';
import { Zap, CreditCard } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    { num: 1, title: "Escolha o Segmento", desc: "Litoral, Alto Padrão, Popular, Lançamentos, Terrenos ou Rural" },
    { num: 2, title: "Descreva o Imóvel", desc: "Adicione detalhes, localização e diferenciais" },
    { num: 3, title: "Selecione o Formato", desc: "Feed, Stories ou Post Quadrado" },
    { num: 4, title: "Gere e Baixe", desc: "Arte profissional pronta em segundos" },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100 mb-4">
            <Zap className="w-3 h-3 mr-2" />
            Simples e Rápido
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Como Funciona</h2>
          <p className="text-slate-500 text-lg">Em 4 passos simples você tem sua arte pronta.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="text-center relative group">
              <div className="mb-6 relative">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-3xl font-black mx-auto shadow-xl shadow-blue-200 group-hover:scale-110 transition-transform">
                  {step.num}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-slate-100"></div>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center gap-2 mx-auto">
            <CreditCard className="w-5 h-5" />
            Ver Planos
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
