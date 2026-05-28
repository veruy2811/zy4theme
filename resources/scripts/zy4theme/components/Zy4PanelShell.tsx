import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import http from '@/api/http';
import { useStoreState } from 'easy-peasy';
import type { Zy4NavItem, Zy4NavKey, Zy4User } from '../data/zy4DemoData';
import { Zy4Layout } from './Zy4Layout';

type PterodactylUser = {
    username?: string;
    email?: string;
    rootAdmin?: boolean;
    avatarURL?: string;
    roleName?: string;
};

interface Zy4PanelShellProps extends PropsWithChildren {
    active?: Zy4NavKey;
    sidebarItems?: Zy4NavItem[];
    topbarActionSlot?: React.ReactNode;
}

export const buildZy4ClientSidebarItems = (rootAdmin: boolean): Zy4NavItem[] => [
    { key: 'dashboard', label: 'Dashboard', href: '/', icon: 'grid', exact: true },
    { key: 'servers', label: 'Servers', href: '/', icon: 'server', exact: true },
    { key: 'account', label: 'Account', href: '/account', icon: 'settings', exact: true },
    { key: 'api', label: 'API Credentials', href: '/account/api', icon: 'database' },
    { key: 'ssh', label: 'SSH Keys', href: '/account/ssh', icon: 'shield' },
    { key: 'activity', label: 'Activity', href: '/account/activity', icon: 'activity' },
    ...(rootAdmin ? [{ key: 'admin' as const, label: 'Admin', href: '/admin', icon: 'layers' as const, external: true }] : []),
];

export const Zy4PanelShell = ({ active = 'dashboard', sidebarItems, topbarActionSlot, children }: Zy4PanelShellProps) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const userData = useStoreState((state) => state.user.data) as PterodactylUser | undefined;
    const rootAdmin = Boolean(userData?.rootAdmin);
    const items = sidebarItems ?? buildZy4ClientSidebarItems(rootAdmin);

    const user: Zy4User = {
        name: userData?.username || 'CaptainZy4',
        email: userData?.email,
        role: userData?.roleName || (rootAdmin ? 'Administrator' : 'Member'),
        avatarUrl: userData?.avatarURL,
    };

    const logout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            window.location.href = '/';
        });
    };

    return (
        <Zy4Layout
            active={active}
            isLoggingOut={isLoggingOut}
            onLogout={logout}
            sidebarItems={items}
            topbarActionSlot={topbarActionSlot}
            user={user}
        >
            {children}
        </Zy4Layout>
    );
};
