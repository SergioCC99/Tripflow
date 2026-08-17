export type TripStatus = 'ongoing' | 'upcoming' | 'completed';

export interface Trip {
  id: string;
  destination: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  spentAmount: number;
  status: TripStatus;
}
