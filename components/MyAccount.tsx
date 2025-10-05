import React, { useState, useEffect, useMemo } from 'react';
import { Appointment } from '../types';
import { Page } from '../App';

interface MyAccountProps {
  currentUser: string;
  onNavigate: (page: Page) => void;
  onStartReschedule: (appointment: Appointment) => void;
}

const MyAccount: React.FC<MyAccountProps> = ({ currentUser, onNavigate, onStartReschedule }) => {
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const storedAppointments = localStorage.getItem('bookedAppointments');
    if (storedAppointments) {
      const parsedAppointments: Appointment[] = JSON.parse(storedAppointments);
      setAllAppointments(parsedAppointments);
    }
  }, []);

  const myAppointments = useMemo(() => {
    return allAppointments
      .filter(app => app.userEmail === currentUser)
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  }, [allAppointments, currentUser]);

  const handleCancel = (appointmentToCancel: Appointment) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      const updatedAppointments = allAppointments.filter(app => 
        app.id !== appointmentToCancel.id
      );
      localStorage.setItem('bookedAppointments', JSON.stringify(updatedAppointments));
      setAllAppointments(updatedAppointments);
    }
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-light mb-2">Mis Citas</h2>
            <p className="text-lg text-text-light/70 max-w-3xl mx-auto">
                Bienvenido/a, <span className="font-bold text-secondary">{currentUser}</span>. Aquí puedes ver y gestionar tus próximas citas.
            </p>
             <div className="mt-4 h-1 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {myAppointments.length > 0 ? (
            myAppointments.map((app) => (
              <div key={app.id} className="bg-primary/20 border border-primary/50 p-6 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-xl font-bold text-text-light">{app.service}</p>
                  <p className="text-text-light/80">
                    <span className="font-semibold">Fecha:</span> {new Date(`${app.date}T00:00:00`).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-text-light/80">
                    <span className="font-semibold">Hora:</span> {app.time}
                  </p>
                </div>
                <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                  <button 
                    onClick={() => onStartReschedule(app)}
                    className="bg-primary hover:bg-primary/70 text-white text-sm font-bold py-2 px-4 rounded-full transition-colors duration-300"
                  >
                    Reprogramar
                  </button>
                  <button 
                    onClick={() => handleCancel(app)}
                    className="bg-red-800 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-full transition-colors duration-300"
                  >
                    Cancelar Cita
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center bg-primary/20 border border-primary/50 p-8 rounded-lg">
              <p className="text-text-light/80 mb-4">No tienes citas agendadas.</p>
              <button 
                onClick={() => onNavigate(Page.Appointments)} 
                className="bg-secondary hover:bg-secondary/80 text-white font-bold py-2 px-6 rounded-full transition duration-300"
              >
                Agendar una Cita
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyAccount;