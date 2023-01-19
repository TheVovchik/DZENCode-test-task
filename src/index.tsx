import ReactDOM from 'react-dom/client';
import './index.scss';
import { AppRoutes } from './AppRoutes';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <AppRoutes />,
);
