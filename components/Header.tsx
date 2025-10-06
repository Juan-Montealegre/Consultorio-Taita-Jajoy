import React, { useState } from 'react';
import { Page } from '../App';
import { LOGO_URL } from '../constants';
import { User } from '../types';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentUser, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Wrapper function to close the menu on navigation for mobile
  const handleMobileNavigate = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const handleMobileLogout = () => {
    onLogout();
    setIsMenuOpen(false);
  }

  return (
    <>
      <header className="bg-background/80 backdrop-blur-sm text-text-light sticky top-0 z-50 shadow-lg shadow-primary/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate(Page.Home)}
          >
            <img src={LOGO_URL} alt="Taita Jajoy Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-serif font-bold tracking-wider">Taita Jajoy</span>
          </div>
          
          {/* Desktop Navigation */}
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
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} aria-label="Abrir menú" className="text-text-light">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm transition-opacity duration-300 ease-in-out md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex justify-end p-6">
           <button onClick={() => setIsMenuOpen(false)} aria-label="Cerrar menú" className="text-text-light">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-full -mt-20 text-2xl space-y-8 font-semibold text-text-light">
          <button onClick={() => handleMobileNavigate(Page.Home)} className="hover:text-secondary transition duration-300">Inicio</button>
          <button onClick={() => handleMobileNavigate(Page.Consultations)} className="hover:text-secondary transition duration-300">Consultas</button>
          <button onClick={() => handleMobileNavigate(Page.Products)} className="hover:text-secondary transition duration-300">Productos</button>
          {currentUser ? (
            <>
              <button onClick={() => handleMobileNavigate(Page.MyAccount)} className="hover:text-secondary transition duration-300">Mis Citas</button>
              <button onClick={handleMobileLogout} className="hover:text-secondary transition duration-300">Cerrar Sesión</button>
            </>
          ) : (
            <button onClick={() => handleMobileNavigate(Page.Login)} className="hover:text-secondary transition duration-300">Iniciar Sesión</button>
          )}
          <div className="pt-6">
            <button onClick={() => handleMobileNavigate(Page.Appointments)} className="bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-6 rounded-full transition duration-300">
              Agendar Cita
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;