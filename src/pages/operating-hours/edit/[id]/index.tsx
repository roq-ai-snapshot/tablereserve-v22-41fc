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
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getOperatingHourById, updateOperatingHourById } from 'apiSdk/operating-hours';
import { Error } from 'components/error';
import { operatingHourValidationSchema } from 'validationSchema/operating-hours';
import { OperatingHourInterface } from 'interfaces/operating-hour';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { RestaurantInterface } from 'interfaces/restaurant';
import { getRestaurants } from 'apiSdk/restaurants';

function OperatingHourEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OperatingHourInterface>(
    () => (id ? `/operating-hours/${id}` : null),
    () => getOperatingHourById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: OperatingHourInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateOperatingHourById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<OperatingHourInterface>({
    initialValues: data,
    validationSchema: operatingHourValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Operating Hour
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'operating_hour',
  operation: AccessOperationEnum.UPDATE,
})(OperatingHourEditPage);
