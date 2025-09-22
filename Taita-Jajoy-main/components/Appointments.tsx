import React, { useState, useMemo } from 'react';
import { SERVICES } from '../constants';

const Appointments: React.FC = () => {
  // Mock de citas ya agendadas. En una aplicación real, esto vendría de una base de datos.
  const [bookedAppointments, setBookedAppointments] = useState<Date[]>([
    // Ejemplo: new Date('2024-08-15T10:00:00')
  ]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: SERVICES[0],
    message: ''
  });
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const isEmailValid = useMemo(() => {
    if (!formData.email) return false;
    // Simple regex for email validation
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
    setSelectedTime(''); // Reset time when date changes
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTime) {
      setFormMessage('Por favor, selecciona una hora para tu cita.');
      return;
    }
    setFormMessage('Procesando tu solicitud...');

    // --- Simulación de envío de correo ---
    setTimeout(() => {
        const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

        // Añadir a las citas agendadas
        setBookedAppointments(prev => [...prev, appointmentDateTime]);
      
        // Mensaje para el usuario
        const userEmail = {
            to: formData.email,
            subject: 'Confirmación de tu cita con Taita Jajoy',
            body: `Hola ${formData.name},\n\nTu cita para "${formData.service}" ha sido agendada para el ${appointmentDateTime.toLocaleDateString('es-ES')} a las ${appointmentDateTime.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}.\n\nNos vemos pronto.\n\nSaludos,\nConsultorio Taita Jajoy`
        };

        // Mensaje para el médico
        const doctorEmail = {
            to: 'juandavidmomtealegre@gmail.com',
            subject: `Nueva cita agendada: ${formData.service}`,
            body: `Se ha agendado una nueva cita:\n\nNombre: ${formData.name}\nCorreo: ${formData.email}\nServicio: ${formData.service}\nFecha y Hora: ${appointmentDateTime.toLocaleString('es-ES')}\nMensaje: ${formData.message || 'Ninguno'}`
        };

        console.log("--- CORREO SIMULADO PARA EL USUARIO ---", userEmail);
        console.log("--- CORREO SIMULADO PARA EL MÉDICO ---", doctorEmail);

        setFormMessage('¡Cita agendada con éxito! Se ha enviado una confirmación a tu correo y una notificación al consultorio.');
        
        // Resetear formulario
        setFormData({ name: '', email: '', service: SERVICES[0], message: '' });
        setSelectedDate('');
        setSelectedTime('');
        setTimeout(() => setFormMessage(null), 5000); // Limpiar mensaje después de 5 seg
    }, 1500);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="appointments" className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-light mb-2">Agenda tu Cita</h2>
            <p className="text-lg text-text-light/70 max-w-3xl mx-auto">
                Elige una fecha y hora. La confirmación se enviará a tu correo.
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

            {formMessage && <p className="text-center text-accent bg-accent/20 p-3 rounded-md">{formMessage}</p>}

            <div>
              <button type="submit" className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-lg disabled:bg-secondary/50 disabled:cursor-not-allowed" disabled={!selectedTime || !formData.name || !isEmailValid}>
                Confirmar Cita
              </button>
            </div>
            <p className="text-xs text-center text-text-light/60">* El envío de correos es una simulación. Para una implementación real se necesita un servicio de backend.</p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Appointments;