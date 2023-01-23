import React, {
  FC, useContext, useState,
} from 'react';
import * as EmailValidator from 'email-validator';
import axios from 'axios';
import { PreviewModal } from '../PreviewModal';
import { userNamePattern } from '../../utils/userName';
import { postComment } from '../../api/comments';
import { sanitaizeMessage } from '../../utils/sanitaizeMessage';
import { SVGCaptcha } from './SVGCaptcha';
import { FormContext } from '../FormContext';
import { UserName } from './UserName';
import { Email } from './Email';
import './Form.scss';
import { Homepage } from './Homepage';
import { validateUrl } from '../../utils/validateUrl';
import { FormControl } from './FormControl';
import { Textarea } from './Textarea';
import { CommentsContext } from '../CommentsContext';

type Props = {
  postId: number,
  prevId: number | null,
  closeForm: () => void,
};

export const Form: FC<Props> = ({
  postId, prevId, closeForm,
}) => {
  const [isActive, setIsActive] = useState(false);
  const {
    captcha,
    captchaValue,
    userName,
    email,
    homepage,
    message,
  } = useContext(FormContext);

  const { refreshComments } = useContext(CommentsContext);

  const checkData = () => {
    const checkCaptcha = captcha?.text === captchaValue;
    const checkName = userNamePattern.test(userName);
    const checkEmail = EmailValidator.validate(email);
    const checkUrl = validateUrl(homepage);

    return checkCaptcha && checkName && checkEmail && checkUrl;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const couldSubmit = checkData();

    if (couldSubmit) {
      try {
        const formData = new FormData();

        if (prevId) {
          formData.append('prevId', `${prevId}`);
        }

        if (homepage) {
          formData.append('homepage', homepage);
        }

        const text = sanitaizeMessage(message);

        formData.append('postId', `${postId}`);
        formData.append('userName', userName);
        formData.append('email', email);
        formData.append('text', text);
        formData.append('rating', '0');
        formData.append('votes', '');

        await postComment(formData);
        closeForm();
        refreshComments();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw error;
        } else {
          throw new Error('different error than axios');
        }
      }
    }
  };

  const showModal = (status: boolean) => {
    setIsActive(status);
  };

  return (
    <>
      <form
        className="form"
        onSubmit={handleSubmit}
      >
        <UserName />

        <Email />

        <Homepage />

        <SVGCaptcha />

        <Textarea />

        <FormControl
          showModal={showModal}
        />
      </form>

      <PreviewModal
        isActive={isActive}
        message={message}
        changeModalStatus={showModal}
      />
    </>
  );
};
