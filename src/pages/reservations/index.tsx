import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link, IconButton } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getReservations, deleteReservationById } from 'apiSdk/reservations';
import { ReservationInterface } from 'interfaces/reservation';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { useRouter } from 'next/router';
import { FiTrash, FiEdit2 } from 'react-icons/fi';

function ReservationListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<ReservationInterface[]>(
    () => '/reservations',
    () =>
      getReservations({
        relations: ['user', 'restaurant', 'table_layout'],
      }),
  );
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteReservationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (id: string) => {
    if (hasAccess('reservation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/reservations/view/${id}`);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Reservation
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('reservation', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/reservations/create`}>
            <Button colorScheme="blue" mr="4">
              Create
            </Button>
          </Link>
        )}
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>date</Th>
                  <Th>time</Th>
                  <Th>number_of_guests</Th>
                  <Th>status</Th>
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>user</Th>}
                  {hasAccess('restaurant', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>restaurant</Th>}
                  {hasAccess('table_layout', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>table_layout</Th>
                  )}

                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr cursor="pointer" onClick={() => handleView(record.id)} key={record.id}>
                    <Td>{record.date as unknown as string}</Td>
                    <Td>{record.time as unknown as string}</Td>
                    <Td>{record.number_of_guests}</Td>
                    <Td>{record.status}</Td>
                    {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/users/view/${record.user?.id}`}>
                          {record.user?.email}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('restaurant', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/restaurants/view/${record.restaurant?.id}`}>
                          {record.restaurant?.name}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('table_layout', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/table-layouts/view/${record.table_layout?.id}`}>
                          {record.table_layout?.name}
                        </Link>
                      </Td>
                    )}

                    <Td>
                      {hasAccess('reservation', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                        <Td>
                          <NextLink href={`/reservations/edit/${record.id}`} passHref legacyBehavior>
                            <Button
                              onClick={(e) => e.stopPropagation()}
                              mr={2}
                              as="a"
                              variant="outline"
                              colorScheme="blue"
                              leftIcon={<FiEdit2 />}
                            >
                              Edit
                            </Button>
                          </NextLink>
                          {hasAccess('reservation', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(record.id);
                              }}
                              colorScheme="red"
                              variant="outline"
                              aria-label="edit"
                              icon={<FiTrash />}
                            />
                          )}
                        </Td>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'reservation',
  operation: AccessOperationEnum.READ,
})(ReservationListPage);
