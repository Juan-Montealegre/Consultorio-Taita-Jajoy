import React, { useState, useEffect, useMemo } from 'react';
import { Appointment, User } from '../types';
import { Page } from '../App';
import { 
  CANCEL_PUBLIC_KEY,
  CANCEL_SERVICE_ID,
  CANCEL_CLIENT_TEMPLATE_ID,
  CANCEL_DOCTOR_TEMPLATE_ID,
  ADMIN_CANCEL_CLIENT_TEMPLATE_ID,
  ADMIN_CANCEL_DOCTOR_TEMPLATE_ID,
  ADMIN_CANCEL_PUBLIC_KEY,
  ADMIN_CANCEL_SERVICE_ID,
} from '../constants';


declare global {
  interface Window {
    emailjs: {
      send: (serviceID: string, templateID: string, params: object, options?: { publicKey: string }) => Promise<{ status: number; text: string }>;
    };
  }
}

interface MyAccountProps {
  currentUser: User;
  onNavigate: (page: Page) => void;
  onStartReschedule: (appointment: Appointment) => void;
}

const MyAccount: React.FC<MyAccountProps> = ({ currentUser, onNavigate, onStartReschedule }) => {
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [cancellationState, setCancellationState] = useState<{ id: string | null; status: 'idle' | 'sending' | 'error' }>({ id: null, status: 'idle' });
  const [cancellationMessage, setCancellationMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedAppointments = localStorage.getItem('bookedAppointments');
    if (storedAppointments) {
      const parsedAppointments: Appointment[] = JSON.parse(storedAppointments);
      setAllAppointments(parsedAppointments);
    }
  }, []);

  const myAppointments = useMemo(() => {
    return allAppointments
      .filter(app => app.userEmail === currentUser.email)
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  }, [allAppointments, currentUser]);

  const handleCancel = async (appointmentToCancel: Appointment) => {
    if (cancellationState.status === 'sending') return;

    if (window.confirm("¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.")) {
      setCancellationState({ id: appointmentToCancel.id, status: 'sending' });
      setCancellationMessage(null);

      const appointmentDateTime = new Date(`${appointmentToCancel.date}T${appointmentToCancel.time}:00`);
      const formattedDate = appointmentDateTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const formattedTime = appointmentDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute:'2-digit' });

      const emailParams = {
        to_email: appointmentToCancel.userEmail,
        user_name: appointmentToCancel.userName,
        client_name: appointmentToCancel.userName, // For doctor's template
        client_email: appointmentToCancel.userEmail, // For doctor's template
        service: appointmentToCancel.service,
        appointment_date: formattedDate,
        appointment_time: formattedTime,
      };
      
      try {
        if (isAdmin) {
          const adminOptions = { publicKey: ADMIN_CANCEL_PUBLIC_KEY };
          await window.emailjs.send(ADMIN_CANCEL_SERVICE_ID, ADMIN_CANCEL_CLIENT_TEMPLATE_ID, emailParams, adminOptions);
          await window.emailjs.send(ADMIN_CANCEL_SERVICE_ID, ADMIN_CANCEL_DOCTOR_TEMPLATE_ID, emailParams, adminOptions);
        } else {
          const emailjsOptions = { publicKey: CANCEL_PUBLIC_KEY };
          await window.emailjs.send(CANCEL_SERVICE_ID, CANCEL_CLIENT_TEMPLATE_ID, emailParams, emailjsOptions);
          await window.emailjs.send(CANCEL_SERVICE_ID, CANCEL_DOCTOR_TEMPLATE_ID, emailParams, emailjsOptions);
        }

        const updatedAppointments = allAppointments.filter(app => 
          app.id !== appointmentToCancel.id
        );
        localStorage.setItem('bookedAppointments', JSON.stringify(updatedAppointments));
        setAllAppointments(updatedAppointments);
        setCancellationState({ id: null, status: 'idle' });

      } catch (err) {
        console.error('Failed to send cancellation email:', err);
        if (err && (err as { status?: number })?.status === 412) {
          setCancellationMessage('Estamos experimentando problemas técnicos con las notificaciones por correo. Tu cita NO ha sido cancelada. Por favor, contáctanos por WhatsApp para gestionar la cancelación. Disculpa las molestias.');
        } else {
          setCancellationMessage('Hubo un error al procesar la cancelación. Por favor, contacta por WhatsApp para confirmar.');
        }
        setCancellationState({ id: appointmentToCancel.id, status: 'error' });
        setTimeout(() => {
          setCancellationState({ id: null, status: 'idle' });
          setCancellationMessage(null);
        }, 8000);
      }
    }
  };

  const taitaEmail = import.meta.env.VITE_TAITA_EMAIL;
  const isAdmin = currentUser.email === taitaEmail;
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-light mb-2">Mis Citas</h2>
            <p className="text-lg text-text-light/70 max-w-3xl mx-auto">
                Bienvenido/a, <span className="font-bold text-secondary">{currentUser.name}</span>. Aquí puedes ver y gestionar tus próximas citas.
            </p>
             <div className="mt-4 h-1 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>

        {/* Panel de administración solo para el Taita */}
        {isAdmin && (
          <div className="mb-12 p-6 bg-secondary/10 border-2 border-secondary rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-secondary mb-2">Panel de Administrador</h3>
            <p className="mb-4 text-text-light/80">Acceso exclusivo para el Taita Jajoy. Aquí puedes ver todas las citas agendadas por los usuarios.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-secondary/20">
                    <th className="py-2 px-4">Usuario</th>
                    <th className="py-2 px-4">Correo</th>
                    <th className="py-2 px-4">Servicio</th>
                    <th className="py-2 px-4">Fecha</th>
                    <th className="py-2 px-4">Hora</th>
                    <th className="py-2 px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {allAppointments.length > 0 ? (
                    allAppointments.map(app => {
                      const isCancelling = cancellationState.id === app.id && cancellationState.status === 'sending';
                      const isError = cancellationState.id === app.id && cancellationState.status === 'error';
                      return (
                        <tr key={app.id} className="border-b border-primary/30">
                          <td className="py-2 px-4">{app.userName}</td>
                          <td className="py-2 px-4">{app.userEmail}</td>
                          <td className="py-2 px-4">{app.service}</td>
                          <td className="py-2 px-4">{new Date(`${app.date}T00:00:00`).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                          <td className="py-2 px-4">{app.time}</td>
                          <td className="py-2 px-4">
                            <button
                              onClick={() => handleCancel(app)}
                              disabled={isCancelling}
                              className={`bg-red-800 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded-full transition-colors duration-300 ${isCancelling ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {isCancelling ? 'Cancelando...' : isError ? 'Error, reintentar' : 'Cancelar'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-text-light/60">No hay citas agendadas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-6">
          {cancellationMessage && (
              <div className="p-4 mb-4 text-sm text-red-200 bg-red-900/50 rounded-lg text-center" role="alert">
                  {cancellationMessage}
              </div>
          )}
          {myAppointments.length > 0 ? (
            myAppointments.map((app) => {
              const isCancelling = cancellationState.id === app.id && cancellationState.status === 'sending';
              const isError = cancellationState.id === app.id && cancellationState.status === 'error';

              return (
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
                      disabled={isCancelling}
                      className={`text-white text-sm font-bold py-2 px-4 rounded-full transition-colors duration-300 ${
                        isCancelling 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : isError 
                            ? 'bg-yellow-600 hover:bg-yellow-500' 
                            : 'bg-red-800 hover:bg-red-700'
                      }`}
                    >
                      {isCancelling ? 'Cancelando...' : isError ? 'Error, reintentar' : 'Cancelar Cita'}
                    </button>
                  </div>
                </div>
              );
            })
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