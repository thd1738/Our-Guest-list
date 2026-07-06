export type GuestSide = 'groom' | 'bride';

export interface Guest {
  id: string;
  name: string;
  side: GuestSide;
  catalog?: string; // e.g., 'Mutoko Guests', 'Harare Guests', 'Village Guests', 'Family Friends'
  createdAt: number;
}

export type ViewState = 'home' | 'groom' | 'bride';
