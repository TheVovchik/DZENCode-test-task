import axios from 'axios';
import { Captcha } from '../types/Captcha';

const BASE_URL = 'https://dzen-task.onrender.com/data';

export const generateCaptcha = async () => {
  return axios.get<Captcha>(`${BASE_URL}/captcha`)
    .then(response => response.data)
    .catch(() => {
      throw new Error();
    });
};
