import React, { useEffect, useRef, useState } from 'react';
import { User } from '../types';

// Extend the Window interface to include the google object from the GSI library
declare global {
  interface Window {
    google: any;
  }
}

interface LoginProps {
  onLogin: (user: User) => void;
}

function decodeJwtResponse(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT", error);
    return null;
  }
}


const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const signInButtonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleCredentialResponse = (response: any) => {
    const idToken = response.credential;
    const payload = decodeJwtResponse(idToken);

    if (payload) {
      const user: User = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
      onLogin(user);
    } else {
       setError("No se pudo verificar la información de inicio de sesión. Por favor, intenta de nuevo.");
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico.');
      return;
    }
    const user: User = {
      email,
      name: name || email.split('@')[0],
      picture: '',
    };
    onLogin(user);
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError("Error de Configuración: La clave 'VITE_GOOGLE_CLIENT_ID' no se ha añadido a los 'Secrets' del proyecto. Por favor, sigue las INSTRUCCIONES.md para activar el inicio de sesión.");
      return;
    }

    const initializeGsi = () => {
      if (window.google && signInButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse
        });
        window.google.accounts.id.renderButton(
          signInButtonRef.current,
          { theme: "outline", size: "large", type: "standard", text: "signin_with", locale: "es" }
        );
      }
    };

    // Check if the script has loaded
    if (window.google) {
      initializeGsi();
    } else {
      const script = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        script.onload = initializeGsi;
      }
    }

  }, [onLogin]);

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto bg-primary/20 border border-primary/50 p-8 rounded-xl shadow-2xl shadow-primary/10">
          <h2 className="text-3xl font-serif font-bold text-center text-text-light mb-4">Iniciar Sesión</h2>
          <p className="text-center text-text-light/70 mb-8">
            Usa tu cuenta de Google o ingresa tu correo para ver y gestionar tus citas.
          </p>
          <form onSubmit={handleManualLogin} className="mb-6">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold mb-1 text-text-light">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-primary/50 bg-background text-text-light focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-semibold mb-1 text-text-light">Nombre (opcional)</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-primary/50 bg-background text-text-light focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Tu nombre"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold py-2 rounded-lg transition-colors duration-300"
            >
              Ingresar con correo
            </button>
          </form>
          <div className="flex justify-center mb-2">
            <div ref={signInButtonRef}></div>
          </div>
          {error && (
            <p className="text-secondary text-xs mt-4 text-center">{error}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Login;