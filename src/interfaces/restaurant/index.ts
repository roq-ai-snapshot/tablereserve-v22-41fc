import { OperatingHourInterface } from 'interfaces/operating-hour';
import { ReservationInterface } from 'interfaces/reservation';
import { TableLayoutInterface } from 'interfaces/table-layout';
import { UserInterface } from 'interfaces/user';

export interface RestaurantInterface {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  location: string;
  created_at?: Date;
  updated_at?: Date;
  user_id: string;
  operating_hour?: OperatingHourInterface[];
  reservation?: ReservationInterface[];
  table_layout?: TableLayoutInterface[];
  user?: UserInterface;
  _count?: {
    operating_hour?: number;
    reservation?: number;
    table_layout?: number;
  };
}
