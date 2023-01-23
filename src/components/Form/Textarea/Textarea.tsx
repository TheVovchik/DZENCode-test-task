import {
  FC, memo, useCallback, useContext, useState,
} from 'react';
import $ from 'jquery';
import { IconButton, Tooltip } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import CodeIcon from '@mui/icons-material/Code';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import { FormContext } from '../../FormContext';

export const Textarea: FC = memo(() => {
  const [selectedCoords, setSelectedCoords] = useState<number[]>([0, 0]);
  const { message, changeMessage } = useContext(FormContext);

  const handleMessageChange = useCallback((
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    changeMessage(event.target.value);
  }, []);

  const handleSelect = useCallback(() => {
    const cursorStart = $('textarea').prop('selectionStart');
    const cursorEnd = $('textarea').prop('selectionEnd');

    setSelectedCoords([cursorStart, cursorEnd]);
  }, []);

  const handleNewLine = useCallback((event: React.KeyboardEvent) => {
    const cursorStart = $('textarea').prop('selectionStart');

    if (event.key === 'Enter') {
      const modified = message
        .split('');

      modified
        .splice(cursorStart + 1, 0, '<br>');

      changeMessage(modified.join(''));

      $('textarea').prop('selectionEnd', cursorStart + 5);
    }
  }, [message]);

  const addTag = useCallback((tag: string[]) => {
    if (selectedCoords.some(coord => coord !== 0)) {
      const [openTag, closeTag] = tag;

      const modified = message
        .split('');

      modified
        .splice(selectedCoords[0], 0, openTag);

      modified
        .splice(selectedCoords[1] + 1, 0, closeTag);

      changeMessage(modified.join(''));

      $('textarea')
        .prop('selectionEnd',
          selectedCoords[1] + openTag.length + closeTag.length);
    } else {
      const allTag = tag.join(' ');
      const cursorStart = $('textarea').prop('selectionStart');
      const modified = message
        .split('');

      modified
        .splice(cursorStart, 0, allTag);

      changeMessage(modified.join(''));

      $('textarea').prop('selectionEnd', selectedCoords[1] + allTag.length);
    }
  }, [message, selectedCoords]);

  return (
    <div className="field">
      <Tooltip title="[a]">
        <IconButton onClick={() => (
          addTag(['<a href=”” title=”” target="blanc">', '</a>'])
        )}
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="[code]">
        <IconButton onClick={() => addTag(['<code>', '</code>'])}>
          <CodeIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="[i]">
        <IconButton onClick={() => addTag(['<i>', '</i>'])}>
          <FormatItalicIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="[strong]">
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
  );
});
