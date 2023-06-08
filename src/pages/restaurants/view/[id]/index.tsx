import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2 } from 'react-icons/fi';
import { getRestaurantById } from 'apiSdk/restaurants';
import { Error } from 'components/error';
import { RestaurantInterface } from 'interfaces/restaurant';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteOperatingHourById } from 'apiSdk/operating-hours';
import { deleteReservationById } from 'apiSdk/reservations';
import { deleteTableLayoutById } from 'apiSdk/table-layouts';

function RestaurantViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RestaurantInterface>(
    () => (id ? `/restaurants/${id}` : null),
    () =>
      getRestaurantById(id, {
        relations: ['user', 'operating_hour', 'reservation', 'table_layout'],
      }),
  );

  const operating_hourHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteOperatingHourById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const reservationHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteReservationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const table_layoutHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteTableLayoutById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Restaurant Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Name:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.name}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Description:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.description}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Image:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.image}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Location:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.location}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Created At:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.created_at as unknown as string}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Updated At:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.updated_at as unknown as string}
            </Text>
            <br />
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  User:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                    {data?.user?.email}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('operating_hour', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Operating Hours:
                </Text>
                <NextLink passHref href={`/operating-hours/create?restaurant_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>day_of_week</Th>
                        <Th>start_time</Th>
                        <Th>end_time</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.operating_hour?.map((record) => (
                        <Tr
                          cursor="pointer"
                          onClick={() => router.push(`/operating-hours/view/${record.id}`)}
                          key={record.id}
                        >
                          <Td>{record.day_of_week}</Td>
                          <Td>{record.start_time as unknown as string}</Td>
                          <Td>{record.end_time as unknown as string}</Td>
                          <Td>
                            <NextLink passHref href={`/operating-hours/edit/${record.id}`}>
                              <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                Edit
                              </Button>
                            </NextLink>
                            <IconButton
                              onClick={() => operating_hourHandleDelete(record.id)}
                              colorScheme="red"
                              variant="outline"
                              aria-label="edit"
                              icon={<FiTrash />}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('reservation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Reservations:
                </Text>
                <NextLink passHref href={`/reservations/create?restaurant_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>date</Th>
                        <Th>time</Th>
                        <Th>number_of_guests</Th>
                        <Th>status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.reservation?.map((record) => (
                        <Tr
                          cursor="pointer"
                          onClick={() => router.push(`/reservations/view/${record.id}`)}
                          key={record.id}
                        >
                          <Td>{record.date as unknown as string}</Td>
                          <Td>{record.time as unknown as string}</Td>
                          <Td>{record.number_of_guests}</Td>
                          <Td>{record.status}</Td>
                          <Td>
                            <NextLink passHref href={`/reservations/edit/${record.id}`}>
                              <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                Edit
                              </Button>
                            </NextLink>
                            <IconButton
                              onClick={() => reservationHandleDelete(record.id)}
                              colorScheme="red"
                              variant="outline"
                              aria-label="edit"
                              icon={<FiTrash />}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('table_layout', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Table Layouts:
                </Text>
                <NextLink passHref href={`/table-layouts/create?restaurant_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>name</Th>
                        <Th>capacity</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.table_layout?.map((record) => (
                        <Tr
                          cursor="pointer"
                          onClick={() => router.push(`/table-layouts/view/${record.id}`)}
                          key={record.id}
                        >
                          <Td>{record.name}</Td>
                          <Td>{record.capacity}</Td>
                          <Td>
                            <NextLink passHref href={`/table-layouts/edit/${record.id}`}>
                              <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                Edit
                              </Button>
                            </NextLink>
                            <IconButton
                              onClick={() => table_layoutHandleDelete(record.id)}
                              colorScheme="red"
                              variant="outline"
                              aria-label="edit"
                              icon={<FiTrash />}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'restaurant',
  operation: AccessOperationEnum.READ,
})(RestaurantViewPage);
