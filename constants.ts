import { Product } from './types';

export const LOGO_URL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZGh0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRjBGNkZDIj4KICAgIDxwYXRoIGQ9Ik0xMiA1LjljMS4xNiAwIDIuMSAuOTQgMi4xIDIuMXMtLjk0IDIuMS0yLjEgMi4xUzkuOSA5LjE2IDkuOSA4cy45NC0yLjEgMi4xLTIuMW0wIDljMi45NyAwIDYuMSAxLjQ2IDYuMSAyLjF2MS4xSDUuOVYxN2MwLS42NCAzLjEzLTIuMSA2LjEtMi4xTTEyIDRDOS43OSA0IDggNS43OSA4IDhzMS43OSA0IDQgNCA0LTEuNzkgNC00LTEuNzktNC00LTR6bTAgOWMtMi42NyAwLTggMS4zNC04IDR2M2gxNnYtM2MwLTIuNjYtNS4zMy00LTgtNHoiLz4KICAgIDxwYXRoIGQ9Ik0xOS40MSw3LjQxbC0xLjgzLTEuODNsLTEuNDEsMS40MWwxLjgzLDEuODNMMTkuNDEsNy40MXogTTQuNTksNy40MWwxLjQxLTEuNDFsMS44MywxLjgzbC0xLjQxLDEuNDFMNC41OSw3LjQxeiBNMTIsMSBsLTEsMmgyTDEyLDF6Ii8+Cjwvc3ZnPg==';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Derma Hongosil',
    description: 'Fórmula mejorada para el tratamiento eficaz de durezas, callos y hongos en la piel. Aplicación tópica para una piel sana y renovada.',
    price: '$180 COL',
  imageUrl: '/productos/Derma Hongosil.jpg',
  },
  {
    id: 2,
    name: 'Pomada Alfa (Uso Veterinario)',
    description: 'Bálsamo de uso veterinario con mentol y alcanfor. Ideal para masajes, alivia el dolor y la inflamación en animales.',
    price: '$220 COL',
  imageUrl: '/productos/Pomada Alfa (Uso Veterinario) 1.jpg',
  },
  {
    id: 3,
    name: 'Pomada de Árnica, Coca y Marihuana',
    description: 'Pomada antiinflamatoria con una potente combinación de árnica, coca y marihuana. Alivio efectivo para dolores musculares y articulares.',
    price: '$350 COL',
  imageUrl: '/productos/Pomada de Árnica, Coca y Marihuana 2.jpg',
  },
  {
    id: 4,
    name: 'Jarabe de Zarzaparrilla',
    description: 'Poderoso purificador de la sangre. Jarabe energético que combate la anemia, debilidad y ayuda a limpiar el hígado y los riñones.',
    price: '$280 COL',
  imageUrl: '/productos/Jarabe de Zarzaparrilla.jpg',
  },
  {
    id: 5,
    name: 'Extracto 5 Raíces',
    description: 'Protege y fortalece tu organismo. Indicado para problemas de próstata, vías urinarias y gastritis. Un remedio 100% original del Amazonas.',
    price: '$300 COL',
  imageUrl: '/productos/Extracto 5 Raíces.jpg',
  },
  {
    id: 6,
    name: 'Cholagogue Indio del Putumayo',
    description: 'Gran depurativo de la sangre, 100% natural. Fortalece el cerebro, tonifica los nervios y estimula la digestión. Un tónico para la debilidad general.',
    price: '$290 COL',
  imageUrl: '/productos/Cholagogue Indio del Putumayo.jpg',
  },
   {
    id: 7,
    name: 'Extracto de Chuchuhuaza',
    description: 'Elaborado a base de corteza de chuchuhuaza y plantas medicinales. Especialmente formulado para aliviar los síntomas de la artritis de forma natural.',
    price: '$320 COL',
  imageUrl: '/productos/Extracto de Chuchuhuaza.jpg',
  },
];

export const SERVICES: string[] = [
  'Sobadas (lesiones y fracturas)',
  'Limpieza energética (mal de ojo)',
  'Tratamiento del "descuajo" infantil',
  'Recomendación de medicina ancestral (Yagé, plantas, pomadas)',
  'Armonización y equilibrio espiritual',
];