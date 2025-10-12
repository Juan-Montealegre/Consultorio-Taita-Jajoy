import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import Appointments from './components/Appointments';
import Consultations from './components/Consultations';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Login from './components/Login';
import MyAccount from './components/MyAccount';
import { Appointment, User } from './types';
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<Appointment | null>(null);

  const isAdmin = useMemo(() => {
    if (!currentUser || !process.env.TAITA_EMAIL) return false;
    return currentUser.email === process.env.TAITA_EMAIL;
  }, [currentUser]);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = (user: User) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
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
        return currentUser ? <MyAccount currentUser={currentUser} onNavigate={navigate} onStartReschedule={handleStartReschedule} isAdmin={false} /> : <Login onLogin={handleLogin} />;
      case Page.Home:
      default:
        return (
          <>
            <Hero onNavigate={navigate} />
            <div className="py-8">
              <Consultations onNavigate={navigate} />
            </div>
            <div className="py-8 bg-content">
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
    <div className="min-h-screen flex flex-col font-sans bg-background text-text-dark">
      <Header onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} isAdmin={isAdmin} />
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