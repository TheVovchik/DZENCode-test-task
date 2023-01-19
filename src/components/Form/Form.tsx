import React, { FC, useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import CodeIcon from '@mui/icons-material/Code';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import $ from 'jquery';
import { generateCaptcha } from '../../api/captcha';
import './Form.scss';
import { PreviewModal } from '../PreviewModal';
import { userNamePattern } from '../../utils/userName';
import { Captcha } from '../../types/Captcha';
import { postComment } from '../../api/comments';

type Props = {
  postId: number,
  prevId: number | null,
  refreshComments: () => void,
  quoted: string,
};

export const Form: FC<Props> = ({
  postId, prevId, refreshComments, quoted,
}) => {
  const [userName, setUserName] = useState('');
  const [isUserNameError, setIsUserNameError] = useState(false);
  const [email, setEmail] = useState('');
  const [homepage, setHomepage] = useState('');
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [captchaValue, setCaptchaValue] = useState('');
  const [isCaptchaError, setIsCaptchaError] = useState(false);
  const [message, setMessage] = useState(quoted);
  const [selectedCoords, setSelectedCoords] = useState<number[]>([0, 0]);
  const [isActive, setIsActive] = useState(false);

  const loadCaptcha = async () => {
    try {
      const newCaptcha = await generateCaptcha();

      setCaptcha(newCaptcha);
    } catch (error) {
      throw new Error();
    }
  };

  const validateCaptcha = () => {
    const hasError = captcha?.text === captchaValue;

    setIsCaptchaError(!hasError);

    return hasError;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const checkResult = validateCaptcha();
    const checkName = userNamePattern.test(userName);

    setIsUserNameError(!checkName);

    if (checkResult && checkName) {
      try {
        const formData = new FormData();

        if (prevId) {
          formData.append('prevId', `${prevId}`);
        }

        if (homepage) {
          formData.append('homepage', homepage);
        }

        formData.append('postId', `${postId}`);
        formData.append('userName', userName);
        formData.append('email', email);
        formData.append('text', message);
        formData.append('rating', '0');
        formData.append('voted', '[]');

        await postComment(formData);
        refreshComments();
      } catch (error) {
        throw new Error();
      }
    }
  };

  const handleUserNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);

    const checkName = userNamePattern.test(event.target.value);

    setIsUserNameError(!checkName);
  };

  const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleHomepageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHomepage(event.target.value);
  };

  const handleCaptchaInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCaptchaValue(event.target.value);
    setIsCaptchaError(false);
  };

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const input = event.target.value;

    setMessage(input);
  };

  const handleSelect = () => {
    const cursorStart = $('textarea').prop('selectionStart');
    const cursorEnd = $('textarea').prop('selectionEnd');

    setSelectedCoords([cursorStart, cursorEnd]);
  };

  const addTag = (tag: string[]) => {
    if (selectedCoords.some(coord => coord !== 0)) {
      const [openTag, closeTag] = tag;

      setMessage(current => {
        const modified = current
          .split('');

        modified
          .splice(selectedCoords[0], 0, openTag);

        modified
          .splice(selectedCoords[1] + 1, 0, closeTag);

        return modified.join('');
      });

      $('textarea')
        .prop('selectionEnd',
          selectedCoords[1] + openTag.length + closeTag.length);
    } else {
      const allTag = tag.join(' ');

      setMessage(current => {
        const cursorStart = $('textarea').prop('selectionStart');

        const modified = current
          .split('');

        modified
          .splice(cursorStart, 0, allTag);

        return modified.join('');
      });

      $('textarea').prop('selectionEnd', selectedCoords[1] + allTag.length);
    }
  };

  const handleNewLine = (event: React.KeyboardEvent) => {
    const cursorStart = $('textarea').prop('selectionStart');

    if (event.key === 'Enter') {
      setMessage(current => {
        const modified = current
          .split('');

        modified
          .splice(cursorStart + 1, 0, '<br>');

        return modified.join('');
      });

      $('textarea').prop('selectionEnd', selectedCoords[1] + 5);
    }
  };

  const changeModalStatus = (status: boolean) => {
    setIsActive(status);
  };

  const refreshCaptcha = () => {
    loadCaptcha();
    setCaptchaValue('');
    setIsCaptchaError(false);
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const checkFields = () => {
    const hasSubmit = email.length === 0
      || userName.length === 0
      || captchaValue.length === 0
      || message.length === 0
      || isCaptchaError
      || isUserNameError;

    return hasSubmit;
  };

  useEffect(() => {
    const captchaDiv = $('.form__captcha-pic');

    if (captcha && captchaDiv) {
      captchaDiv.html(captcha.data);
    }
  }, [captcha]);

  return (
    <>
      <form
        className="form"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label htmlFor="userName" className="label">Login</label>
          <div className="control">
            <input
              id="userName"
              className="input"
              type="text"
              value={userName}
              onChange={handleUserNameInput}
              required
            />
          </div>

          {isUserNameError && (
            <div className="form__error">
              can contain only numbers and
              latin letters and to have at least 3 symbols length
            </div>
          )}
        </div>

        <div className="field">
          <label htmlFor="email" className="label">Email</label>
          <div className="control">
            <input
              id="email"
              className="input"
              type="email"
              placeholder="e.g. alex@example.com"
              value={email}
              onChange={handleEmailInput}
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="homepage" className="label">Homepage</label>
          <div className="control">
            <input
              id="homepage"
              className="input"
              type="url"
              placeholder="http://example.com"
              value={homepage}
              onChange={handleHomepageInput}
            />
          </div>
        </div>

        <div className="form__captcha-pic" />
        {isCaptchaError && (
          <div className="form__error">wrong captcha</div>
        )}

        <div className="field form__captcha-input">
          <div className="control">
            <input
              className="input"
              type="text"
              value={captchaValue}
              onChange={handleCaptchaInput}
              required
            />
          </div>

          <button
            type="button"
            className="button is-success is-light"
            onClick={refreshCaptcha}
          >
            Refresh
          </button>
        </div>

        <div className="field">
          <Tooltip title="<a href=”” title=””> </a>">
            <IconButton onClick={() => (
              addTag(['<a href=”” title=”” target="blanc">', '</a>'])
            )}
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="<code> </code>">
            <IconButton onClick={() => addTag(['<code>', '</code>'])}>
              <CodeIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="<i> </i>">
            <IconButton onClick={() => addTag(['<i>', '</i>'])}>
              <FormatItalicIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="<strong> </strong>">
            <IconButton onClick={() => addTag(['<strong>', '</strong>'])}>
              <FormatBoldIcon />
            </IconButton>
          </Tooltip>

          <div className="control">
            <textarea
              className="textarea"
              placeholder="Input your message"
              value={message}
              onMouseUp={handleSelect}
              onChange={handleMessageChange}
              onKeyDown={handleNewLine}
              required
            />
          </div>
        </div>

        <div className="form__control">
          <button
            type="button"
            className="button is-warning"
            onClick={() => changeModalStatus(true)}
            disabled={message.length === 0}
          >
            Preview
          </button>

          <button
            type="submit"
            className="button is-primary"
            disabled={checkFields()}
          >
            Post
          </button>
        </div>
      </form>

      <PreviewModal
        isActive={isActive}
        message={message}
        changeModalStatus={changeModalStatus}
      />
    </>
  );
};
