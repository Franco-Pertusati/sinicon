import { WineRecord } from "./wineRecord";

export interface Shift {
  id: string;
  openedAt: Date;
  closedAt: Date | null;
  orders: WineRecord[];
  isOpen: boolean;
}