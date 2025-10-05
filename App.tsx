import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import Appointments from './components/Appointments';
import Consultations from './components/Consultations';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Login from './components/Login';
import MyAccount from './components/MyAccount';
import { Appointment } from './types';
import Chatbot from './components/Chatbot';

export enum Page {
  Home = 'Home',
  Products = 'Products',
  Consultations = 'Consultations',
  Appointments = 'Appointments',
  Login = 'Login',
  MyAccount = 'MyAccount',
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<Appointment | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = (email: string) => {
    localStorage.setItem('currentUser', email);
    setCurrentUser(email);
    navigate(Page.MyAccount);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate(Page.Home);
  };

  const handleStartReschedule = (appointment: Appointment) => {
    setAppointmentToReschedule(appointment);
    navigate(Page.Appointments);
  };

  const handleRescheduleComplete = () => {
    setAppointmentToReschedule(null);
    navigate(Page.MyAccount);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Products:
        return <Products />;
      case Page.Consultations:
        return <Consultations onNavigate={navigate} />;
      case Page.Appointments:
        return <Appointments currentUser={currentUser} appointmentToReschedule={appointmentToReschedule} onRescheduleComplete={handleRescheduleComplete} />;
      case Page.Login:
        return <Login onLogin={handleLogin} />;
      case Page.MyAccount:
        return currentUser ? <MyAccount currentUser={currentUser} onNavigate={navigate} onStartReschedule={handleStartReschedule} /> : <Login onLogin={handleLogin} />;
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
                <Appointments currentUser={currentUser} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-text-light">
      <Header onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <WhatsAppButton phoneNumber="573022236861" />
      <Chatbot />
      <Footer />
    </div>
  );
};

export default App;