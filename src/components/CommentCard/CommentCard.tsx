/* eslint-disable no-console */
import {
  FC, useEffect, useState,
} from 'react';
import $ from 'jquery';
import sanitizeHtml from 'sanitize-html';
import cn from 'classnames';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import Button from '@mui/material/Button';
import { Comment } from '../../types/Comment';
import './CommentCard.scss';
import { Form } from '../Form';
import { Vote } from '../../types/Vote';
import { patchComment } from '../../api/comments';

type Props = {
  margin: string,
  commentData: Comment,
  ip: string,
  refreshComments: () => void,
};

export const CommentCard: FC<Props> = ({
  margin, commentData, ip, refreshComments,
}) => {
  const [comment, setComment] = useState<Comment>(commentData);
  const [isForm, setIsForm] = useState(false);
  const [quoted, setQuoted] = useState('');
  const canVote = comment.voted.includes(ip);

  const day = new Date(comment.createdAt)
    .toLocaleDateString()
    .split('/')
    .join('.');

  const setHours = () => {
    const hours = new Date(comment.createdAt)
      .getHours();

    return `${hours}`.length > 1 ? hours : `0${hours}`;
  };

  const hours = setHours();

  const setMinutes = () => {
    const minutes = new Date(comment.createdAt)
      .getMinutes();

    return `${minutes}`.length > 1 ? minutes : `0${minutes}`;
  };

  const minutes = setMinutes();

  const replyWithQuote = () => {
    const clean = sanitizeHtml(comment.text, {
      allowedTags: ['code', 'i', 'strong', 'a', 'br'],
      allowedAttributes: {
        a: ['href', 'title'],
      },
    });

    setQuoted(`<p class='quoted-reply'>${clean}<br></p>`);
  };

  const triggerForm = () => {
    setIsForm(curr => !curr);
    setQuoted('');
  };

  const updateComment = () => {
    refreshComments();
    setIsForm(false);
  };

  const handleVote = async (action: Vote) => {
    if (!canVote) {
      let newRating = comment.rating;
      const newVoted = [...comment.voted];

      newVoted.push(ip);

      if (action === Vote.PLUS) {
        newRating += 1;
      }

      if (action === Vote.MINUS) {
        newRating -= 1;
      }

      try {
        const actComment = await patchComment(comment.id, newRating, newVoted);

        setComment(actComment);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw error;
        } else {
          throw new Error('different error than axios');
        }
      }
    }
  };

  useEffect(() => {
    const card = $(`.comment-card__body-${comment.id}`);

    if (card) {
      card.html(comment.text);
    }
  }, [comment]);

  useEffect(() => {
    if (quoted) {
      setIsForm(true);
    }
  }, [quoted]);

  return (
    <div
      className="comment-card"
      style={{
        marginLeft: margin,
      }}
    >
      <div className="comment-card__header">
        <div className="comment-card__left">
          <Avatar alt="Remy Sharp" src="" />

          <div className="comment-card__user">
            {comment.userName}
          </div>

          <div className="comment-card__time">
            {`${day} o ${hours}:${minutes}`}
          </div>
        </div>
        <div className="comment-card__right">
          {!canVote && (
            <button
              type="button"
              className="comment-card__plus-minus"
              onClick={() => handleVote(Vote.PLUS)}
            >
              <NorthIcon
                sx={{ color: 'white' }}
              />
            </button>
          )}

          <span
            className={cn(
              'comment-card__rating',
              {
                'comment-card__rating--green': comment.rating > 0,
                'comment-card__rating--red': comment.rating < 0,
              },
            )}
          >
            {comment.rating}
          </span>

          {!canVote && (
            <button
              type="button"
              className="comment-card__plus-minus"
              onClick={() => handleVote(Vote.MINUS)}
            >
              <SouthIcon
                sx={{ color: 'white' }}
              />
            </button>
          )}
        </div>
      </div>

      <div
        className={`comment-card__body-${comment.id}`}
        style={{ padding: '20px' }}
      />
      <div className="comment-card__button-box">
        <Button
          variant="outlined"
          size="small"
          sx={{
            color: 'grey',
            backgroundColor: 'white',
            border: 'none',
            '&:hover': {
              border: 'none',
              backgroundColor: 'white',
            },
          }}
          onClick={triggerForm}
        >
          {isForm ? 'Close' : 'Reply'}
        </Button>

        <FormatQuoteIcon
          onClick={replyWithQuote}
          sx={{
            backgroundColor: 'white',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
          }}
          className="comment-card__quotes"
        />
      </div>

      {isForm && (
        <Form
          postId={1}
          prevId={comment.id}
          refreshComments={updateComment}
          quoted={quoted}
        />
      )}
    </div>
  );
};
