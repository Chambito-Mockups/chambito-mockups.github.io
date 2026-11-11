import { ShipPay } from '../commission';
// Mock data for Chambito Market (Tienda), taken from "Chambito Market.dc.html".
// Prices are in guaraníes; Argentina shows them ÷ 10 (the brief's AR example: Gs. 350.000 → $ 35.000).
import { Country } from '../data';

export type Category = 'Ropa' | 'Tecnología' | 'Deportes' | 'Hogar' | 'Otros';
export const CATEGORIES: Category[] = ['Ropa', 'Tecnología', 'Deportes', 'Hogar', 'Otros'];
export const CATEGORY_ICON: Record<Category, string> = { Ropa: 'tag', Tecnología: 'phone', Deportes: 'flag', Hogar: 'home', Otros: 'more' };

/** Category attributes for Publicar 2 (they change with the category). */
export const CATEGORY_ATTRS: Record<Category, { sub: string; attrs: string[] }> = {
  Ropa: { sub: 'Ropa › Abrigos', attrs: ['Talle', 'Marca', 'Color'] },
  Tecnología: { sub: 'Tecnología › Celulares', attrs: ['Marca', 'Memoria', 'Color'] },
  Deportes: { sub: 'Deportes › Bicicletas', attrs: ['Rodado', 'Talle', 'Marca'] },
  Hogar: { sub: 'Hogar › Electrodomésticos', attrs: ['Marca', 'Capacidad', 'Medidas'] },
  Otros: { sub: 'Otros', attrs: ['Marca'] },
};

export interface Seller {
  id: string;
  name: string;
  initials: string;
  rating: string;
  reviews: number;
  since: string;
  listings: number;
  sold: number;
  responds: string;
  /** perfil de negocio */
  biz: string;
  rubro: string;
  about: string;
  hours: string;
}

export const SELLERS: Record<string, Seller> = {
  carla: { id: 'carla', name: 'Carla Benítez', initials: 'CB', rating: '4,9', reviews: 23, since: 'ago. 2026', listings: 12, sold: 8, responds: '1 h', biz: 'Bici Lambaré', rubro: 'Bicicletas y hogar', about: 'Bicicletas usadas revisadas, repuestos y algunas cosas de la casa. Te ayudo a elegir el rodado.', hours: 'Lun a sáb · 8:00 a 18:00' },
  diego: { id: 'diego', name: 'Diego Ortiz', initials: 'DO', rating: '5,0', reviews: 11, since: 'sep. 2026', listings: 4, sold: 2, responds: '3 h', biz: 'Ortiz Muebles', rubro: 'Muebles y hogar', about: 'Sillas, escritorios y electrodomésticos chicos, usados y en buen estado.', hours: 'Lun a sáb · 8:00 a 17:00' },
  ana: { id: 'ana', name: 'Ana Rolón', initials: 'AR', rating: '4,8', reviews: 31, since: 'jul. 2026', listings: 9, sold: 14, responds: '30 min', biz: 'Rolón Tecnología', rubro: 'Celulares y bicis', about: 'Celulares revisados con garantía de 30 días. Te muestro la batería antes de comprar.', hours: 'Lun a sáb · 9:00 a 20:00' },
  marcos: { id: 'marcos', name: 'Marcos Vera', initials: 'MV', rating: '4,7', reviews: 6, since: 'oct. 2026', listings: 3, sold: 1, responds: '2 h', biz: 'Vera Usados', rubro: 'Ropa y niños', about: 'Ropa y cosas de chicos que ya no usamos, todo lavado y revisado.', hours: 'Sáb y dom · 9:00 a 13:00' },
};

export interface Listing {
  id: string;
  title: string;
  price: number; // Gs.
  oldPrice?: number;
  zone: string;
  zoneAR: string;
  km: number;
  condition: 'Nuevo' | 'Usado';
  category: Category;
  attrs: [string, string][];
  description: string;
  seller: string;
  photos: number;
  ph: 0 | 1 | 2;
  status: 'activa' | 'vendida' | 'no-disponible' | 'error';
  recent?: boolean;
  /** unidades disponibles; con 0 se ve «Sin stock» */
  stock?: number;
  /** quién paga el envío */
  ship?: ShipPay;
}

