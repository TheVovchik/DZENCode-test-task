import {
  FC, memo, useCallback, useContext, useState,
} from 'react';
import { userNamePattern } from '../../../utils/userName';
import { FormContext } from '../../FormContext';

export const UserName: FC = memo(() => {
  const [isUserNameError, setIsUserNameError] = useState(false);
  const { userName, changeUserName } = useContext(FormContext);

  const error = userName.length === 0
    ? 'Login is required'
    : 'Login must be at least 3 and less then 19 characters';

  const handleUserNameInput = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    changeUserName(event.target.value);
    setIsUserNameError(false);
  }, []);

  const checkUserName = useCallback(() => {
    const checkName = userNamePattern.test(userName);

    setIsUserNameError(!checkName);
  }, [userName]);

  return (
    <div className="field">
      <label htmlFor="userName" className="label">Login</label>
      <div className="control">
        <input
          id="userName"
          className="input"
          type="text"
          placeholder="e.g. xxx"
          value={userName}
          onChange={handleUserNameInput}
          onBlur={checkUserName}
          required
        />
      </div>

      {isUserNameError && (
        <div className="form__error">
          {error}
        </div>
      )}
    </div>
  );
});
