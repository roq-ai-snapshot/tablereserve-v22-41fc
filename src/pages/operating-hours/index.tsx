import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link, IconButton } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getOperatingHours, deleteOperatingHourById } from 'apiSdk/operating-hours';
import { OperatingHourInterface } from 'interfaces/operating-hour';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { useRouter } from 'next/router';
import { FiTrash, FiEdit2 } from 'react-icons/fi';

function OperatingHourListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<OperatingHourInterface[]>(
    () => '/operating-hours',
    () =>
      getOperatingHours({
        relations: ['restaurant'],
      }),
  );
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteOperatingHourById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (id: string) => {
    if (hasAccess('operating_hour', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/operating-hours/view/${id}`);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Operating Hour
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('operating_hour', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/operating-hours/create`}>
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
                  <Th>day_of_week</Th>
                  <Th>start_time</Th>
                  <Th>end_time</Th>
                  {hasAccess('restaurant', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>restaurant</Th>}

                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr cursor="pointer" onClick={() => handleView(record.id)} key={record.id}>
                    <Td>{record.day_of_week}</Td>
                    <Td>{record.start_time as unknown as string}</Td>
                    <Td>{record.end_time as unknown as string}</Td>
                    {hasAccess('restaurant', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/restaurants/view/${record.restaurant?.id}`}>
                          {record.restaurant?.name}
                        </Link>
                      </Td>
                    )}

                    <Td>
                      {hasAccess('operating_hour', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                        <Td>
                          <NextLink href={`/operating-hours/edit/${record.id}`} passHref legacyBehavior>
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
                          {hasAccess('operating_hour', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'operating_hour',
  operation: AccessOperationEnum.READ,
})(OperatingHourListPage);
