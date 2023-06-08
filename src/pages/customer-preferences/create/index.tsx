import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createCustomerPreference } from 'apiSdk/customer-preferences';
import { Error } from 'components/error';
import { customerPreferenceValidationSchema } from 'validationSchema/customer-preferences';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { CustomerPreferenceInterface } from 'interfaces/customer-preference';

function CustomerPreferenceCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CustomerPreferenceInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCustomerPreference(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CustomerPreferenceInterface>({
    initialValues: {
      preference_type: '',
      preference_value: '',
      customer_id: (router.query.customer_id as string) ?? null,
    },
    validationSchema: customerPreferenceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Customer Preference
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="preference_type" mb="4" isInvalid={!!formik.errors?.preference_type}>
            <FormLabel>Preference Type</FormLabel>
            <Input
              type="text"
              name="preference_type"
              value={formik.values?.preference_type}
              onChange={formik.handleChange}
            />
            {formik.errors.preference_type && <FormErrorMessage>{formik.errors?.preference_type}</FormErrorMessage>}
          </FormControl>
          <FormControl id="preference_value" mb="4" isInvalid={!!formik.errors?.preference_value}>
            <FormLabel>Preference Value</FormLabel>
            <Input
              type="text"
              name="preference_value"
              value={formik.values?.preference_value}
              onChange={formik.handleChange}
            />
            {formik.errors.preference_value && <FormErrorMessage>{formik.errors?.preference_value}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'customer_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'customer_preference',
  operation: AccessOperationEnum.CREATE,
})(CustomerPreferenceCreatePage);
