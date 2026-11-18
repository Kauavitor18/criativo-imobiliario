
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "Como funcionam os créditos?", a: "Cada crédito permite a geração de uma arte completa em qualquer um dos formatos suportados (Feed, Stories ou Quadrado)." },
    { q: "Como acesso a plataforma após a compra?", a: "Após a confirmação do pagamento, você receberá um e-mail com os dados de acesso instantaneamente." },
    { q: "Posso cancelar meu plano a qualquer momento?", a: "Sim! Não temos fidelidade. Você pode cancelar sua assinatura diretamente no painel do cliente quando desejar." },
    { q: "Os créditos acumulam para o próximo mês?", a: "Os créditos são renovados mensalmente de acordo com seu ciclo de faturamento e não são acumulativos." },
    { q: "Posso trocar de plano depois?", a: "Com certeza. Você pode fazer o upgrade ou downgrade do seu plano a qualquer momento através do suporte ou do painel." },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100 mb-4">
            Dúvidas
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Perguntas Frequentes</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-900">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <div className={`px-6 transition-all duration-300 overflow-hidden ${openIndex === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
