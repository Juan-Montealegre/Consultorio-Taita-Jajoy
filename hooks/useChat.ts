import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { PRODUCTS, SERVICES } from '../constants';
import { ChatMessage } from '../types';

const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    const initializeChat = () => {
      try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY is not set");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const productList = PRODUCTS.map(p => `- ${p.name}: ${p.description} Precio: ${p.price}`).join('\n');
        const serviceList = SERVICES.join(', ');

        const systemInstruction = `Eres un asistente virtual amable y servicial para el "Consultorio del Taita Jajoy", un centro de medicina ancestral. Tu nombre es "Yachay", que significa "sabiduría" en quechua. Tu propósito es ayudar a los usuarios a conocer los servicios y productos, y a resolver sus dudas.

        **Reglas de Formato:**
        - Utiliza Markdown para dar formato a tus respuestas.
        - Usa **texto en negrita** para resaltar nombres de productos, servicios o conceptos clave.
        - Usa listas con un asterisco (*) para enumerar elementos, como los servicios o los ingredientes de un producto.

        **Información Clave:**
        - **Taita Jajoy:** Es un médico tradicional del Putumayo, heredero de un linaje de curanderos. Ofrece sanación a través del conocimiento ancestral de plantas y energías.
        - **Servicios Ofrecidos:** ${serviceList}.
        - **Productos Disponibles:**
        ${productList}
        - **Para agendar una cita:** El usuario debe hacer clic en el botón "Agendar Cita". No puedes agendar citas por ellos. Debes guiarlos a usar el botón.
        - **Para comprar productos:** El usuario debe hacer clic en el botón "Más Información" en la página de productos para ser redirigido a WhatsApp. No puedes procesar compras.
        - **Tono:** Sé respetuoso, cálido y utiliza un lenguaje claro y sencillo. Puedes usar emojis de forma sutil para ser más amigable (🌿, ✨, 🙏).
        - **Prohibido:** No des consejos médicos, diagnósticos ni prescribas tratamientos. Siempre recomienda que para asuntos de salud, agenden una consulta con el Taita. No respondas preguntas que no estén relacionadas con el consultorio, sus productos o la medicina ancestral. Si te preguntan algo fuera de tema, amablemente redirige la conversación.

        **Inicio de la conversación:**
        Saluda al usuario cálidamente, preséntate como Yachay y pregunta en qué puedes ayudarle hoy.`;

        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction,
          },
        });

        setMessages([{
          role: 'model',
          text: '¡Hola! Soy Yachay 🌿, tu asistente virtual del Consultorio del Taita Jajoy. ¿En qué puedo ayudarte hoy? ✨'
        }]);
      } catch (e) {
        console.error("Error initializing chat:", e);
        setError("No se pudo iniciar el asistente virtual.");
      }
    };

    initializeChat();
  }, []);

  const sendMessage = async (userInput: string) => {
    if (!userInput.trim() || !chatRef.current || isLoading) return;

    setIsLoading(true);
    setError(null);
    const userMessage: ChatMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: userInput });

      let botResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        botResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = botResponse;
          return newMessages;
        });
      }
    } catch (e) {
      console.error("Error sending message:", e);
      const errorMessage = "Lo siento, ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde. 🙏";
      setError(errorMessage);
      setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages[newMessages.length - 1].role === 'model' && newMessages[newMessages.length - 1].text === '') {
              newMessages.pop();
          }
          return [...newMessages, { role: 'model', text: errorMessage }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, error, sendMessage };
};

export default useChat;