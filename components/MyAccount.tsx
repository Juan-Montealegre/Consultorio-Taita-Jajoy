import React, { useState, useEffect, useMemo } from 'react';
import { Appointment, User } from '../types';
import { Page } from '../App';
import { 
  CANCEL_PUBLIC_KEY,
  CANCEL_SERVICE_ID,
  CANCEL_CLIENT_TEMPLATE_ID,
  CANCEL_DOCTOR_TEMPLATE_ID,
  ADMIN_CANCEL_PUBLIC_KEY,
  ADMIN_CANCEL_SERVICE_ID,
  ADMIN_CANCEL_CLIENT_TEMPLATE_ID,
  ADMIN_CANCEL_DOCTOR_TEMPLATE_ID,
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
  isAdmin: boolean;
}

const MyAccount: React.FC<MyAccountProps> = ({ currentUser, onNavigate, onStartReschedule, isAdmin }) => {
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
    const appointments = isAdmin 
      ? allAppointments 
      : allAppointments.filter(app => app.userEmail === currentUser.email);
    
    // Sort upcoming first, then past appointments descending
    const now = new Date().getTime();
    return appointments.sort((a, b) => {
        const timeA = new Date(`${a.date}T${a.time}`).getTime();
        const timeB = new Date(`${b.date}T${b.time}`).getTime();
        const aIsPast = timeA < now;
        const bIsPast = timeB < now;

        if (aIsPast && !bIsPast) return 1; // Past appointments go to bottom
        if (!aIsPast && bIsPast) return -1; // Upcoming appointments go to top
        if (aIsPast && bIsPast) return timeB - timeA; // Sort past appointments newest first
        return timeA - timeB; // Sort upcoming appointments oldest first
    });
  }, [allAppointments, currentUser.email, isAdmin]);

  const handleCancel = async (appointmentToCancel: Appointment) => {
    if (cancellationState.status === 'sending') return;
    
    const confirmMessage = isAdmin
      ? `¿Estás seguro de que deseas cancelar la cita de ${appointmentToCancel.userName}? Se enviará una notificación al cliente.`
      : "¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.";

    if (window.confirm(confirmMessage)) {
      setCancellationState({ id: appointmentToCancel.id, status: 'sending' });
      setCancellationMessage(null);

      const appointmentDateTime = new Date(`${appointmentToCancel.date}T${appointmentToCancel.time}:00`);
      // FIX: Corrected typo from toLocaleDateTimeString to toLocaleDateString
      const formattedDate = appointmentDateTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const formattedTime = appointmentDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute:'2-digit' });

      const emailParams = {
        to_email: appointmentToCancel.userEmail,
        user_name: appointmentToCancel.userName,
        client_name: appointmentToCancel.userName, // For doctor's template
        client_email: appointmentToCancel.userEmail, // For doctor's template
        client_phone: appointmentToCancel.userPhone,
        service: appointmentToCancel.service,
        appointment_date: formattedDate,
        appointment_time: formattedTime,
      };
      
      const publicKey = isAdmin ? ADMIN_CANCEL_PUBLIC_KEY : CANCEL_PUBLIC_KEY;
      const serviceID = isAdmin ? ADMIN_CANCEL_SERVICE_ID : CANCEL_SERVICE_ID;
      const clientTemplateID = isAdmin ? ADMIN_CANCEL_CLIENT_TEMPLATE_ID : CANCEL_CLIENT_TEMPLATE_ID;
      const doctorTemplateID = isAdmin ? ADMIN_CANCEL_DOCTOR_TEMPLATE_ID : CANCEL_DOCTOR_TEMPLATE_ID;
      const emailjsOptions = { publicKey };
      
      try {
        await window.emailjs.send(serviceID, clientTemplateID, emailParams, emailjsOptions);
        await window.emailjs.send(serviceID, doctorTemplateID, emailParams, emailjsOptions);

        const updatedAppointments = allAppointments.filter(app => 
          app.id !== appointmentToCancel.id
        );
        localStorage.setItem('bookedAppointments', JSON.stringify(updatedAppointments));
        setAllAppointments(updatedAppointments);
        setCancellationState({ id: null, status: 'idle' });

      } catch (err) {
        console.error('Failed to send cancellation email:', err);
        if (err && (err as any).status === 412) {
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

  const now = useMemo(() => new Date().getTime(), []);

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-dark mb-2">{isAdmin ? 'Panel de Administración' : 'Mis Citas'}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: isAdmin ? `Bienvenido, Taita ${currentUser.name.split(' ')[0]}. Gestiona todas las citas agendadas aquí.` : `Bienvenido/a, <span class="font-bold text-accent">${currentUser.name}</span>. Aquí puedes ver y gestionar tus próximas citas.` }} />
             <div className="mt-4 h-1 w-24 bg-accent mx-auto rounded-full"></div>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {cancellationMessage && (
              <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg text-center" role="alert">
                  {cancellationMessage}
              </div>
          )}
          {myAppointments.length > 0 ? (
            myAppointments.map((app) => {
              const isCancelling = cancellationState.id === app.id && cancellationState.status === 'sending';
              const isError = cancellationState.id === app.id && cancellationState.status === 'error';
              const isPast = new Date(`${app.date}T${app.time}`).getTime() < now;

              return (
                <div key={app.id} className={`bg-content border border-gray-200 p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-opacity ${isPast ? 'opacity-60' : ''}`}>
                  <div className="flex-grow">
                    {isAdmin && (
                        <div className="mb-2 border-b border-gray-200 pb-2">
                            <p className="text-sm font-bold text-text-dark">{app.userName}</p>
                            <p className="text-xs text-gray-500">{app.userEmail}</p>
                            {app.userPhone && <p className="text-xs text-gray-500">Tel: {app.userPhone}</p>}
                        </div>
                    )}
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xl font-bold text-primary">{app.service}</p>
                            <p className="text-gray-700">
                            <span className="font-semibold">Fecha:</span> {new Date(`${app.date}T00:00:00`).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-gray-700">
                            <span className="font-semibold">Hora:</span> {app.time}
                            </p>
                        </div>
                         {isPast && (
                            <span className="mt-1 text-xs font-bold uppercase text-yellow-800 bg-yellow-100 px-2 py-1 rounded">Cita Pasada</span>
                        )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                    <button 
                      onClick={() => onStartReschedule(app)}
                      disabled={isPast}
                      className="bg-accent hover:bg-accent/80 text-white text-sm font-bold py-2 px-4 rounded-full transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Reprogramar
                    </button>
                    <button 
                      onClick={() => handleCancel(app)}
                      disabled={isCancelling || isPast}
                      className={`text-white text-sm font-bold py-2 px-4 rounded-full transition-colors duration-300 ${
                        isCancelling 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : isError 
                            ? 'bg-yellow-500 hover:bg-yellow-600' 
                            : 'bg-red-600 hover:bg-red-700'
                      } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                    >
                      {isCancelling ? 'Cancelando...' : isError ? 'Error, reintentar' : 'Cancelar Cita'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center bg-content border border-gray-200 p-8 rounded-lg">
              <p className="text-gray-600 mb-4">{isAdmin ? 'No hay citas agendadas por ningún cliente.' : 'No tienes citas agendadas.'}</p>
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