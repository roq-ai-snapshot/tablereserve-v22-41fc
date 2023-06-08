import * as yup from 'yup';
import { operatingHourValidationSchema } from 'validationSchema/operating-hours';
import { reservationValidationSchema } from 'validationSchema/reservations';
import { tableLayoutValidationSchema } from 'validationSchema/table-layouts';

export const restaurantValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  image: yup.string(),
  location: yup.string().required(),
  user_id: yup.string().nullable().required(),
  operating_hour: yup.array().of(operatingHourValidationSchema),
  reservation: yup.array().of(reservationValidationSchema),
  table_layout: yup.array().of(tableLayoutValidationSchema),
});
