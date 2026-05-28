import React, { useEffect, useMemo, useState } from 'react';
import getServers from '@/api/getServers';
import type { Server } from '@/api/server/getServer';
import getServerResourceUsage from '@/api/server/getServerResourceUsage';
import type { ServerStats } from '@/api/server/getServerResourceUsage';
import http from '@/api/http';
import type { PaginatedResult } from '@/api/http';
import useFlash from '@/plugins/useFlash';
import { usePersistedState } from '@/plugins/usePersistedState';
import { useStoreState } from 'easy-peasy';
import useSWR from 'swr';
import { useLocation } from 'react-router-dom';
import type {
    Zy4HeroMetric,
    Zy4MetricCardData,
    Zy4NavItem,
    Zy4ServerCardData,
    Zy4ServerStatus,
    Zy4User,
} from '../data/zy4DemoData';
import { Zy4Dashboard } from './Zy4Dashboard';
import { Zy4Icon } from './Zy4Icons';
import { Zy4Layout } from './Zy4Layout';

type PterodactylUser = {
    username?: string;
    email?: string;
    rootAdmin?: boolean;
    avatarURL?: string;
    roleName?: string;
};

const tones: Zy4ServerCardData['tone'][] = ['green', 'purple', 'blue', 'cyan'];

const bytesToHuman = (bytes: number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return '0B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }

    return `${Number(value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1))}${units[unitIndex]}`;
};

const stableSparkline = (seed: string, index: number) => {
    const base = seed.split('').reduce((total, character) => total + character.charCodeAt(0), index * 13);

    return Array.from({ length: 10 }, (_, point) => 10 + ((base + point * 17 + (point % 3) * 11) % 42));
};

const formatMemoryLimit = (memoryInMb: number) => {
    if (!memoryInMb) {
        return 'Unlimited';
    }

    return memoryInMb >= 1024 ? `${Number((memoryInMb / 1024).toFixed(1))}GB` : `${memoryInMb}MB`;
};

const defaultAllocation = (server: Server) => {
    const allocation = server.allocations.find((item) => item.isDefault) ?? server.allocations[0];

    if (!allocation) {
        return server.node || 'pterodactyl.local';
    }

    return `${allocation.alias || allocation.ip}:${allocation.port}`;
};

const statusForServer = (server: Server, stats?: ServerStats): Zy4ServerStatus => {
    const installStatus = String(server.status || '');

    if (stats?.isSuspended || server.status === 'suspended') {
        return 'suspended';
    }

    if (stats?.status === 'running') {
        return 'online';
    }

    if (stats?.status === 'starting') {
        return 'starting';
    }

    if (stats?.status === 'stopping') {
        return 'stopping';
    }

    if (stats?.status === 'offline') {
        return 'offline';
    }

    if (installStatus === 'installing' || installStatus === 'restoring_backup') {
        return 'installing';
    }

    if (server.isTransferring) {
        return 'starting';
    }

    return stats ? 'online' : 'unknown';
};

const serverToCard = (server: Server, index: number, stats?: ServerStats): Zy4ServerCardData => ({
    id: server.uuid,
    name: server.name,
    domain: defaultAllocation(server),
    cpu: stats ? `${stats.cpuUsagePercent.toFixed(1)}%` : server.limits.cpu ? `${server.limits.cpu}%` : 'Unlimited',
    ram: stats ? bytesToHuman(stats.memoryUsageInBytes) : formatMemoryLimit(server.limits.memory),
    status: statusForServer(server, stats),
    href: `/server/${server.id}`,
    iconLabel: server.name.slice(0, 2).toUpperCase(),
    sparkline: stableSparkline(server.uuid, index),
    tone: tones[index % tones.length],
});

const buildHeroMetrics = (servers?: PaginatedResult<Server>, userTotal = '1'): Zy4HeroMetric[] => {
    const totalServers = servers?.pagination.total ?? 0;

    return [
        { label: 'Servers', value: String(totalServers), icon: 'layers' },
        { label: 'Users', value: userTotal, icon: 'users' },
        { label: 'Uptime', value: 'N/A', icon: 'schedule' },
    ];
};

