import {
  FC, memo, useCallback, useContext, useEffect, useState,
} from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import $ from 'jquery';
import './SVGCaptcha.scss';
import { FormContext } from '../../FormContext';

export const SVGCaptcha: FC = memo(() => {
  const [isCaptchaError, setIsCaptchaError] = useState(false);
  const {
    captcha,
    captchaValue,
    loadingError,
    refreshCaptcha,
    changeCaptchaValue,
  } = useContext(FormContext);

  const error = captchaValue.length === 0
    ? 'Captcha is required'
    : 'Captcha is invalid';

  const handleCaptchaInput = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    changeCaptchaValue(event.target.value);
    setIsCaptchaError(false);
  }, []);

  const updateCaptcha = useCallback(() => {
    refreshCaptcha();
    setIsCaptchaError(false);
  }, []);

  const checkCaptcha = useCallback(() => {
    const hasError = captcha?.text === captchaValue;

    setIsCaptchaError(!hasError);
  }, [captcha, captchaValue]);

  useEffect(() => {
    const captchaDiv = $('.captcha__svg');

    if (captcha && captchaDiv) {
      captchaDiv.html(captcha.data);
    }
  }, [captcha]);

  return (
    <>
      {loadingError && (
        <div className="form__error">
          Cann&apos;t load captcha
        </div>
      )}
      {!loadingError && (
        <div className="captcha">
          <div className="form__captcha-pic captcha__svg" />
          {isCaptchaError && (
            <div className="form__error captcha__error">{error}</div>
          )}

          <div className="field captcha__input">
            <div className="control">
              <input
                className="input"
                type="text"
                value={captchaValue}
                onChange={handleCaptchaInput}
                onBlur={checkCaptcha}
                required
              />
            </div>

            <RefreshIcon
              onClick={updateCaptcha}
              sx={{
                width: '30px',
                height: '30px',
                transition: 'transform 0.3s linear, color 0.6s',
                '&:hover': {
                  transform: 'rotate(90deg) scale(1.2)',
                  color: 'black',
                },
              }}
            />
          </div>
        </div>
      )}
    </>
  );
});
