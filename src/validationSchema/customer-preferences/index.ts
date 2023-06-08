import * as yup from 'yup';

export const customerPreferenceValidationSchema = yup.object().shape({
  preference_type: yup.string().required(),
  preference_value: yup.string().required(),
  customer_id: yup.string().nullable().required(),
});
