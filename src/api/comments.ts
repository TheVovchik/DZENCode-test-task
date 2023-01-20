import axios from 'axios';
import { Comment } from '../types/Comment';

const BASE_URL = 'https://dzen-task.onrender.com/v1/data';

export const postComment = (comment: FormData) => {
  return axios.post(
    `${BASE_URL}`,
    comment,
  )
    .then(response => response.data)
    .catch((error) => {
      throw new Error(error);
    });
};

export const getComments = () => {
  return axios.get<Comment[]>(BASE_URL)
    .then(response => response.data)
    .catch((error) => {
      throw new Error(error);
    });
};

export const patchComment = (
  id: number, rating: number, newVotes: string[],
) => {
  return axios.patch<Comment>(`${BASE_URL}/${id}`, { rating, newVotes })
    .then(response => response.data)
    .catch((error) => {
      throw new Error(error);
    });
};
