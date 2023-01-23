import {
  FC, memo, useCallback, useContext, useState,
} from 'react';
import { validateUrl } from '../../../utils/validateUrl';
import { FormContext } from '../../FormContext';

export const Homepage: FC = memo(() => {
  const [isUrlError, setIsUrlError] = useState(false);
  const { homepage, changeHomepage } = useContext(FormContext);

  const error = 'Homepage address is invalid';

  const handleHomepageInput = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    changeHomepage(event.target.value);
    setIsUrlError(false);
  }, []);

  const checkUrl = useCallback(() => {
    const isValid = validateUrl(homepage);

    setIsUrlError(!isValid);
  }, [homepage]);

  return (
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
          onBlur={checkUrl}
        />
      </div>

      {isUrlError && (
        <div className="form__error">
          {error}
        </div>
      )}
    </div>
  );
});
