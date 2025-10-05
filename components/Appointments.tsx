import React, { useState, useMemo, useEffect } from 'react';
import { SERVICES, COLOMBIAN_HOLIDAYS } from '../constants';
import { Appointment } from '../types';

declare global {
  interface Window {
    emailjs: {
      init: (options: { publicKey: string }) => void;
      send: (serviceID: string, templateID: string, params: object) => Promise<{ status: number; text: string }>;
    };
  }
}

interface AppointmentsProps {
  currentUser: string | null;
  appointmentToReschedule?: Appointment | null;
  onRescheduleComplete?: () => void;
}

const Appointments: React.FC<AppointmentsProps> = ({ currentUser, appointmentToReschedule, onRescheduleComplete }) => {
  const isRescheduleMode = !!appointmentToReschedule;

  const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: SERVICES[0],
    message: ''
  });
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    const publicKey = 'SwfNz2A1pwSevQqcn';
    if (window.emailjs) {
      window.emailjs.init({ publicKey });
    }
    const storedAppointments = localStorage.getItem('bookedAppointments');
    if (storedAppointments) {
      setBookedAppointments(JSON.parse(storedAppointments));
    }
  }, []);

  useEffect(() => {
    if (isRescheduleMode && appointmentToReschedule) {
      setFormData({
        name: appointmentToReschedule.userName,
        email: appointmentToReschedule.userEmail,
        service: appointmentToReschedule.service,
        message: '' // Clear message as it's context-specific
      });
      setSelectedDate(appointmentToReschedule.date);
    } else if (currentUser) {
      setFormData(prev => ({ ...prev, email: currentUser, name: '', service: SERVICES[0], message: '' }));
      setSelectedDate('');
      setSelectedTime('');
    }
  }, [currentUser, isRescheduleMode, appointmentToReschedule]);

  const isEmailValid = useMemo(() => {
    if (!formData.email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email);
  }, [formData.email]);

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
  
  const isDateDisabled = (dateString: string): boolean => {
    if (!dateString) return false;

    const [year, month, day] = dateString.split('-').map(Number);
    // JavaScript's Date month is 0-indexed (0-11)
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();

    // Check for weekends (Sunday is 0, Saturday is 6)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return true;
    }

    // Check for holidays
    if (COLOMBIAN_HOLIDAYS.includes(dateString)) {
      return true;
    }

    return false;
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (isDateDisabled(newDate)) {
        setDateError('El Taita no atiende los fines de semana ni festivos. Por favor, elige otra fecha.');
        setSelectedDate('');
        setSelectedTime('');
    } else {
        setDateError(null);
        setSelectedDate(newDate);
        setSelectedTime('');
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
    const formattedDate = appointmentDateTime.toLocaleDateString('es-ES');
    const formattedTime = appointmentDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute:'2-digit' });
    
    const clientEmailParams = {
      to_email: formData.email,
      user_name: formData.name,
      service: formData.service,
      appointment_date: formattedDate,
      appointment_time: formattedTime,
    };

    const doctorEmailParams = {
        client_name: formData.name,
        client_email: formData.email,
        service: formData.service,
        appointment_date: formattedDate,
        appointment_time: formattedTime,
        message: formData.message || 'Ninguno',
    };

    const serviceID = 'service_jp5auoj';
    const clientTemplateID = 'template_2bio6kd';
    const doctorTemplateID = 'template_v9tvb5r';

    window.emailjs.send(serviceID, clientTemplateID, clientEmailParams)
      .then(() => {
        return window.emailjs.send(serviceID, doctorTemplateID, doctorEmailParams);
      })
      .then(() => {
        const newAppointment: Appointment = {
          id: new Date().getTime().toString(),
          date: selectedDate,
          time: selectedTime,
          service: formData.service,
          userName: formData.name,
          userEmail: formData.email,
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
            setFormData(prev => ({ ...prev, name: '', service: SERVICES[0], message: '', email: currentUser || '' }));
            setSelectedDate('');
            setSelectedTime('');
            setTimeout(() => setFormMessage(null), 5000);
        }
      })
      .catch((err) => {
        console.error('EMAILJS FAILED:', JSON.stringify(err, null, 2));
        setFormMessage('Hubo un error al procesar la cita. Por favor, revisa los datos o contacta por WhatsApp.');
        setTimeout(() => setFormMessage(null), 10000);
      })
      .finally(() => {
          if (!isRescheduleMode) {
            setIsSubmitting(false);
          }
      });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="appointments" className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-light mb-2">{isRescheduleMode ? 'Reprograma tu Cita' : 'Agenda tu Cita'}</h2>
            <p className="text-lg text-text-light/70 max-w-3xl mx-auto">
                {isRescheduleMode ? 'Elige una nueva fecha y hora para tu consulta.' : 'Elige una fecha y hora. La confirmación se enviará a tu correo.'}
            </p>
             <div className="mt-4 h-1 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>
        
        <div className="max-w-2xl mx-auto bg-primary/20 border border-primary/50 p-8 rounded-xl shadow-2xl shadow-primary/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-text-light/80 mb-1">Nombre Completo</label>
                  <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} disabled={isRescheduleMode} className={`w-full px-4 py-2 border bg-background border-primary/50 rounded-md focus:ring-secondary focus:border-secondary text-text-light ${isRescheduleMode ? 'bg-gray-700/50 cursor-not-allowed' : ''}`} />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-text-light/80 mb-1">Correo Electrónico</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    required 
                    value={formData.email} 
                    onChange={handleChange} 
                    disabled={!!currentUser || isRescheduleMode}
                    className={`w-full px-4 py-2 border bg-background rounded-md focus:ring-secondary focus:border-secondary text-text-light transition-colors ${!isEmailValid && formData.email ? 'border-secondary' : 'border-primary/50'} ${!!currentUser || isRescheduleMode ? 'bg-gray-700/50 cursor-not-allowed' : ''}`}
                  />
                  {!isEmailValid && formData.email && (
                    <p className="text-secondary text-xs mt-1">Por favor, introduce un formato de correo válido.</p>
                  )}
                </div>
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-bold text-text-light/80 mb-1">Tipo de Consulta</label>
              <select name="service" id="service" value={formData.service} onChange={handleChange} disabled={isRescheduleMode} className={`w-full px-4 py-2 border bg-background border-primary/50 rounded-md focus:ring-secondary focus:border-secondary text-text-light ${isRescheduleMode ? 'bg-gray-700/50 cursor-not-allowed' : ''}`}>
                {SERVICES.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-bold text-text-light/80 mb-1">1. Selecciona una Fecha</label>
              <input type="date" name="date" id="date" required min={today} value={selectedDate} onChange={handleDateChange} className="w-full px-4 py-2 border bg-background border-primary/50 rounded-md focus:ring-secondary focus:border-secondary text-text-light" />
              {dateError && (
                    <p className="text-secondary text-xs mt-1">{dateError}</p>
              )}
            </div>
            
            {selectedDate && (
              <div>
                <label className="block text-sm font-bold text-text-light/80 mb-2">2. Selecciona una Hora (9 AM - 4 PM)</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableTimeSlots.map(({time, isBooked}) => (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => !isBooked && setSelectedTime(time)}
                          className={`p-2 rounded-md text-center text-sm font-semibold transition-colors duration-200 ${
                            isBooked 
                              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed line-through'
                              : selectedTime === time 
                                ? 'bg-secondary text-white ring-2 ring-offset-2 ring-offset-background ring-secondary' 
                                : 'bg-primary hover:bg-primary/70 text-text-light'
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
              <label htmlFor="message" className="block text-sm font-bold text-text-light/80 mb-1">Mensaje Adicional (opcional)</label>
              <textarea name="message" id="message" rows={3} value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border bg-background border-primary/50 rounded-md focus:ring-secondary focus:border-secondary text-text-light" placeholder="Cuéntanos un poco sobre lo que te gustaría tratar..."></textarea>
            </div>

            {formMessage && (
                <p className={`text-center p-3 rounded-md text-sm ${formMessage.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-accent/20 text-accent'}`}>
                    {formMessage}
                </p>
            )}

            <div>
              <button type="submit" className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-lg disabled:bg-secondary/50 disabled:cursor-not-allowed" disabled={!selectedTime || !formData.name || !isEmailValid || isSubmitting}>
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