
import React from 'react';
import { Play } from 'lucide-react';

const DemoVideo: React.FC = () => {
  return (
    <section id="video-section" className="py-16 md:py-24 border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100 mb-4">
            <Play className="w-3 h-3 mr-2 fill-blue-700" />
            Demonstração
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Veja Como é Fácil Criar Artes Profissionais</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Em menos de 30 segundos você transforma qualquer foto em um criativo pronto para vender.</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-900">
            <iframe 
              src="https://www.youtube.com/embed/uVCFeSZTgxY" 
              title="Demonstração Artes Imobiliárias" 
              className="w-full h-full"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoVideo;
