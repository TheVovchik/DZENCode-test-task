/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext, FC, useEffect, useState,
} from 'react';
import axios from 'axios';
import { getComments } from '../../api/comments';
import { Comment } from '../../types/Comment';
import { getCurrentIP } from '../../api/ip';
import { Order, SortBy } from '../../types/SortBy';

type Props = {
  children: React.ReactNode;
};

type Context = {
  loading: boolean,
  comments: Comment[],
  commentsLoadingError: boolean,
  sortBy: SortBy,
  order: Order,
  ip: string,
  refreshComments: () => void,
  changeSortingType: (type: SortBy) => void,
};

export const CommentsContext = createContext<Context>({
  loading: false,
  comments: [],
  commentsLoadingError: false,
  sortBy: SortBy.NONE,
  order: Order.ASC,
  ip: '',
  refreshComments: () => {},
  changeSortingType: () => {},
});

export const CommentsProvider: FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoadingError, setCommentsLoadingError] = useState(false);
  const [ip, setIp] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.NONE);
  const [order, setOrder] = useState<Order>(Order.ASC);

  const loadComments = async () => {
    setLoading(true);

    try {
      const commentsFromApi = await getComments();

      setCommentsLoadingError(false);
      setComments(commentsFromApi);
      setLoading(false);
    } catch (error) {
      setCommentsLoadingError(true);
      setLoading(false);

      if (axios.isAxiosError(error)) {
        throw error;
      } else {
        throw new Error('different error than axios');
      }
    }
  };

  const loadIP = async () => {
    try {
      const currentIp = await getCurrentIP();

      setIp(currentIp.IPv4);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      } else {
        throw new Error('different error than axios');
      }
    }
  };

  const refreshComments = () => {
    loadComments();
  };

  const changeSortingType = (type: SortBy) => {
    setSortBy(type);
  };

  useEffect(() => {
    loadIP();
    loadComments();
  }, []);

  const contextValue = {
    loading,
    comments,
    commentsLoadingError,
    sortBy,
    order,
    ip,
    refreshComments,
    changeSortingType,
  };

  return (
    <CommentsContext.Provider value={contextValue}>
      {children}
    </CommentsContext.Provider>
  );
};
