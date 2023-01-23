/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-loop-func */
import {
  createContext, FC, useEffect, useState,
} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getComments } from '../../api/comments';
import { Comment } from '../../types/Comment';
import { getCurrentIP } from '../../api/ip';
import { CommentCard } from '../CommentCard';

type Props = {
  children: React.ReactNode;
};

type Context = {
  readyComments: JSX.Element[][],
  commentsLoadingError: boolean,
  refreshComments: () => void,
};

export const CommentsContext = createContext<Context>({
  readyComments: [],
  commentsLoadingError: false,
  refreshComments: () => {},
});

export const CommentsProvider: FC<Props> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [readyComments, setReadyComments] = useState<JSX.Element[][]>([]);
  const [commentsLoadingError, setCommentsLoadingError] = useState(false);
  const [ip, setIp] = useState('');

  const loadComments = async () => {
    try {
      const commentsFromApi = await getComments();

      setCommentsLoadingError(false);
      setComments(commentsFromApi);
    } catch (error) {
      setCommentsLoadingError(true);

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

  const parseComments = () => {
    const parsedComments: JSX.Element[][] = [];

    comments.forEach((comment, _index, fullData) => {
      if (comment.prevId === null) {
        const initialMargin = 0;
        const buffer: JSX.Element[] = [];
        const path = [];

        buffer.push(
          <CommentCard
            margin={`${initialMargin}`}
            commentData={comment}
            ip={ip}
            key={uuidv4()}
          />,
        );

        if (comment.nextIds) {
          path.push(comment.nextIds);
          let currentId = path[path.length - 1].shift();

          while (currentId !== 0) {
            const current = fullData
              .find(data => data.id === currentId);

            if (current) {
              buffer.push(
                <CommentCard
                  margin={`${initialMargin + 30 * path.length}px`}
                  commentData={current}
                  ip={ip}
                  key={uuidv4()}
                />,
              );

              if (current.nextIds) {
                path.push(current.nextIds);
              }

              while (path.length > 0) {
                if (path[path.length - 1].length === 0) {
                  path.pop();
                } else {
                  break;
                }
              }

              if (path.length !== 0) {
                currentId = path[path.length - 1].shift();
              } else {
                currentId = 0;
              }
            }
          }
        }

        parsedComments.push(buffer);
      }

      setReadyComments(parsedComments);
    });
  };

  useEffect(() => {
    loadIP();
    loadComments();
  }, []);

  useEffect(() => {
    parseComments();
  }, [comments]);

  const contextValue = {
    readyComments,
    commentsLoadingError,
    refreshComments,
  };

  return (
    <CommentsContext.Provider value={contextValue}>
      {children}
    </CommentsContext.Provider>
  );
};
