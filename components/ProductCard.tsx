import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const phoneNumber = "573022236861";
  const message = `Hola, estoy interesado/a en el producto "${product.name}". Me gustaría recibir más información, incluyendo dónde puedo comprarlo. Gracias.`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-content border border-gray-200 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col group">
      <div className="relative h-56">
        <img className="w-full h-full object-cover" src={product.imageUrl} alt={product.name} />
         <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold font-serif text-text-dark mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm flex-grow">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-primary">{product.price}</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary text-white text-sm font-bold py-2 px-4 rounded-full hover:bg-secondary/80 transition-colors duration-300"
          >
            Más Información
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;