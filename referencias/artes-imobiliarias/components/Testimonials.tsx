
import React from 'react';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const reviews = [
    { name: "Carla Mendes", role: "Corretora Autônoma", initial: "C", text: '"Antes eu gastava horas criando artes ou pagava caro para designers. Agora faço em segundos e minhas postagens ficam muito mais profissionais!"' },
    { name: "Ricardo Alves", role: "Imobiliária Premium", initial: "R", text: '"A qualidade das artes é impressionante. Nossos clientes sempre elogiam o material de divulgação. Vale cada centavo investido."' },
    { name: "Fernanda Costa", role: "Social Media Imobiliária", initial: "F", text: '"Gerencio 5 contas de imobiliárias e essa ferramenta triplicou minha produtividade. Os 6 segmentos fazem toda a diferença."' },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100 mb-4">
            <Star className="w-3 h-3 mr-2" />
            Depoimentos
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">O Que Nossos Clientes Dizem</h2>
          <p className="text-slate-500 text-lg">Resultados reais de corretores que transformaram suas vendas.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 mb-8 italic leading-relaxed">{r.text}</p>
              <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl">
                  {r.initial}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900">{r.name}</p>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
