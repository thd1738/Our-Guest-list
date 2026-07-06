import { Guest } from './types';

export const INITIAL_GUESTS: Guest[] = [
  // Groom Side (Tafadzwa)
  { id: '1', name: 'Mr. Tonderai Dube (Groom Father)', side: 'groom', createdAt: Date.now() - 10000 },
  { id: '2', name: 'Mrs. Rudo Dube (Groom Mother)', side: 'groom', createdAt: Date.now() - 9000 },
  { id: '3', name: 'Farai Dube (Best Man)', side: 'groom', createdAt: Date.now() - 8000 },
  { id: '4', name: 'Simbarashe Moyo', side: 'groom', createdAt: Date.now() - 7000 },
  { id: '5', name: 'Tendai Zhou', side: 'groom', createdAt: Date.now() - 6000 },

  // Bride Side (Chengeto)
  { id: '6', name: 'Mr. Kudzai Shumba (Bride Father)', side: 'bride', createdAt: Date.now() - 5000 },
  { id: '7', name: 'Mrs. Chipo Shumba (Bride Mother)', side: 'bride', createdAt: Date.now() - 4000 },
  { id: '8', name: 'Nyasha Shumba (Maid of Honor)', side: 'bride', createdAt: Date.now() - 3000 },
  { id: '9', name: 'Tariro Ndlovu', side: 'bride', createdAt: Date.now() - 2000 },
  { id: '10', name: 'Vimbai Mutasa', side: 'bride', createdAt: Date.now() - 1000 },
];
