import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { localeFromPath } from './i18n/config';
import { loadDictionary } from './i18n/dictionaries';
import './index.css';

const container = document.getElementById('root') as HTMLElement;
const normalizedPath = window.location.pathname.replace(/(.)\/+$/, '$1');

loadDictionary(localeFromPath(normalizedPath)).then(() => {
    if (container.dataset.prerenderedPath === normalizedPath) {
        hydrateRoot(container, <App />);
        return;
    }
    container.replaceChildren();
    createRoot(container).render(<App />);
});
