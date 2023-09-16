import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './common/theme';
import { Provider } from 'react-redux/es/exports';
import { store } from './store';
import './common/i18next';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Suspense fallback={<div>Loading...</div>}>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <HelmetProvider context={{}}>
            <App />
          </HelmetProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </Suspense>
);
