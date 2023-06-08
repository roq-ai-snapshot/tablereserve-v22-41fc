import { RestaurantInterface } from 'interfaces/restaurant';

export interface OperatingHourInterface {
  id?: string;
  restaurant_id: string;
  day_of_week: number;
  start_time: Date;
  end_time: Date;
  created_at?: Date;
  updated_at?: Date;

  restaurant?: RestaurantInterface;
  _count?: {};
}
