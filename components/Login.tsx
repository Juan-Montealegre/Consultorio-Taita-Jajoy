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

  const handleCredentialResponse = (response: any) => {
    const idToken = response.credential;
    const payload = decodeJwtResponse(idToken);

    if (payload) {
      let tipo = 'paciente';
      if (payload.email === 'taitajajoya@gmail.com') {
        tipo = 'admin';
      } else if (payload.email === 'taitajajoy@gmail.com') {
        tipo = 'taita';
      }
      const user: User = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        tipo,
      };
      onLogin(user);
    } else {
       setError("No se pudo verificar la información de inicio de sesión. Por favor, intenta de nuevo.");
    }
  };

  useEffect(() => {
     if (!process.env.GOOGLE_CLIENT_ID) {
        setError("El inicio de sesión con Google no está configurado. El administrador debe añadir el GOOGLE_CLIENT_ID.");
        return;
    }

    const initializeGsi = () => {
      if (window.google && signInButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.GOOGLE_CLIENT_ID,
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
      // If not, wait for it.
      // FIX: Cast the result of querySelector to HTMLScriptElement to access the onload property.
      const script = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        script.onload = initializeGsi;
      }
    }

  }, [onLogin]);

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto bg-content border border-gray-200 p-8 rounded-xl shadow-2xl shadow-primary/10">
          <h2 className="text-3xl font-serif font-bold text-center text-text-dark mb-4">Iniciar Sesión</h2>
          <p className="text-center text-gray-600 mb-8">
            Usa tu cuenta de Google para ver y gestionar tus citas.
          </p>
          <div className="flex justify-center">
            <div ref={signInButtonRef}></div>
          </div>
          {error && (
            <p className="text-red-600 text-xs mt-4 text-center">{error}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Login;