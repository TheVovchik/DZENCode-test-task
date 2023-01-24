import { FC, useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import StraightIcon from '@mui/icons-material/Straight';
import ContactsIcon from '@mui/icons-material/Contacts';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { CommentsContext } from '../CommentsContext';
import { Order, SortBy } from '../../../types/SortBy';

type Props = {
  page: number,
  rowsPerPage: number,
  count: number,
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => void,
  handleChangeRowsPerPage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void,
};

export const ControlPanel: FC<Props> = ({
  page,
  rowsPerPage,
  count,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const {
    sortBy,
    order,
    changeSortingType,
  } = useContext(CommentsContext);

  return (
    <div className="control">
      <div className="control__sorting">
        <Tooltip
          title="Sort by login"
          onClick={() => changeSortingType(SortBy.LOGIN)}
        >
          <IconButton>
            <ContactsIcon />
            {sortBy === SortBy.LOGIN && order === Order.ASC && <StraightIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip
          title="Sort by date"
          onClick={() => changeSortingType(SortBy.DATE)}
        >
          <IconButton>
            <CalendarMonthIcon />
            {sortBy === SortBy.DATE && order === Order.ASC && <StraightIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip
          title="Sort by rating"
          onClick={() => changeSortingType(SortBy.RATING)}
        >
          <IconButton>
            {sortBy === SortBy.RATING
              && order === Order.DESC
              ? <ThumbDownOffAltIcon />
              : <ThumbUpOffAltIcon />}
            {sortBy === SortBy.RATING
              && order === Order.ASC && <StraightIcon />}
          </IconButton>
        </Tooltip>
      </div>

      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Comments per page:"
        rowsPerPageOptions={[5, 10, 15, 20, 25]}
      />
    </div>
  );
};
