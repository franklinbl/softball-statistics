import { Timestamp } from 'firebase/firestore';

export interface Tournament {
  id?: string;
  name: string;
  active: boolean;
  startDate: Timestamp | null;
  endDate: Timestamp | null;
}