import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';

export function App() {
    return (
        <StrictMode>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </StrictMode>
    );
}
