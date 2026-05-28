import React from 'react';
import type { PropsWithChildren } from 'react';
import { zy4UserFallback } from '../data/zy4DemoData';
import type { Zy4NavItem, Zy4NavKey, Zy4User } from '../data/zy4DemoData';
import { Zy4Footer } from './Zy4Footer';
import { Zy4Sidebar } from './Zy4Sidebar';
import { Zy4Topbar } from './Zy4Topbar';

interface Zy4LayoutProps extends PropsWithChildren {
    active?: Zy4NavKey;
    user?: Zy4User;
    sidebarItems?: Zy4NavItem[];
    topbarActionSlot?: React.ReactNode;
    topbarAccountLinks?: React.ComponentProps<typeof Zy4Topbar>['accountLinks'];
    isLoggingOut?: boolean;
    onLogout?: () => void;
}

export const Zy4Layout = ({
    active = 'dashboard',
    user = zy4UserFallback,
    sidebarItems,
    topbarActionSlot,
    topbarAccountLinks,
    isLoggingOut,
    onLogout,
    children,
}: Zy4LayoutProps) => (
    <div className="zy4-app" data-zy4-theme="true">
        <Zy4Sidebar active={active} items={sidebarItems} />
        <main className="zy4-main">
            <Zy4Topbar
                accountLinks={topbarAccountLinks}
                actionSlot={topbarActionSlot}
                isLoggingOut={isLoggingOut}
                onLogout={onLogout}
                user={user}
            />
            <div className="zy4-content">{children}</div>
            <Zy4Footer />
        </main>
    </div>
);
