import React from 'react';

interface WhatsAppButtonProps {
    phoneNumber: string;
    message?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber, message = "Hola, tengo una pregunta sobre sus servicios." }) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ease-in-out"
            aria-label="Contactar por WhatsApp"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
            >
                <path
                    d="M16.6 14.2c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.7-.8.9-.1.1-.3.1-.5 0-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6s0-.3.1-.4c.1-.1.2-.2.4-.4.1-.1.2-.2.3-.4.1-.2 0-.3-.1-.4s-.7-1.7-.9-2.3c-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.4-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.1 1.5 2.3 3.6 3.2.5.2.9.4 1.2.5.5.2 1 .1 1.3-.1.4-.2.7-.8.9-1s.2-.4.1-.6-.2-.3-.4-.4zm3.5-9.1c-1.5-1.5-3.4-2.3-5.5-2.3-4.3 0-7.8 3.5-7.8 7.8 0 1.4.4 2.7 1.1 3.9l-1.3 4.6 4.8-1.3c1.1.6 2.4 1 3.7 1h.1c4.3 0 7.8-3.5 7.8-7.8.1-2.1-.7-4-2.2-5.5zm-5.5 12.8c-1.2 0-2.4-.3-3.4-1l-.2-.1-2.5.7.7-2.4-.2-.3c-.8-1-1.2-2.3-1.2-3.6 0-3.6 2.9-6.5 6.5-6.5 1.7 0 3.3.7 4.6 1.9s1.9 2.9 1.9 4.6c0 3.6-2.9 6.5-6.5 6.5z"
                />
            </svg>
        </a>
    );
};

export default WhatsAppButton;