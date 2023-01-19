/* eslint-disable @typescript-eslint/no-loop-func */
import {
  FC, useState, useEffect, Fragment,
} from 'react';
import { Button } from '@mui/material';
import './Comments.scss';
import 'bulma/css/bulma.min.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Form } from '../Form';
import { getComments } from '../../api/comments';
import { Comment } from '../../types/Comment';
import { CommentCard } from '../CommentCard/CommentCard';
import { getCurrentIP } from '../../api/ip';

export const Comments: FC = () => {
  const [isForm, setIsForm] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [readyComments, setReadyComments] = useState<JSX.Element[][]>([]);
  const [ip, setIp] = useState('');

  const showForm = () => {
    setIsForm(current => !current);
  };

  const loadComments = async () => {
    try {
      const commentsFromApi = await getComments();

      setComments(commentsFromApi);
    } catch (error) {
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
    setIsForm(false);
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
            refreshComments={refreshComments}
          />,
        );

        if (comment.nextId) {
          path.push(comment.nextId);
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
                  refreshComments={refreshComments}
                />,
              );

              if (current.nextId) {
                path.push(current.nextId);
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

  return (
    <div>
      <div className="article">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut error saepe
        quam omnis debitis fugiat a at eligendi ea iure repellendus sint numquam
        perspiciatis enim quasi, quia ducimus, architecto sunt. Quam molestiae
        facilis aliquid temporibus nihil ad. Minus earum illum ipsa tenetur
        tempora sapiente, quibusdam saepe distinctio velit ea, architecto
        necessitatibus dolorem vero repellat aperiam libero enim nobis provident
        eaque! Rerum ad obcaecati, saepe dolorum, cum natus eligendi autem iste
        quidem error ex quae sed modi? Rerum, modi consectetur iure sequi et
        deleniti minima porro aut soluta, quae temporibus necessitatibus iusto
        ad dolorum deserunt commodi doloribus natus, repellat fugiat delectus
        ratione tempore reiciendis obcaecati. Consectetur omnis modi, quia illum
        magni facere soluta quos explicabo beatae. Quas itaque maxime qui
        dolorem. Architecto reprehenderit, quod vero voluptatum nam inventore
        dolorem iusto atque tenetur, ab deserunt adipisci eum natus maiores,
        unde hic sunt facilis mollitia accusantium voluptas nobis delectus. Fuga
        consectetur similique et, praesentium ut inventore aut est ullam in
        voluptates at cupiditate dolor non doloribus dolorum minima assumenda
        maxime mollitia nemo laudantium. Incidunt, et, inventore harum deleniti
        odit repudiandae cumque, aspernatur laboriosam provident ullam expedita
        iusto quam perspiciatis veniam vero laudantium sunt esse quis vel libero
        fugiat nihil facere eius. Quia, ipsum.
      </div>

      <Button
        variant="contained"
        size="large"
        sx={{
          backgroundColor: isForm ? 'grey' : 'primary',
          marginBottom: '20px',
        }}
        onClick={showForm}
      >
        {isForm ? 'Close form' : 'Leave a comment'}
      </Button>

      {isForm && (
        <Form
          postId={1}
          prevId={null}
          refreshComments={refreshComments}
          quoted=""
        />
      )}

      {readyComments.map((comment) => {
        return (
          <Fragment key={uuidv4()}>
            {comment}
          </Fragment>
        );
      })}
    </div>
  );
};
