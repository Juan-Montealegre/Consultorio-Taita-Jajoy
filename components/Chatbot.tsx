import React, { useState, useRef, useEffect } from 'react';
import useChat from '../hooks/useChat';
import ChatbotIcon from './ChatbotIcon';
import YachayAvatar from './YachayAvatar';
import MarkdownRenderer from './MarkdownRenderer';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const { messages, isLoading, error, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSendMessage = (text: string) => {
    if (!text.trim() || isLoading) return;
    sendMessage(text);
    setUserInput('');
    if (showSuggestions) {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(userInput);
  };
  
  const suggestionPrompts = [
    "¿Qué servicios ofrecen?",
    "¿Qué es la sobada?",
    "Háblame de un producto para la piel"
  ];

  return (
    <>
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 bg-secondary text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ease-in-out"
        aria-label="Abrir asistente virtual"
      >
        <ChatbotIcon />
      </button>

      <div className={`fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm h-[70vh] max-h-[600px] bg-content border-2 border-primary/20 rounded-xl shadow-2xl flex flex-col font-sans overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-background border-b border-primary/20 flex-shrink-0">
          <h3 className="text-lg font-bold text-text-dark font-serif">Asistente Virtual Yachay</h3>
          <button onClick={handleToggle} className="text-gray-500 hover:text-secondary text-3xl font-light leading-none">&times;</button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && <YachayAvatar />}
              <div
                className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-secondary text-white rounded-br-none' 
                    : 'bg-gray-100 text-text-dark rounded-bl-none'
                }`}
              >
                {msg.role === 'model' ? <MarkdownRenderer text={msg.text} /> : <p className="whitespace-pre-wrap">{msg.text}</p>}
              </div>
            </div>
          ))}
          {showSuggestions && messages.length === 1 && !isLoading && (
            <div className="flex flex-col items-center gap-2 pt-4">
              <p className="text-sm text-text-dark">O prueba una de estas preguntas:</p>
              {suggestionPrompts.map(prompt => (
                <button 
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full text-left bg-gray-100 hover:bg-gray-200 text-text-dark text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
           {isLoading && (
            <div className="flex items-end gap-2.5 justify-start">
              <YachayAvatar />
              <div className="bg-gray-100 text-text-dark px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-content border-t border-primary/20 flex-shrink-0">
           {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 px-4 py-2 border bg-gray-100 border-gray-300 rounded-full focus:ring-secondary focus:border-secondary text-text-dark"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-secondary hover:bg-secondary/80 text-white font-bold p-2.5 rounded-full transition-colors duration-300 disabled:bg-secondary/50"
              disabled={isLoading || !userInput.trim()}
              aria-label="Enviar mensaje"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;