import axios from 'axios';
import queryString from 'query-string';
import { OperatingHourInterface } from 'interfaces/operating-hour';
import { GetQueryInterface } from '../../interfaces';

export const getOperatingHours = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/operating-hours${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createOperatingHour = async (operatingHour: OperatingHourInterface) => {
  const response = await axios.post('/api/operating-hours', operatingHour);
  return response.data;
};

export const updateOperatingHourById = async (id: string, operatingHour: OperatingHourInterface) => {
  const response = await axios.put(`/api/operating-hours/${id}`, operatingHour);
  return response.data;
};

export const getOperatingHourById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/operating-hours/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteOperatingHourById = async (id: string) => {
  const response = await axios.delete(`/api/operating-hours/${id}`);
  return response.data;
};
