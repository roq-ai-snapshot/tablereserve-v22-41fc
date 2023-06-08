const mapping: Record<string, string> = {
  'customer-preferences': 'customer_preference',
  'operating-hours': 'operating_hour',
  reservations: 'reservation',
  restaurants: 'restaurant',
  'table-layouts': 'table_layout',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
