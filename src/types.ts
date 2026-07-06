export type GuestSide = 'groom' | 'bride';

export interface Guest {
  id: string;
  name: string;
  side: GuestSide;
  createdAt: number;
}

export type ViewState = 'home' | 'groom' | 'bride';
