import axios from 'axios';
import { IP } from '../types/IP';

const BASE_URL = 'https://geolocation-db.com/json/';

export const getCurrentIP = () => {
  return axios.get<IP>(BASE_URL)
    .then(response => response.data)
    .catch((error) => {
      throw new Error(error);
    });
};
