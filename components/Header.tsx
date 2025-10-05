import React from 'react';
import { Page } from '../App';
import { LOGO_URL } from '../constants';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  currentUser: string | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentUser, onLogout }) => {
  return (
    <header className="bg-background/80 backdrop-blur-sm text-text-light sticky top-0 z-50 shadow-lg shadow-primary/20">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => onNavigate(Page.Home)}
        >
          <img src={LOGO_URL} alt="Taita Jajoy Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl font-serif font-bold tracking-wider">Consultorio de Medicina Ancestral</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6 font-semibold">
          <button onClick={() => onNavigate(Page.Home)} className="hover:text-secondary transition duration-300">Inicio</button>
          <button onClick={() => onNavigate(Page.Consultations)} className="hover:text-secondary transition duration-300">Consultas</button>
          <button onClick={() => onNavigate(Page.Products)} className="hover:text-secondary transition duration-300">Productos</button>
          {currentUser ? (
            <>
              <button onClick={() => onNavigate(Page.MyAccount)} className="hover:text-secondary transition duration-300">Mis Citas</button>
              <button onClick={onLogout} className="hover:text-secondary transition duration-300">Cerrar Sesión</button>
            </>
          ) : (
            <button onClick={() => onNavigate(Page.Login)} className="hover:text-secondary transition duration-300">Iniciar Sesión</button>
          )}
          <button onClick={() => onNavigate(Page.Appointments)} className="bg-secondary hover:bg-secondary/80 text-white font-bold py-2 px-4 rounded-full transition duration-300">
            Agendar Cita
          </button>
        </nav>
        <div className="md:hidden">
            <button onClick={() => onNavigate(Page.Appointments)} className="bg-secondary hover:bg-secondary/80 text-white font-bold py-2 px-3 rounded-full text-sm transition duration-300">
                Agendar
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;