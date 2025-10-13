import React, { useState, useMemo, useEffect } from 'react';
import {
  SERVICES,
  COLOMBIAN_HOLIDAYS,
  BOOKING_PUBLIC_KEY,
  BOOKING_SERVICE_ID,
  BOOKING_CLIENT_TEMPLATE_ID,
  BOOKING_DOCTOR_TEMPLATE_ID,
  RESCHEDULE_PUBLIC_KEY,
  RESCHEDULE_SERVICE_ID,
  RESCHEDULE_CLIENT_TEMPLATE_ID,
  RESCHEDULE_DOCTOR_TEMPLATE_ID,
} from '../constants';
import { Appointment, User } from '../types';

declare global {
  interface Window {
    emailjs: {
      send: (serviceID: string, templateID: string, params: object, options?: { publicKey: string }) => Promise<{ status: number; text: string }>;
    };
  }
}

interface AppointmentsProps {
  currentUser: User | null;
  appointmentToReschedule?: Appointment | null;
  onRescheduleComplete?: () => void;
}

const Appointments: React.FC<AppointmentsProps> = ({ currentUser, appointmentToReschedule, onRescheduleComplete }) => {
  // State hooks must be declared before any conditional rendering that uses them
  const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>([]);
  
  // Mostrar panel de administración solo para el admin
  // ...existing code...

  // Render condicional después de los hooks
  // Función para cancelar cita (solo admin)
  const handleCancelAppointment = (id: string) => {
    setBookedAppointments(prev => prev.map(cita => cita.id === id ? { ...cita, estado: 'cancelada' } : cita));
    localStorage.setItem('bookedAppointments', JSON.stringify(bookedAppointments.map(cita => cita.id === id ? { ...cita, estado: 'cancelada' } : cita)));
  };

  if (currentUser?.tipo === 'admin') {
    return (
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-content border border-gray-200 p-8 rounded-xl shadow-2xl shadow-primary/10">
            <h2 className="text-3xl font-serif font-bold text-center text-text-dark mb-4">Panel de Administración</h2>
            <p className="text-center text-gray-600 mb-8">Bienvenido, administrador. Aquí puedes gestionar productos, usuarios y citas.</p>
            <div className="space-y-4">
              <button className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-md">Gestionar Productos</button>
              <button className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-md">Gestionar Usuarios</button>
              <button className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-md">Ver Todas las Citas</button>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-2">Todas las citas</h3>
              <ul className="divide-y divide-gray-200">
                {bookedAppointments.map((cita) => (
                  <li key={cita.id} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <span className="font-semibold">{cita.userName}</span> ({cita.userEmail})<br/>
                      <span>{cita.date} {cita.time} - {cita.service}</span><br/>
                      <span className="text-xs">Estado: {cita.estado || 'pendiente'}</span>
                    </div>
                    {cita.estado !== 'cancelada' && (
                      <button className="bg-red-500 text-white px-3 py-1 rounded-md mt-2 md:mt-0" onClick={() => handleCancelAppointment(cita.id)}>
                        Cancelar
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Función para marcar cita como completada (solo taita)
  const handleCompleteAppointment = (id: string) => {
    setBookedAppointments(prev => prev.map(cita => cita.id === id ? { ...cita, estado: 'completada' } : cita));
    localStorage.setItem('bookedAppointments', JSON.stringify(bookedAppointments.map(cita => cita.id === id ? { ...cita, estado: 'completada' } : cita)));
  };

  if (currentUser?.tipo === 'taita') {
    const citasTaita = bookedAppointments.filter(cita => cita.userEmail === currentUser.email);
    return (
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-content border border-gray-200 p-8 rounded-xl shadow-2xl shadow-primary/10">
            <h2 className="text-3xl font-serif font-bold text-center text-text-dark mb-4">Citas del Taita Jajoy</h2>
            <p className="text-center text-gray-600 mb-8">Aquí puedes ver y gestionar tus citas.</p>
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-2">Mis citas</h3>
              {citasTaita.length === 0 ? (
                <p className="text-gray-500">No tienes citas agendadas.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {citasTaita.map((cita) => (
                    <li key={cita.id} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <span className="font-semibold">{cita.date} {cita.time}</span> - {cita.service}<br/>
                        <span>{cita.userName} ({cita.userEmail})</span><br/>
                        <span className="text-xs">Estado: {cita.estado || 'pendiente'}</span>
                      </div>
                      {cita.estado !== 'completada' && (
                        <button className="bg-green-600 text-white px-3 py-1 rounded-md mt-2 md:mt-0" onClick={() => handleCompleteAppointment(cita.id)}>
                          Marcar como completada
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
  const isRescheduleMode = !!appointmentToReschedule;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: SERVICES[0],
    message: ''
  });
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);


  // Cargar citas desde el backend Render y actualizar cada 5 segundos
  useEffect(() => {
    const fetchCitas = () => {
      fetch('https://consultorio-taita-jajoy-1.onrender.com/api/citas')
        .then(res => res.json())
        .then(data => setBookedAppointments(data))
        .catch(err => console.error('Error al cargar citas:', err));
    };
    fetchCitas();
    const interval = setInterval(fetchCitas, 5000); // Actualiza cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isRescheduleMode && appointmentToReschedule) {
      setFormData({
        name: appointmentToReschedule.userName,
        email: appointmentToReschedule.userEmail,
        phone: appointmentToReschedule.userPhone || '',
        service: appointmentToReschedule.service,
        message: '' // Clear message as it's context-specific
      });
      setSelectedDate(''); // Clear date so user must pick a new one
      setSelectedTime('');
    } else if (currentUser) {
      setFormData(prev => ({ ...prev, name: currentUser.name, email: currentUser.email, phone: '', service: SERVICES[0], message: '' }));
      setSelectedDate('');
      setSelectedTime('');
    } else {
        setFormData({ name: '', email: '', phone: '', service: SERVICES[0], message: '' });
    }
  }, [currentUser, isRescheduleMode, appointmentToReschedule]);

  const isEmailValid = useMemo(() => {
    if (!formData.email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email);
  }, [formData.email]);

  const isPhoneValid = useMemo(() => {
    if (!formData.phone) return false;
    const cleanedPhone = formData.phone.replace(/\D/g, '');
    if (cleanedPhone.startsWith('57') && cleanedPhone.length === 12) {
      return cleanedPhone.substring(2).startsWith('3');
    }
    if (cleanedPhone.length === 10) {
      return cleanedPhone.startsWith('3');
    }
    return false;
  }, [formData.phone]);

  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    
    const slots = [];
    for (let hour = 9; hour <= 16; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, [selectedDate]);

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return [];

    const isSlotBooked = (time: string) => {
        return bookedAppointments.some(
            booked => booked.date === selectedDate && booked.time === time
        );
    };

    return timeSlots.map(time => ({
      time,
      isBooked: isSlotBooked(time)
    }));
  }, [selectedDate, timeSlots, bookedAppointments]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedTime('');
    setDateError(null);

    if (!newDate) {
      setSelectedDate('');
      return;
    }

    // Using T00:00:00 to avoid timezone interpretation issues
    const date = new Date(`${newDate}T00:00:00`);
    const dayOfWeek = date.getDay(); // 0 for Sunday, 6 for Saturday

    if (COLOMBIAN_HOLIDAYS.includes(newDate)) {
      setSelectedDate('');
      setDateError('La fecha seleccionada es un día festivo. Por favor, elige otro día.');
    } else if (dayOfWeek === 6 || dayOfWeek === 0) {
      setSelectedDate('');
      setDateError('No se agendan citas los fines de semana. Por favor, elige un día de Lunes a Viernes.');
    } else {
      setSelectedDate(newDate);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTime || isSubmitting) {
      if (!selectedTime) setFormMessage('Por favor, selecciona una hora para tu cita.');
      return;
    }
    setFormMessage('Procesando tu solicitud...');
    setIsSubmitting(true);

    const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    const formattedDate = appointmentDateTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = appointmentDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute:'2-digit' });

    let clientEmailParams: Record<string, string>;
    let doctorEmailParams: Record<string, string>;
    
    const publicKey = isRescheduleMode ? RESCHEDULE_PUBLIC_KEY : BOOKING_PUBLIC_KEY;
    const serviceID = isRescheduleMode ? RESCHEDULE_SERVICE_ID : BOOKING_SERVICE_ID;
    const clientTemplateID = isRescheduleMode ? RESCHEDULE_CLIENT_TEMPLATE_ID : BOOKING_CLIENT_TEMPLATE_ID;
    const doctorTemplateID = isRescheduleMode ? RESCHEDULE_DOCTOR_TEMPLATE_ID : BOOKING_DOCTOR_TEMPLATE_ID;

    if (isRescheduleMode && appointmentToReschedule) {
        const oldAppointmentDateTime = new Date(`${appointmentToReschedule.date}T${appointmentToReschedule.time}:00`);
        const formattedOldDate = oldAppointmentDateTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const formattedOldTime = oldAppointmentDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        clientEmailParams = {
            to_email: formData.email,
            user_name: formData.name,
            service: formData.service,
            client_phone: formData.phone,
            old_appointment_date: formattedOldDate,
            old_appointment_time: formattedOldTime,
            new_appointment_date: formattedDate,
            new_appointment_time: formattedTime,
        };

        doctorEmailParams = {
            client_name: formData.name,
            client_email: formData.email,
            client_phone: formData.phone,
            service: formData.service,
            old_appointment_date: formattedOldDate,
            old_appointment_time: formattedOldTime,
            new_appointment_date: formattedDate,
            new_appointment_time: formattedTime,
            message: formData.message || 'El cliente no dejó un mensaje.',
        };
    } else {
         clientEmailParams = {
            to_email: formData.email,
            user_name: formData.name,
            service: formData.service,
            client_phone: formData.phone,
            appointment_date: formattedDate,
            appointment_time: formattedTime,
        };

        doctorEmailParams = {
            client_name: formData.name,
            client_email: formData.email,
            client_phone: formData.phone,
            service: formData.service,
            appointment_date: formattedDate,
            appointment_time: formattedTime,
            message: formData.message || 'Ninguno',
        };
    }
    
    const emailjsOptions = { publicKey };

    window.emailjs.send(serviceID, clientTemplateID, clientEmailParams, emailjsOptions)
      .then(() => {
        return window.emailjs.send(serviceID, doctorTemplateID, doctorEmailParams, emailjsOptions);
      })
      .then(() => {
        const newAppointment: Appointment = {
          id: new Date().getTime().toString(),
          date: selectedDate,
          time: selectedTime,
          service: formData.service,
          userName: formData.name,
          userEmail: formData.email,
          userPhone: formData.phone,
        };
        
        let updatedAppointments = [...bookedAppointments];
        if (isRescheduleMode && appointmentToReschedule) {
          updatedAppointments = updatedAppointments.filter(app => app.id !== appointmentToReschedule.id);
        }
        updatedAppointments.push(newAppointment);

        localStorage.setItem('bookedAppointments', JSON.stringify(updatedAppointments));
        setBookedAppointments(updatedAppointments);
        
        if (isRescheduleMode && onRescheduleComplete) {
            setFormMessage('¡Cita reprogramada con éxito! Se ha enviado una confirmación a tu correo.');
            setTimeout(() => {
                onRescheduleComplete();
            }, 2000);
        } else {
            setFormMessage('¡Cita agendada con éxito! Se ha enviado una confirmación a tu correo.');
            setFormData(prev => ({ ...prev, name: currentUser?.name || '', service: SERVICES[0], message: '', email: currentUser?.email || '', phone: '' }));
            setSelectedDate('');
            setSelectedTime('');
            setTimeout(() => setFormMessage(null), 5000);
        }
      })
      .catch((err) => {
        console.error('EMAILJS FAILED:', JSON.stringify(err, null, 2));
        if (err && err.status === 412) {
          setFormMessage('Estamos experimentando problemas técnicos con las notificaciones por correo. Tu cita NO ha sido agendada. Por favor, contáctanos directamente por WhatsApp para asegurar tu horario. Disculpa las molestias.');
        } else {
          setFormMessage('Hubo un error al procesar la cita. Por favor, revisa los datos o contacta por WhatsApp.');
        }
        setTimeout(() => setFormMessage(null), 10000);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="appointments" className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-dark mb-2">{isRescheduleMode ? 'Reprograma tu Cita' : 'Agenda tu Cita'}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {isRescheduleMode ? `Cita actual para: ${appointmentToReschedule?.service} el ${new Date(`${appointmentToReschedule?.date}T00:00:00`).toLocaleDateString('es-ES', { month: 'long', day: 'numeric' })}. Elige una nueva fecha y hora.` : 'Elige una fecha y hora. La confirmación se enviará a tu correo.'}
            </p>
             <div className="mt-4 h-1 w-24 bg-accent mx-auto rounded-full"></div>
        </div>
        
        <div className="max-w-2xl mx-auto bg-content border border-gray-200 p-8 rounded-xl shadow-2xl shadow-primary/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
              <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} disabled={!!currentUser || isRescheduleMode} className={`w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:ring-secondary focus:border-secondary text-text-dark ${!!currentUser || isRescheduleMode ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    required 
                    value={formData.email} 
                    onChange={handleChange} 
                    disabled={!!currentUser || isRescheduleMode}
                    className={`w-full px-4 py-2 border bg-white rounded-md focus:ring-secondary focus:border-secondary text-text-dark transition-colors ${!isEmailValid && formData.email ? 'border-red-500' : 'border-gray-300'} ${!!currentUser || isRescheduleMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                  {!isEmailValid && formData.email && (
                    <p className="text-red-600 text-xs mt-1">Por favor, introduce un formato de correo válido.</p>
                  )}
                </div>
                 <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-1">Teléfono (Celular)</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    id="phone" 
                    required 
                    value={formData.phone} 
                    onChange={handleChange}
                    placeholder="Ej: 300 123 4567"
                    className={`w-full px-4 py-2 border bg-white rounded-md focus:ring-secondary focus:border-secondary text-text-dark transition-colors ${!isPhoneValid && formData.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {!isPhoneValid && formData.phone && (
                    <p className="text-red-600 text-xs mt-1">Debe ser un número colombiano válido de 10 dígitos.</p>
                  )}
                </div>
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-bold text-gray-700 mb-1">Tipo de Consulta</label>
              <select name="service" id="service" value={formData.service} onChange={handleChange} disabled={isRescheduleMode} className={`w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:ring-secondary focus:border-secondary text-text-dark ${isRescheduleMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                {SERVICES.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-bold text-gray-700 mb-1">1. Selecciona una Fecha (Lunes a Viernes)</label>
              <input type="date" name="date" id="date" required min={today} value={selectedDate} onChange={handleDateChange} className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:ring-secondary focus:border-secondary text-text-dark" />
              {dateError && (
                  <p className="text-red-600 text-xs mt-1">{dateError}</p>
              )}
            </div>
            
            {selectedDate && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">2. Selecciona una Hora (9 AM - 4 PM)</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableTimeSlots.map(({time, isBooked}) => (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => !isBooked && setSelectedTime(time)}
                          className={`p-2 rounded-md text-center text-sm font-semibold transition-colors duration-200 ${
                            isBooked 
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed line-through'
                              : selectedTime === time 
                                ? 'bg-secondary text-white ring-2 ring-offset-2 ring-offset-white ring-secondary' 
                                : 'bg-green-100 hover:bg-green-200 text-green-800'
                          }`}
                        >
                          {time}
                          {isBooked && <span className="block text-xs normal-case">No disponible</span>}
                        </button>
                    ))}
                </div>
              </div>
            )}

             <div>
              <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-1">Mensaje Adicional (opcional)</label>
              <textarea name="message" id="message" rows={3} value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:ring-secondary focus:border-secondary text-text-dark" placeholder={isRescheduleMode ? "Puedes indicar aquí el motivo de la reprogramación..." : "Cuéntanos un poco sobre lo que te gustaría tratar..."}></textarea>
            </div>

            {formMessage && (
                <p className={`text-center p-3 rounded-md text-sm ${formMessage.includes('error') || formMessage.includes('NO ha sido') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {formMessage}
                </p>
            )}

            <div>
              <button type="submit" className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-lg disabled:bg-secondary/50 disabled:cursor-not-allowed" disabled={!selectedTime || !formData.name || !isEmailValid || !isPhoneValid || isSubmitting}>
                {isSubmitting ? (isRescheduleMode ? 'Reprogramando...' : 'Agendando...') : (isRescheduleMode ? 'Confirmar Reprogramación' : 'Confirmar Cita')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Appointments;