const buildStats = (servers?: PaginatedResult<Server>, resourceStats: Record<string, ServerStats> = {}): Zy4MetricCardData[] => {
    const totalServers = servers?.pagination.total ?? 0;
    const visibleServers = servers?.items ?? [];
    const stats = visibleServers
        .map((server) => resourceStats[server.uuid])
        .filter((item): item is ServerStats => Boolean(item));
    const activeServers = visibleServers.filter((server) => statusForServer(server, resourceStats[server.uuid]) === 'online').length;
    const activeLabel = stats.length ? `${activeServers} / ${visibleServers.length}` : visibleServers.length ? 'N/A' : `0 / ${totalServers}`;
    const avgCpuUsage = stats.length ? Math.round(stats.reduce((total, item) => total + item.cpuUsagePercent, 0) / stats.length) : null;
    const memoryUsed = stats.reduce((total, item) => total + item.memoryUsageInBytes, 0);
    const memoryLimit = visibleServers.reduce((total, server) => total + (server.limits.memory || 0) * 1024 * 1024, 0);
    const diskUsed = stats.reduce((total, item) => total + item.diskUsageInBytes, 0);
    const diskLimit = visibleServers.reduce((total, server) => total + (server.limits.disk || 0) * 1024 * 1024, 0);
    const avgRamUsage = stats.length && memoryLimit ? Math.min(100, Math.round((memoryUsed / memoryLimit) * 100)) : null;
    const avgDiskUsage = stats.length && diskLimit ? Math.min(100, Math.round((diskUsed / diskLimit) * 100)) : null;
    const networkTotal = stats.reduce((total, item) => total + item.networkRxInBytes + item.networkTxInBytes, 0);

    return [
        {
            key: 'cpu',
            title: 'CPU Usage',
            subtitle: 'Overall Usage',
            value: avgCpuUsage === null ? 'N/A' : `${avgCpuUsage}%`,
            icon: 'cpu',
            tone: 'blue',
            progress: avgCpuUsage ?? undefined,
        },
        {
            key: 'ram',
            title: 'RAM Usage',
            subtitle: 'Overall Usage',
            value: avgRamUsage === null ? 'N/A' : `${avgRamUsage}%`,
            icon: 'ram',
            tone: 'purple',
            progress: avgRamUsage ?? undefined,
        },
        {
            key: 'disk',
            title: 'Disk Usage',
            subtitle: 'Overall Usage',
            value: avgDiskUsage === null ? 'N/A' : `${avgDiskUsage}%`,
            icon: 'disk',
            tone: 'cyan',
            progress: avgDiskUsage ?? undefined,
        },
        {
            key: 'network',
            title: 'Network',
            subtitle: 'Inbound / Outbound',
            value: stats.length ? bytesToHuman(networkTotal) : 'N/A',
            icon: 'network',
            tone: 'cyan',
            sparkline: stats.length ? [12, 18, 16, 38, 21, 19, 27, 24, 35, 18] : undefined,
        },
        {
            key: 'active',
            title: 'Active Servers',
            subtitle: 'Currently Online',
            value: activeLabel,
            icon: 'layers',
            tone: 'green',
            progress: stats.length && visibleServers.length ? (activeServers / visibleServers.length) * 100 : undefined,
            progressType: 'bar',
        },
    ];
};

const buildSidebarItems = (rootAdmin: boolean): Zy4NavItem[] => [
    { key: 'dashboard', label: 'Dashboard', href: '/', icon: 'grid', exact: true },
    { key: 'servers', label: 'Servers', href: '/', icon: 'server', exact: true },
    { key: 'account', label: 'Account', href: '/account', icon: 'settings' },
    { key: 'api', label: 'API Credentials', href: '/account/api', icon: 'database' },
    { key: 'ssh', label: 'SSH Keys', href: '/account/ssh', icon: 'shield' },
    { key: 'activity', label: 'Activity', href: '/account/activity', icon: 'activity' },
    ...(rootAdmin ? [{ key: 'admin' as const, label: 'Admin', href: '/admin', icon: 'layers' as const, external: true }] : []),
];

const Zy4DashboardLoading = () => (
    <div className="zy4-loading-grid" aria-label="Loading dashboard">
        {Array.from({ length: 8 }, (_, index) => (
            <span key={index} />
        ))}
    </div>
);

