import React from 'react';
import { PRODUCTS } from '../constants';
import ProductCard from './ProductCard';

const Products: React.FC = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-light mb-2">Nuestro Catálogo de Productos</h2>
          <p className="text-lg text-text-light/70 max-w-3xl mx-auto">
            Elaborados con ingredientes naturales y sabiduría ancestral para tu bienestar.
          </p>
           <div className="mt-4 h-1 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;