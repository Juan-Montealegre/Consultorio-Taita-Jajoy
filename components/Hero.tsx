import React from 'react';
import { Page } from '../App';

interface HeroProps {
  onNavigate: (page: Page) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative bg-cover bg-center h-[70vh] text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop')" }}>
      <div className="absolute inset-0 bg-primary opacity-50"></div>
      <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight text-text-light">Conecta con la Sabiduría Ancestral</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl text-text-light/80">
          El Taita Jajoy te guía en un viaje de sanación para restaurar el equilibrio entre cuerpo, mente y espíritu.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
                onClick={() => onNavigate(Page.Consultations)}
                className="bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
            >
                Conoce al Taita
            </button>
             <button 
                onClick={() => onNavigate(Page.Appointments)}
                className="bg-white hover:bg-gray-200 text-primary font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
            >
                Agendar una Cita
            </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;