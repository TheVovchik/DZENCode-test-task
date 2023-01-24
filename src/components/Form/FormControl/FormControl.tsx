/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FC, memo, useContext, useEffect,
} from 'react';
import { Button } from '@mui/material';
import { FormContext } from '../../FormContext';
import './FormControl.scss';

type Props = {
  showModal: (status: boolean) => void,
};

export const FormControl: FC<Props> = memo(({ showModal }) => {
  const {
    captchaValue,
    userName,
    email,
    message,
    file,
    uploadFile,
  } = useContext(FormContext);

  const couldPost = email.length !== 0
    && userName.length !== 0
    && message.length !== 0
    && captchaValue.length !== 0;

  // const handleInput = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   if (event.target.files) {
  //     uploadFile(event.target.files);
  //   }
  // };

  return (
    <div className="form__management management">
      {/* <Button
        variant="contained"
        component="label"
      >
        Upload
        <input
          hidden
          accept=".jpg, .png, .gif, .txt"
          type="file"
          onChange={handleInput}
        />
      </Button> */}

      <button
        type="button"
        className="button is-warning"
        onClick={() => showModal(true)}
        disabled={message.length === 0}
      >
        Preview
      </button>

      <button
        type="submit"
        className="button is-primary"
        disabled={!couldPost}
      >
        Post
      </button>
    </div>
  );
});
