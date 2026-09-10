import { AppShell } from '@/components/AppShell';
import { About } from '@/pages/About';
import { Algorithms } from '@/pages/Algorithms';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';
import { Studio } from '@/pages/Studio';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppShell />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/estudio" element={<Studio />} />
                    <Route path="/algoritmos" element={<Algorithms />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