export const LISTINGS: Listing[] = [
  { id: 'trek', title: 'Bicicleta Trek rodado 29, cambios Shimano', price: 1450000, zone: 'Lambaré', zoneAR: 'Palermo', km: 3, condition: 'Usado', category: 'Deportes', attrs: [['Rodado', '29'], ['Marca', 'Trek'], ['Talle', 'M']], description: 'Poco uso, cambios Shimano de 21 velocidades. Incluye luces delanteras y traseras.', seller: 'carla', photos: 5, ph: 0, status: 'activa' },
  { id: 'nike', title: 'Zapatillas Nike Air talle 42, sin uso', price: 350000, zone: 'Asunción', zoneAR: 'Almagro', km: 1, condition: 'Nuevo', category: 'Ropa', attrs: [['Talle', '42'], ['Marca', 'Nike'], ['Color', 'Blanco']], description: 'Me quedaron chicas. Las usé una sola vez, en caja original.', seller: 'carla', photos: 4, ph: 2, status: 'activa' },
  { id: 'silla', title: 'Silla de oficina ergonómica con apoyabrazos', price: 650000, zone: 'San Lorenzo', zoneAR: 'Caballito', km: 6, condition: 'Usado', category: 'Hogar', attrs: [['Marca', 'Ergo'], ['Material', 'Malla'], ['Color', 'Negro']], description: 'Regulable en altura y respaldo. Una ruedita tiene un rayón, funciona perfecto.', seller: 'diego', photos: 3, ph: 2, status: 'activa' },
  { id: 'iphone', title: 'iPhone 12 de 128 GB, batería al 86 %', price: 2900000, zone: 'Asunción', zoneAR: 'Recoleta', km: 2, condition: 'Usado', category: 'Tecnología', attrs: [['Memoria', '128 GB'], ['Batería', '86 %'], ['Color', 'Negro']], description: 'Siempre con funda y vidrio templado. Con caja y cargador.', seller: 'ana', photos: 6, ph: 1, status: 'vendida', recent: true },
  { id: 'campera', title: 'Campera de jean talle M', price: 180000, oldPrice: 220000, zone: 'Fdo. de la Mora', zoneAR: 'Villa Crespo', km: 4, condition: 'Usado', category: 'Ropa', attrs: [['Talle', 'M'], ['Marca', 'Levi’s'], ['Color', 'Celeste']], description: 'Jean grueso, sin detalles. Ideal para el invierno.', seller: 'marcos', photos: 3, ph: 1, status: 'activa', recent: true },
  { id: 'caloi', title: 'Bicicleta playera Caloi, canasto incluido', price: 780000, zone: 'Asunción', zoneAR: 'Almagro', km: 2, condition: 'Usado', category: 'Deportes', attrs: [['Rodado', '26'], ['Marca', 'Caloi'], ['Talle', 'Único']], description: 'Ideal para pasear. Incluye canasto y candado.', seller: 'diego', photos: 4, ph: 1, status: 'activa', recent: true },
  { id: 'spec', title: 'Mountain bike Specialized rodado 27,5', price: 2300000, zone: 'San Lorenzo', zoneAR: 'Caballito', km: 6, condition: 'Usado', category: 'Deportes', attrs: [['Rodado', '27,5'], ['Marca', 'Specialized'], ['Talle', 'L']], description: 'Frenos hidráulicos, suspensión delantera. Service hecho en octubre.', seller: 'ana', photos: 5, ph: 0, status: 'activa' },
  { id: 'nino', title: 'Bicicleta de niño rodado 16 con rueditas', price: 290000, zone: 'Luque', zoneAR: 'Núñez', km: 9, condition: 'Usado', category: 'Deportes', attrs: [['Rodado', '16'], ['Marca', 'Milano'], ['Talle', 'Niño']], description: 'Para 4 a 6 años. Con rueditas que se sacan.', seller: 'marcos', photos: 2, ph: 2, status: 'activa' },
  { id: 'heladera', title: 'Heladera Tokyo 300 L, frío seco', price: 1900000, zone: 'Luque', zoneAR: 'Núñez', km: 9, condition: 'Usado', category: 'Hogar', attrs: [['Capacidad', '300 L'], ['Marca', 'Tokyo'], ['Frío', 'Seco']], description: 'Funciona perfecto. La vendo porque me mudo.', seller: 'carla', photos: 4, ph: 0, status: 'activa' },
  { id: 'ventilador', title: 'Ventilador de pie Tokyo, 3 velocidades', price: 220000, zone: 'Itauguá', zoneAR: 'San Isidro', km: 31, condition: 'Nuevo', category: 'Hogar', attrs: [['Marca', 'Tokyo'], ['Velocidades', '3'], ['Color', 'Blanco']], description: 'Nuevo, en caja. Regalo repetido.', seller: 'diego', photos: 2, ph: 1, status: 'activa' },
  { id: 'gone', title: 'Mesa de comedor de madera para 6', price: 1200000, zone: 'Asunción', zoneAR: 'Belgrano', km: 3, condition: 'Usado', category: 'Hogar', attrs: [['Material', 'Madera'], ['Lugares', '6'], ['Medidas', '1,8 m']], description: '', seller: 'ana', photos: 3, ph: 0, status: 'no-disponible' },
  { id: 'broken', title: 'Parlante JBL Flip 5', price: 420000, zone: 'Asunción', zoneAR: 'Recoleta', km: 2, condition: 'Usado', category: 'Tecnología', attrs: [['Marca', 'JBL']], description: '', seller: 'ana', photos: 1, ph: 2, status: 'error' },
];

