import React from 'react';
import { SERVICES } from '../constants';
import { Page } from '../App';

interface ConsultationsProps {
  onNavigate: (page: Page) => void;
}

const Consultations: React.FC<ConsultationsProps> = ({ onNavigate }) => {
  return (
    <section id="consultations" className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-light mb-2">Consultas con el Taita Jajoy</h2>
          <p className="text-lg text-text-light/70 max-w-3xl mx-auto">
            Un encuentro con la sabiduría de la tierra a través de su guardián.
          </p>
          <div className="mt-4 h-1 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 max-w-5xl mx-auto">
          <div className="md:w-1/3 flex-shrink-0">
            <img 
              src="https://picsum.photos/seed/taita/600/800" 
              alt="Taita Jajoy"
              className="rounded-lg shadow-2xl shadow-primary/20 w-full object-cover aspect-[3/4]"
            />
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold text-secondary mb-4">El Taita Jajoy</h3>
            <p className="text-text-light/80 mb-4 leading-relaxed">
              Heredero de un linaje de médicos tradicionales indígenas, el Taita Jajoy posee el conocimiento ancestral de las plantas sagradas y las energías de la naturaleza. Su misión es servir como puente entre el mundo moderno y las prácticas de sanación milenarias, ofreciendo una guía compasiva para quienes buscan armonía y bienestar.
            </p>
            <p className="text-text-light/80 mb-6 leading-relaxed">
              Cada consulta es un ritual personalizado, un espacio sagrado donde tu historia es escuchada y tu espíritu es atendido.
            </p>
            
            <div className="bg-primary/20 border border-primary/50 rounded-lg p-6 mb-6">
                <h4 className="text-xl font-semibold text-text-light mb-4">Servicios Ofrecidos:</h4>
                <ul className="space-y-2 text-text-light/90">
                {SERVICES.map(service => (
                    <li key={service} className="flex items-start">
                        <svg className="w-5 h-5 mr-2 text-secondary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>{service}</span>
                    </li>
                ))}
                </ul>
            </div>

            <button
              onClick={() => onNavigate(Page.Appointments)}
              className="bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Agenda tu Encuentro Sagrado
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Consultations;
