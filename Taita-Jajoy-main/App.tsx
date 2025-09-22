import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import Appointments from './components/Appointments';
import Consultations from './components/Consultations';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

export enum Page {
  Home = 'Home',
  Products = 'Products',
  Consultations = 'Consultations',
  Appointments = 'Appointments',
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Products:
        return <Products />;
      case Page.Consultations:
        return <Consultations onNavigate={navigate} />;
      case Page.Appointments:
        return <Appointments />;
      case Page.Home:
      default:
        return (
          <>
            <Hero onNavigate={navigate} />
            <div className="py-8">
              <Consultations onNavigate={navigate} />
            </div>
            <div className="py-8 bg-black/20">
              <Products />
            </div>
            <div className="py-8">
                <Appointments />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-text-light">
      <Header onNavigate={navigate} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <WhatsAppButton phoneNumber="573022236861" />
      <Footer />
    </div>
  );
};

export default App;