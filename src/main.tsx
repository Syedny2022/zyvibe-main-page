import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import StartPage from './pages/StartPage.tsx';
import PreviewPage from './pages/PreviewPage.tsx';
import ThanksPage from './pages/ThanksPage.tsx';
import TermsPage from './pages/TermsPage.tsx';
import PrivacyPage from './pages/PrivacyPage.tsx';
import './index.css';

// Minimal path routing; Cloudflare Pages serves index.html for every non-asset path.
function route() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const preview = path.match(/^\/preview\/([a-f0-9]{32})$/);
  if (preview) return <PreviewPage conceptId={preview[1]} />;
  if (path === '/start') return <StartPage />;
  if (path === '/thanks') return <ThanksPage />;
  if (path === '/terms') return <TermsPage />;
  if (path === '/privacy') return <PrivacyPage />;
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {route()}
  </StrictMode>,
);