// stock y envío de cada publicación (los elige el vendedor al publicar)
const STOCK: Record<string, number> = { trek: 1, nike: 3, silla: 2, campera: 1, caloi: 1, spec: 1, nino: 2, heladera: 1, ventilador: 0 };
const SHIP: Record<string, ShipPay> = { nike: 'vendedor', campera: 'vendedor', ventilador: 'vendedor', iphone: 'vendedor' };
LISTINGS.forEach((l) => { l.stock = STOCK[l.id] ?? 1; l.ship = SHIP[l.id] ?? 'comprador'; });

/** Neighborhood + distance, by country. */
export const zoneLabel = (l: Listing, c: Country) => `${c === 'PY' ? l.zone : l.zoneAR} · a ${l.km} km`;
export const priceFor = (gs: number, c: Country) => (c === 'PY' ? gs : Math.round(gs / 10 / 100) * 100);

export type MyStatus = 'Activas' | 'Pausadas' | 'En revisión' | 'Vendidas' | 'Rechazadas';
export const MY_TABS: MyStatus[] = ['Activas', 'Pausadas', 'En revisión', 'Vendidas', 'Rechazadas'];

export interface MyListing {
  id: string;
  title: string;
  price: number;
  status: MyStatus;
  views: number;
  questions: number;
  ph: 0 | 1 | 2;
  reason?: string;
  rejectedOn?: string;
  /** unidades disponibles (el vendedor las cambia en Mis publicaciones) */
  stock?: number;
}

export const MY_LISTINGS: MyListing[] = [
  { id: 'm1', title: 'Bicicleta Trek rodado 29, cambios Shimano', price: 1450000, status: 'Activas', views: 128, questions: 4, ph: 0, stock: 1 },
  { id: 'm2', title: 'Zapatillas Nike Air talle 42, sin uso', price: 350000, status: 'Activas', views: 56, questions: 1, ph: 2, stock: 3 },
  { id: 'm3', title: 'Silla de oficina ergonómica con apoyabrazos', price: 650000, status: 'Activas', views: 12, questions: 0, ph: 2, stock: 0 },
  { id: 'm4', title: 'Lámpara de pie nórdica', price: 240000, status: 'Pausadas', views: 30, questions: 2, ph: 1 },
  { id: 'm5', title: 'Mochila Samsonite para notebook', price: 310000, status: 'En revisión', views: 0, questions: 0, ph: 0 },
  { id: 'm6', title: 'Monitor Samsung 24"', price: 890000, status: 'Vendidas', views: 210, questions: 9, ph: 1 },
  { id: 'm7', title: 'Raqueta de pádel Bullpadel', price: 450000, status: 'Vendidas', views: 88, questions: 3, ph: 2 },
  { id: 'm8', title: 'Cafetera Oster', price: 160000, status: 'Vendidas', views: 41, questions: 1, ph: 0 },
  { id: 'm9', title: 'Campera de jean talle M', price: 180000, status: 'Rechazadas', views: 0, questions: 0, ph: 1, reason: 'la foto de portada muestra otro producto.', rejectedOn: '3 nov.' },
];

export interface ChatMsg {
  from: 'me' | 'them' | 'system';
  text: string;
  time?: string;
}

export const QUICK_REPLIES = ['¿Sigue disponible?', '¿Último precio?', '¿Dónde se retira?'];

export const CONSULTAS = [
  { listing: 'trek', who: 'carla', last: 'Sí, está disponible. Podemos vernos…', time: '15:05', unread: 1 },
  { listing: 'silla', who: 'diego', last: 'Vos: ¿Me la guardás hasta el sábado?', time: 'Ayer', unread: 0 },
  { listing: 'iphone', who: 'ana', last: 'Ya se vendió, gracias por consultar.', time: 'Lun', unread: 0 },
];

export const REPORT_REASONS = ['Es un producto prohibido', 'Posible estafa', 'Está en la categoría equivocada', 'Es ofensivo', 'Es falsificado', 'Otro motivo'];
