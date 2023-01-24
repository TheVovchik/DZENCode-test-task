/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-loop-func */
import {
  FC, useState, Fragment, useContext, useEffect,
} from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { v4 as uuidv4 } from 'uuid';
import { Form } from '../Form';
import { FormProvider } from '../FormContext';
import { CommentsContext } from '../CommentsContext';
import { CommentCard } from '../CommentCard';
import { ControlPanel } from '../CommentsContext/ControlPanel';
import './Comments.scss';
import 'bulma/css/bulma.min.css';

export const Comments: FC = () => {
  const {
    loading, comments, ip,
  } = useContext(CommentsContext);
  const [readyComments, setReadyComments] = useState<JSX.Element[][]>([]);
  const [isPrimaryForm, setIsPrimaryForm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const parseComments = () => {
    const parsedComments: JSX.Element[][] = [];

    console.log('start');
    // const sortedComments = sortComments(comments, sortBy, order);

    comments.forEach((comment, index, fullData) => {
      console.log('ForEach entered', index);
      console.log(parsedComments);

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

      console.log('ForEach leaved', index);
    });

    console.log('parsed');

    setReadyComments(parsedComments);
    console.log('end');
  };

  const showForm = () => {
    setIsPrimaryForm(current => !current);
  };

  const closeForm = () => {
    setIsPrimaryForm(false);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (comments) {
      parseComments();
    }
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
        magni facere soluta quos explicabo beatae.
      </div>

      <LoadingButton
        onClick={showForm}
        loading={loading}
        loadingIndicator="Loading…"
        variant="contained"
        size="large"
        sx={{
          backgroundColor: isPrimaryForm ? 'grey' : 'primary',
          marginBottom: '20px',
        }}
      >
        <span>
          {isPrimaryForm ? 'Close form' : 'Leave a comment'}
        </span>
      </LoadingButton>

      {isPrimaryForm && (
        <FormProvider quoted="">
          <Form
            postId={1}
            prevId={null}
            closeForm={closeForm}
          />
        </FormProvider>
      )}

      {readyComments.length > 0 && (
        <ControlPanel
          page={page}
          rowsPerPage={rowsPerPage}
          count={readyComments.length}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}

      {readyComments
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((comment) => {
          return (
            <Fragment key={uuidv4()}>
              {comment}
            </Fragment>
          );
        })}
    </div>
  );
};
