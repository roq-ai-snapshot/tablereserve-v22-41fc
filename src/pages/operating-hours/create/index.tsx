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
import { createOperatingHour } from 'apiSdk/operating-hours';
import { Error } from 'components/error';
import { operatingHourValidationSchema } from 'validationSchema/operating-hours';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { RestaurantInterface } from 'interfaces/restaurant';
import { getRestaurants } from 'apiSdk/restaurants';
import { OperatingHourInterface } from 'interfaces/operating-hour';

function OperatingHourCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: OperatingHourInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createOperatingHour(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<OperatingHourInterface>({
    initialValues: {
      day_of_week: 0,
      start_time: new Date(new Date().toDateString()),
      end_time: new Date(new Date().toDateString()),
      restaurant_id: (router.query.restaurant_id as string) ?? null,
    },
    validationSchema: operatingHourValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Operating Hour
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="day_of_week" mb="4" isInvalid={!!formik.errors?.day_of_week}>
            <FormLabel>Day Of Week</FormLabel>
            <NumberInput
              name="day_of_week"
              value={formik.values?.day_of_week}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('day_of_week', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.day_of_week && <FormErrorMessage>{formik.errors?.day_of_week}</FormErrorMessage>}
          </FormControl>
          <FormControl id="start_time" mb="4">
            <FormLabel>Start Time</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.start_time}
              onChange={(value: Date) => formik.setFieldValue('start_time', value)}
            />
          </FormControl>
          <FormControl id="end_time" mb="4">
            <FormLabel>End Time</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.end_time}
              onChange={(value: Date) => formik.setFieldValue('end_time', value)}
            />
          </FormControl>
          <AsyncSelect<RestaurantInterface>
            formik={formik}
            name={'restaurant_id'}
            label={'Select Restaurant'}
            placeholder={'Select Restaurant'}
            fetcher={getRestaurants}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
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
  entity: 'operating_hour',
  operation: AccessOperationEnum.CREATE,
})(OperatingHourCreatePage);
