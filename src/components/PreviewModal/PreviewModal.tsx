import { FC, useEffect } from 'react';
import cn from 'classnames';
import $ from 'jquery';
import './PreviewModal.scss';

type Props = {
  isActive: boolean,
  message: string,
  changeModalStatus: (status: boolean) => void,
};

export const PreviewModal: FC<Props> = ({
  isActive, message, changeModalStatus,
}) => {
  useEffect(() => {
    const captchaDiv = $('.modal-card-body');

    if (captchaDiv) {
      captchaDiv.html(message);
    }
  }, [message]);

  return (
    <div className={cn(
      'modal',
      { 'is-active': isActive },
    )}
    >
      <div className="modal-background" />

      <div className="modal-card">
        <section className="modal-card-body" />
      </div>

      <button
        type="button"
        className="modal-close is-large"
        aria-label="close"
        onClick={() => changeModalStatus(false)}
      />
    </div>
  );
};
