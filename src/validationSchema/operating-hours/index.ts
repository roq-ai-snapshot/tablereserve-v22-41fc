import * as yup from 'yup';

export const operatingHourValidationSchema = yup.object().shape({
  day_of_week: yup.number().integer().required(),
  start_time: yup.date().required(),
  end_time: yup.date().required(),
  restaurant_id: yup.string().nullable().required(),
});
