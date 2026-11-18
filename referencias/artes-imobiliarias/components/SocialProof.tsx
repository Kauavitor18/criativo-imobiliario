
import React from 'react';
import { Users, Layers, Star, Instagram } from 'lucide-react';

const SocialProof: React.FC = () => {
  return (
    <section className="py-8 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-500">+500 corretores confiam</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-500">+10.000 artes criadas</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-sm font-bold text-slate-700 ml-2">4.9/5 avaliação</span>
          </div>
          <a href="#" className="flex items-center gap-2 hover:text-blue-600 transition-colors text-slate-500">
            <Instagram className="w-5 h-5" />
            <span className="text-sm font-medium">@anunciosparacorretores</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
