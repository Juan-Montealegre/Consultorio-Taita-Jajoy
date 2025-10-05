import { Product } from './types';

export const LOGO_URL = '/logo/Logo.png';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Derma Hongosil',
    description: 'Fórmula mejorada para el tratamiento eficaz de durezas, callos y hongos en la piel. Aplicación tópica para una piel sana y renovada.',
    price: '$25.000 COL',
  imageUrl: '/productos/Derma Hongosil.jpg',
  },
  {
    id: 2,
    name: 'Pomada Alfa (Uso Veterinario)',
    description: 'Bálsamo de uso veterinario con mentol y alcanfor. Ideal para masajes, alivia el dolor y la inflamación en animales.',
    price: '$35.000 COL',
  imageUrl: '/productos/Pomada Alfa (Uso Veterinario) 1.jpg',
  },
  {
    id: 3,
    name: 'Pomada de Árnica, Coca y Marihuana',
    description: 'Pomada antiinflamatoria con una potente combinación de árnica, coca y marihuana. Alivio efectivo para dolores musculares y articulares.',
    price: '$35.000 COL',
  imageUrl: '/productos/Pomada de Árnica, Coca y Marihuana 2.jpg',
  },
  {
    id: 4,
    name: 'Jarabe de Zarzaparrilla',
    description: 'Poderoso purificador de la sangre. Jarabe energético que combate la anemia, debilidad y ayuda a limpiar el hígado y los riñones.',
    price: '$80.000 COL',
  imageUrl: '/productos/Jarabe de Zarzaparrilla.jpg',
  },
  {
    id: 5,
    name: 'Extracto 5 Raíces',
    description: 'Protege y fortalece tu organismo. Indicado para problemas de próstata, vías urinarias y gastritis. Un remedio 100% original del Amazonas.',
    price: '$80.000 COL',
  imageUrl: '/productos/Extracto 5 Raíces.jpg',
  },
  {
    id: 6,
    name: 'Cholagogue Indio del Putumayo',
    description: 'Gran depurativo de la sangre, 100% natural. Fortalece el cerebro, tonifica los nervios y estimula la digestión. Un tónico para la debilidad general.',
    price: '$80.000 COL',
  imageUrl: '/productos/Cholagogue Indio del Putumayo.jpg',
  },
   {
    id: 7,
    name: 'Extracto de Chuchuhuaza',
    description: 'Elaborado a base de corteza de chuchuhuaza y plantas medicinales. Especialmente formulado para aliviar los síntomas de la artritis de forma natural.',
    price: '$80.000 COL',
  imageUrl: '/productos/Extracto de Chuchuhuaza.jpg',
  },
    {
    id: 8,
    name: 'Purgante Vegetal Balsam',
    description: 'Expulsor 100% natural de toda clase de parásitos. Limpia y desintoxica el hígado, ayudando a restaurar el equilibrio digestivo. Elaborado por Indio del Putumayo.',
    price: '$15.000 COL',
    imageUrl: '/productos/Purgante Vegetal Balsam.jpg',
  },
];

export const SERVICES: string[] = [
  'Sobadas (lesiones y fracturas)',
  'Limpieza energética (mal de ojo)',
  'Tratamiento del "descuajo" infantil',
  'Recomendación de medicina ancestral (Yagé, plantas, pomadas)',
  'Armonización y equilibrio espiritual',
  'Consulta personalizada',
  
];

export const COLOMBIAN_HOLIDAYS: string[] = [
  // 2024
  '2024-01-01', '2024-01-08', '2024-03-25', '2024-03-28', '2024-03-29',
  '2024-05-01', '2024-05-13', '2024-06-03', '2024-06-10', '2024-07-01',
  '2024-07-20', '2024-08-07', '2024-08-19', '2024-10-14', '2024-11-04',
  '2024-11-11', '2024-12-08', '2024-12-25',
  // 2025
  '2025-01-01', '2025-01-06', '2025-03-24', '2025-04-17', '2025-04-18',
  '2025-05-01', '2025-06-02', '2025-06-23', '2025-06-30', '2025-07-20',
  '2025-08-07', '2025-08-18', '2025-10-13', '2025-11-03', '2025-11-17',
  '2025-12-08', '2025-12-25',
];

// --- EmailJS Credentials ---
// IMPORTANT: Replace placeholder values with your actual credentials.

// For new appointments (original account)
export const BOOKING_PUBLIC_KEY = 'SwfNz2A1pwSevQqcn';
export const BOOKING_SERVICE_ID = 'service_jp5auoj';
export const BOOKING_CLIENT_TEMPLATE_ID = 'template_2bio6kd';
export const BOOKING_DOCTOR_TEMPLATE_ID = 'template_v9tvb5r';

// For rescheduling appointments (new account)
export const RESCHEDULE_PUBLIC_KEY = '1aaoP1DXLYLilqJig'; 
export const RESCHEDULE_SERVICE_ID = 'service_c9mn2vl'; 
export const RESCHEDULE_CLIENT_TEMPLATE_ID = 'template_vm8vyox';
export const RESCHEDULE_DOCTOR_TEMPLATE_ID = 'template_la74c23';

// For cancelling appointments (new account)
export const CANCEL_PUBLIC_KEY = 'j77WUmbGakr8qsWCR'; // Can be the same as reschedule key if from the same account
export const CANCEL_SERVICE_ID = 'service_gnp3r16'; // Can be the same as reschedule ID if from the same account
export const CANCEL_CLIENT_TEMPLATE_ID = 'template_qk6r8in';
export const CANCEL_DOCTOR_TEMPLATE_ID = 'template_t2gbcyn';