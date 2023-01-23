import {
  FC, memo, useCallback, useContext, useState,
} from 'react';
import * as EmailValidator from 'email-validator';
import { FormContext } from '../../FormContext';

export const Email: FC = memo(() => {
  const [isEmailError, setIsEmailError] = useState(false);
  const { email, changeEmail } = useContext(FormContext);

  const error = email.length === 0
    ? 'Email address is required'
    : 'Email address is invalid';

  const handleEmailInput = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    changeEmail(event.target.value);
    setIsEmailError(false);
  }, []);

  const checkEmail = useCallback(() => {
    const checkName = EmailValidator.validate(email);

    setIsEmailError(!checkName);
  }, [email]);

  return (
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
          onBlur={checkEmail}
          required
        />
      </div>

      {isEmailError && (
        <div className="form__error">
          {error}
        </div>
      )}
    </div>
  );
});
