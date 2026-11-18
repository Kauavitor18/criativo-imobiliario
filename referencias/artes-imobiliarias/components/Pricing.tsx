
import React, { useState } from 'react';
import { CreditCard, Check, Sparkles, Crown, ArrowRight } from 'lucide-react';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Básico",
      price: "39,90",
      credits: 15,
      desc: "Para quem quer conhecer o app na prática",
      features: ["Até 15 artes por mês", "1 Brand Profile", "Suporte via WhatsApp", "Renovação automática"]
    },
    {
      name: "Starter",
      price: "69,90",
      credits: 30,
      desc: "Para corretores que querem conteúdos ativos",
      features: ["Até 30 artes por mês", "1 Brand Profile", "Suporte via WhatsApp", "Renovação automática"]
    },
    {
      name: "Pro",
      price: "99,90",
      credits: 50,
      popular: true,
      desc: "Para campanhas de tráfego e conteúdos recorrentes",
      features: ["Até 50 artes por mês", "Multi Brand Profiles", "Suporte prioritário", "Renovação automática"]
    },
    {
      name: "Imobiliária",
      price: "179,90",
      credits: 100,
      desc: "Ideal para agências e grandes operações",
      features: ["Até 100 artes por mês", "Multi Brand Profiles", "Suporte VIP", "Renovação automática"]
    }
  ];

  return (
    <section id="plans-section" className="py-16 md:py-24 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100 mb-4">
            <CreditCard className="w-3 h-3 mr-2" />
            Planos
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Escolha o Plano Ideal Para Você</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Planos flexíveis para corretores autônomos, equipes e imobiliárias.</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-slate-100 p-1.5 rounded-full inline-flex items-center">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${!isAnnual ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500'}`}
            >
              Mensal
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500'}`}
            >
              Anual <span className="text-xs bg-blue-100 px-2 py-0.5 rounded-full">-15%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((p, i) => (
            <div key={i} className={`relative p-8 rounded-3xl border transition-all ${p.popular ? 'border-blue-600 ring-4 ring-blue-50 bg-white' : 'border-slate-100 bg-slate-50 hover:border-blue-200'}`}>
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black px-6 py-2 rounded-full shadow-xl flex items-center gap-2">
                  <Crown className="w-3 h-3" />
                  MAIS POPULAR
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 mb-2">{p.name}</h3>
                <p className="text-sm text-slate-500 h-10 mb-6">{p.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-slate-900">R$ {p.price}</span>
                  <span className="text-slate-400 font-bold">/mês</span>
                </div>
                <div className={`py-3 px-4 rounded-2xl flex items-center justify-center gap-2 ${p.popular ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-100'}`}>
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xl font-black">{p.credits}</span>
                  <span className="text-sm font-bold opacity-80">créditos/mês</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${p.popular ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200' : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600'}`}>
                Assinar {p.name}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
