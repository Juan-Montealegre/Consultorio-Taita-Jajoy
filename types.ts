
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  service: string;
  userName: string;
  userEmail: string;
}