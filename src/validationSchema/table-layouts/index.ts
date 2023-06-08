import * as yup from 'yup';
import { reservationValidationSchema } from 'validationSchema/reservations';

export const tableLayoutValidationSchema = yup.object().shape({
  name: yup.string().required(),
  capacity: yup.number().integer().required(),
  restaurant_id: yup.string().nullable().required(),
  reservation: yup.array().of(reservationValidationSchema),
});
