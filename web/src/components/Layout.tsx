import type { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="app-layout">
            <Navbar />
            <main>{children}</main>
        </div>
    );
}
