import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-text-light/70">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-serif font-bold text-text-light">Taita Jajoy</h3>
            <p className="text-sm">Medicina Ancestral para el Mundo Moderno</p>
          </div>
          <div className="mb-6 md:mb-0">
            <p>&copy; {new Date().getFullYear()} Taita Jajoy. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;