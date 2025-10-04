import React, { useState, useMemo } from 'react';
import { SERVICES } from '../constants';

// Declara emailjs en el ámbito global para que TypeScript lo reconozca
declare global {
    interface Window {
        emailjs: any;
    }
}

const Appointments: React.FC = () => {
  // --- CONFIGURACIÓN DE EMAILJS ---
  // Reemplaza estos valores con tus propias credenciales de EmailJS
  const SERVICE_ID = 'service_jp5auoj';
  const TEMPLATE_ID = 'template_e6gmbmo';
  const PUBLIC_KEY = 'SwfNz2A1pwSevQqcn';
  // ---------------------------------

  const [bookedAppointments, setBookedAppointments] = useState<Date[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: SERVICES[0],
    message: ''
  });
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const isEmailValid = useMemo(() => {
    if (!formData.email) return true; // No mostrar error si está vacío
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
        const appointmentDateTime = new Date(`${selectedDate}T${time}:00`);
        return bookedAppointments.some(
            booked => new Date(booked).getTime() === appointmentDateTime.getTime()
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
    setSelectedDate(e.target.value);
    setSelectedTime('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTime) {
      setFormMessage('Por favor, selecciona una hora para tu cita.');
      setFormStatus('error');
      return;
    }
    setFormStatus('sending');
    setFormMessage('Enviando confirmación...');

    const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    const templateParams = {
        user_name: formData.name,
        user_email: formData.email,
        service: formData.service,
        message: formData.message,
        appointment_date: appointmentDateTime.toLocaleDateString('es-ES'),
        appointment_time: appointmentDateTime.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'}),
    };

    try {
        await window.emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        
        setBookedAppointments(prev => [...prev, appointmentDateTime]);
        setFormMessage('¡Cita agendada con éxito! Se ha enviado una notificación al consultorio.');
        setFormStatus('success');
        
        // Resetear formulario
        setFormData({ name: '', email: '', service: SERVICES[0], message: '' });
        setSelectedDate('');
        setSelectedTime('');
        setTimeout(() => {
            setFormMessage(null);
            setFormStatus('idle');
        }, 5000);

    } catch (error: any) {
        console.error('Error al enviar el correo:', error);
        let errorMessage = 'Hubo un error al enviar la confirmación. Por favor, intenta de nuevo más tarde.';
        
        // EmailJS a menudo devuelve un objeto con status y text
        if (error && error.text) {
            console.error('Respuesta de EmailJS:', error.text);
            errorMessage = 'No se pudo agendar la cita. Verifica la configuración del servicio de correo e inténtalo de nuevo.';
        }
        
        setFormMessage(errorMessage);
        setFormStatus('error');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  
  const getMessageStyles = () => {
      switch (formStatus) {
          case 'success':
              return 'text-accent bg-accent/20';
          case 'error':
              return 'text-red-400 bg-red-500/20';
          case 'sending':
              return 'text-blue-400 bg-blue-500/20';
          default:
              return '';
      }
  }

  return (
    <section id="appointments" className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-light mb-2">Agenda tu Cita</h2>
            <p className="text-lg text-text-light/70 max-w-3xl mx-auto">
                Elige una fecha y hora. La confirmación se enviará al correo del consultorio.
            </p>
             <div className="mt-4 h-1 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>
        
        <div className="max-w-2xl mx-auto bg-primary/20 border border-primary/50 p-8 rounded-xl shadow-2xl shadow-primary/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-text-light/80 mb-1">Nombre Completo</label>
                  <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border bg-background border-primary/50 rounded-md focus:ring-secondary focus:border-secondary text-text-light" />
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
                    className={`w-full px-4 py-2 border bg-background rounded-md focus:ring-secondary focus:border-secondary text-text-light transition-colors ${!isEmailValid && formData.email ? 'border-secondary' : 'border-primary/50'}`} 
                  />
                  {!isEmailValid && formData.email && (
                    <p className="text-secondary text-xs mt-1">Por favor, introduce un formato de correo válido.</p>
                  )}
                </div>
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-bold text-text-light/80 mb-1">Tipo de Consulta</label>
              <select name="service" id="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-2 border bg-background border-primary/50 rounded-md focus:ring-secondary focus:border-secondary text-text-light">
                {SERVICES.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-bold text-text-light/80 mb-1">1. Selecciona una Fecha</label>
              <input type="date" name="date" id="date" required min={today} value={selectedDate} onChange={handleDateChange} className="w-full px-4 py-2 border bg-background border-primary/50 rounded-md focus:ring-secondary focus:border-secondary text-text-light" />
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

            {formMessage && <p className={`text-center p-3 rounded-md ${getMessageStyles()}`}>{formMessage}</p>}

            <div>
              <button type="submit" className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-lg disabled:bg-secondary/50 disabled:cursor-not-allowed" disabled={!selectedTime || !formData.name || !isEmailValid || formStatus === 'sending'}>
                {formStatus === 'sending' ? 'Confirmando...' : 'Confirmar Cita'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Appointments;