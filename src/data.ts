import { Guest } from './types';

export const INITIAL_GUESTS: Guest[] = [
  // Groom Side (Tafadzwa)
  { id: '1', name: 'Mr. Tonderai Dube (Groom Father)', side: 'groom', catalog: 'Mutoko Guests', createdAt: Date.now() - 15000 },
  { id: '2', name: 'Mrs. Rudo Dube (Groom Mother)', side: 'groom', catalog: 'Mutoko Guests', createdAt: Date.now() - 14000 },
  { id: '3', name: 'Farai Dube (Best Man)', side: 'groom', catalog: 'Harare Guests', createdAt: Date.now() - 13000 },
  { id: '4', name: 'Simbarashe Moyo', side: 'groom', catalog: 'Mutoko Guests', createdAt: Date.now() - 12000 },
  { id: '5', name: 'Tendai Zhou', side: 'groom', catalog: 'Harare Guests', createdAt: Date.now() - 11000 },
  { id: '11', name: 'Uncle Tapiwa Dube', side: 'groom', catalog: 'Mutoko Guests', createdAt: Date.now() - 10500 },
  { id: '12', name: 'Tatenda Mupfumi', side: 'groom', catalog: 'Harare Guests', createdAt: Date.now() - 10000 },
  { id: '13', name: 'Blessing Chidzikwe', side: 'groom', catalog: 'Family Friends', createdAt: Date.now() - 9500 },
  { id: '14', name: 'Pastor K. Gumbo', side: 'groom', catalog: 'Family Friends', createdAt: Date.now() - 9000 },

  // Bride Side (Chengeto)
  { id: '6', name: 'Mr. Kudzai Shumba (Bride Father)', side: 'bride', catalog: 'Village Guests', createdAt: Date.now() - 8000 },
  { id: '7', name: 'Mrs. Chipo Shumba (Bride Mother)', side: 'bride', catalog: 'Village Guests', createdAt: Date.now() - 7000 },
  { id: '8', name: 'Nyasha Shumba (Maid of Honor)', side: 'bride', catalog: 'Harare Guests', createdAt: Date.now() - 6000 },
  { id: '9', name: 'Tariro Ndlovu', side: 'bride', catalog: 'Mutoko Guests', createdAt: Date.now() - 5000 },
  { id: '10', name: 'Vimbai Mutasa', side: 'bride', catalog: 'Village Guests', createdAt: Date.now() - 4000 },
  { id: '15', name: 'Sekuru Shumba', side: 'bride', catalog: 'Village Guests', createdAt: Date.now() - 3500 },
  { id: '16', name: 'Chido Machingura', side: 'bride', catalog: 'Harare Guests', createdAt: Date.now() - 3000 },
  { id: '17', name: 'Ropafadzo Gumbo', side: 'bride', catalog: 'Mutoko Guests', createdAt: Date.now() - 2500 },
  { id: '18', name: 'Mai Rumbidzai', side: 'bride', catalog: 'Family Friends', createdAt: Date.now() - 2000 },
];
