import { Timestamp } from 'firebase/firestore';
import { Player } from "./player";
import { Tournament } from './tournament';

export interface Game {
  id?: string;
  tournament: Tournament | null;
  opponent: string;
  date: Timestamp | null;
  runsHomeClub: number;
  runsVisiting: number;
  turnsAtBat: TurnAtBat[];
}

export interface TurnAtBat {
  player: Player | null;
  AB: number;
  H: number;
  '2B': number;
  '3B': number;
  HR: number;
  K: number;
  R: number;
  RBI: number;
  AVG?: string;
}