export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');
    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const [resourceStats, setResourceStats] = useState<Record<string, ServerStats>>({});
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const userData = useStoreState((state) => state.user.data) as PterodactylUser | undefined;
    const rootAdmin = Boolean(userData?.rootAdmin);
    const uuid = useStoreState((state) => state.user.data?.uuid) || 'zy4-user';
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        setPage(1);
    }, [showOnlyAdmin]);

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage, servers?.items.length]);

    useEffect(() => {
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    useEffect(() => {
        let mounted = true;

        if (!servers?.items.length) {
            setResourceStats({});
            return () => {
                mounted = false;
            };
        }

        Promise.all(
            servers.items.map((server) =>
                getServerResourceUsage(server.uuid)
                    .then((stats) => [server.uuid, stats] as const)
                    .catch(() => null)
            )
        ).then((results) => {
            if (!mounted) {
                return;
            }

            setResourceStats(
                results.reduce<Record<string, ServerStats>>((current, result) => {
                    if (result) {
                        current[result[0]] = result[1];
                    }

                    return current;
                }, {})
            );
        });

        return () => {
            mounted = false;
        };
    }, [servers?.items]);

    const zy4User: Zy4User = {
        name: userData?.username || 'CaptainZy4',
        email: userData?.email,
        role: userData?.roleName || (rootAdmin ? 'Administrator' : 'Member'),
        avatarUrl: userData?.avatarURL,
    };

    const serverCards = useMemo(
        () => (servers ? servers.items.map((server, index) => serverToCard(server, index, resourceStats[server.uuid])) : undefined),
        [servers?.items, resourceStats]
    );
    const heroMetrics = useMemo(() => buildHeroMetrics(servers, userData ? '1' : 'N/A'), [servers, userData]);
    const stats = useMemo(() => buildStats(servers, resourceStats), [servers, resourceStats]);
    const sidebarItems = useMemo(() => buildSidebarItems(rootAdmin), [rootAdmin]);

    const logout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            window.location.href = '/';
        });
    };

    const adminToggle = rootAdmin ? (
        <button
            aria-label={showOnlyAdmin ? "Showing others' servers. Switch to my servers." : 'Showing your servers. Switch to admin view.'}
            className={showOnlyAdmin ? 'zy4-topbar-button zy4-admin-topbar-toggle zy4-admin-topbar-toggle-active' : 'zy4-topbar-button zy4-admin-topbar-toggle'}
            title={showOnlyAdmin ? "Showing others' servers" : 'Showing your servers'}
            type="button"
            onClick={() => setShowOnlyAdmin((value) => !value)}
        >
            <Zy4Icon name="shield" />
        </button>
    ) : undefined;

    return (
        <Zy4Layout
            active="dashboard"
            isLoggingOut={isLoggingOut}
            onLogout={logout}
            sidebarItems={sidebarItems}
            topbarActionSlot={adminToggle}
            user={zy4User}
        >
            {!servers && !error ? (
                <Zy4DashboardLoading />
            ) : error ? (
                <div className="zy4-dashboard-error" role="alert">
                    <Zy4Icon name="activity" size={28} aria-hidden />
                    <strong>Could not load your servers</strong>
                    <p>The original Pterodactyl API returned an error. Check the panel flash message for details.</p>
                </div>
            ) : (
                <>
                    <Zy4Dashboard
                        heroMetrics={heroMetrics}
                        showAnalyticsPanel={false}
                        showConsolePanel={false}
                        stats={stats}
                        servers={serverCards}
                        serversHref="/"
                        createServerHref={rootAdmin ? '/admin/servers/new' : undefined}
                        user={zy4User}
                    />

                    {servers && servers.pagination.totalPages > 1 && (
                        <div className="zy4-pagination">
                            <button disabled={page <= 1} type="button" onClick={() => setPage((value) => value - 1)}>
                                Previous
                            </button>
                            <span>
                                Page {servers.pagination.currentPage} of {servers.pagination.totalPages}
                            </span>
                            <button
                                disabled={page >= servers.pagination.totalPages}
                                type="button"
                                onClick={() => setPage((value) => value + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </Zy4Layout>
    );
};
