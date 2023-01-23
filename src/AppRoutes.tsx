import { FC } from 'react';
import { Comments } from './components/Comments';
import { CommentsProvider } from './components/CommentsContext';

export const AppRoutes: FC = () => {
  return (
    <div className="App">
      <CommentsProvider>
        <Comments />
      </CommentsProvider>
    </div>
  );
};
