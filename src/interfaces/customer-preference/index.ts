import { UserInterface } from 'interfaces/user';

export interface CustomerPreferenceInterface {
  id?: string;
  customer_id: string;
  preference_type: string;
  preference_value: string;
  created_at?: Date;
  updated_at?: Date;

  user?: UserInterface;
  _count?: {};
}
