import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmailValid(email)) {
      setError('');
      onLogin(email);
    } else {
      setError('Por favor, introduce un formato de correo válido.');
    }
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto bg-primary/20 border border-primary/50 p-8 rounded-xl shadow-2xl shadow-primary/10">
          <h2 className="text-3xl font-serif font-bold text-center text-text-light mb-4">Iniciar Sesión</h2>
          <p className="text-center text-text-light/70 mb-8">
            Ingresa con tu correo para ver y gestionar tus citas.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-text-light/80 mb-1">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 border bg-background rounded-md focus:ring-secondary focus:border-secondary text-text-light transition-colors ${error ? 'border-secondary' : 'border-primary/50'}`}
                placeholder="tu.correo@ejemplo.com"
              />
              {error && (
                  <p className="text-secondary text-xs mt-1">{error}</p>
              )}
            </div>
            <div>
              <button type="submit" className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-lg">
                Ingresar
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;