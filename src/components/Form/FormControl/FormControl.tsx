import { FC, memo, useContext } from 'react';
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
  } = useContext(FormContext);

  const couldPost = email.length !== 0
    && userName.length !== 0
    && message.length !== 0
    && captchaValue.length !== 0;

  return (
    <div className="form__management management">
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
