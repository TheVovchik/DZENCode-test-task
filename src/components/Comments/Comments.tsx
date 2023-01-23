import {
  FC, useState, Fragment, useContext,
} from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import './Comments.scss';
import 'bulma/css/bulma.min.css';
import { v4 as uuidv4 } from 'uuid';
import TablePagination from '@mui/material/TablePagination';
import StraightIcon from '@mui/icons-material/Straight';
import ContactsIcon from '@mui/icons-material/Contacts';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { Form } from '../Form';
import { FormProvider } from '../FormContext';
import { CommentsContext } from '../CommentsContext';

export const Comments: FC = () => {
  const { readyComments } = useContext(CommentsContext);
  const [isPrimaryForm, setIsPrimaryForm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

      <Button
        variant="contained"
        size="large"
        sx={{
          backgroundColor: isPrimaryForm ? 'grey' : 'primary',
          marginBottom: '20px',
        }}
        onClick={showForm}
      >
        {isPrimaryForm ? 'Close form' : 'Leave a comment'}
      </Button>

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
        <div className="control">
          <div className="control__sorting">
            <Tooltip title="Sort by login">
              <IconButton>
                <ContactsIcon />
                <StraightIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Sort by date">
              <IconButton>
                <CalendarMonthIcon />
                <StraightIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Sort by rating">
              <IconButton>
                <ThumbUpOffAltIcon />
                <StraightIcon />
              </IconButton>
            </Tooltip>
          </div>

          <TablePagination
            component="div"
            count={readyComments.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Comments per page:"
            rowsPerPageOptions={[5, 10, 15, 20, 25]}
          />
        </div>
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
