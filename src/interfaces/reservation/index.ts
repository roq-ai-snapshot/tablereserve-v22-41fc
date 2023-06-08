import { UserInterface } from 'interfaces/user';
import { RestaurantInterface } from 'interfaces/restaurant';
import { TableLayoutInterface } from 'interfaces/table-layout';

export interface ReservationInterface {
  id?: string;
  customer_id: string;
  restaurant_id: string;
  table_layout_id: string;
  date: Date;
  time: Date;
  number_of_guests: number;
  status: string;
  created_at?: Date;
  updated_at?: Date;

  user?: UserInterface;
  restaurant?: RestaurantInterface;
  table_layout?: TableLayoutInterface;
  _count?: {};
}
