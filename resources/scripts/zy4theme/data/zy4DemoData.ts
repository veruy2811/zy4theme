import type { Zy4IconName } from '../components/Zy4Icons';

export type Zy4NavKey =
    | 'dashboard'
    | 'servers'
    | 'account'
    | 'api'
    | 'ssh'
    | 'activity'
    | 'admin'
    | 'console'
    | 'files'
    | 'databases'
    | 'schedules'
    | 'users'
    | 'backups'
    | 'network'
    | 'startup'
    | 'settings';

export type Zy4ServerStatus = 'online' | 'offline' | 'starting' | 'stopping' | 'installing' | 'suspended' | 'unknown';

export interface Zy4User {
    name: string;
    role?: string;
    email?: string;
    avatarUrl?: string;
}

export interface Zy4NavItem {
    key: Zy4NavKey;
    label: string;
    href: string;
    icon: Zy4IconName;
    external?: boolean;
    exact?: boolean;
    permission?: string | string[] | null;
}

export interface Zy4HeroMetric {
    label: string;
    value: string;
    icon: Zy4IconName;
}

export interface Zy4MetricCardData {
    key: string;
    title: string;
    subtitle: string;
    value: string;
    icon: Zy4IconName;
    tone: 'blue' | 'purple' | 'cyan' | 'green' | 'amber' | 'danger';
    progress?: number;
    progressType?: 'ring' | 'bar';
    sparkline?: number[];
}

export interface Zy4AnalyticsSeries {
    label: string;
    color: 'blue' | 'purple' | 'cyan' | 'green';
    values: number[];
}

export interface Zy4AnalyticsSummary {
    label: string;
    value: string;
    delta: string;
    icon: Zy4IconName;
    tone: 'blue' | 'purple' | 'cyan' | 'green';
}

export interface Zy4ServerCardData {
    id: string;
    name: string;
    domain: string;
    cpu: string;
    ram: string;
    status: Zy4ServerStatus;
    href?: string;
    iconLabel?: string;
    iconUrl?: string;
    sparkline: number[];
    tone: 'blue' | 'purple' | 'cyan' | 'green';
}

export const zy4UserFallback: Zy4User = {
    name: 'CaptainZy4',
    role: 'Administrator',
};

export const zy4NavItems: Zy4NavItem[] = [
    { key: 'dashboard', label: 'Dashboard', href: '/', icon: 'grid', exact: true },
    { key: 'servers', label: 'Servers', href: '/', icon: 'server', exact: true },
    { key: 'account', label: 'Account', href: '/account', icon: 'settings' },
    { key: 'api', label: 'API Credentials', href: '/account/api', icon: 'database' },
    { key: 'ssh', label: 'SSH Keys', href: '/account/ssh', icon: 'shield' },
    { key: 'activity', label: 'Activity', href: '/account/activity', icon: 'activity' },
];

export const zy4HeroMetrics: Zy4HeroMetric[] = [
    { label: 'Servers', value: '12', icon: 'layers' },
    { label: 'Users', value: '48', icon: 'users' },
    { label: 'Uptime', value: '99.98%', icon: 'schedule' },
];

export const zy4MetricCards: Zy4MetricCardData[] = [
    {
        key: 'cpu',
        title: 'CPU Usage',
        subtitle: 'Overall Usage',
        value: '23.6%',
        icon: 'cpu',
        tone: 'blue',
        progress: 23.6,
    },
    {
        key: 'ram',
        title: 'RAM Usage',
        subtitle: 'Overall Usage',
        value: '48.7%',
        icon: 'ram',
        tone: 'purple',
        progress: 48.7,
    },
    {
        key: 'disk',
        title: 'Disk Usage',
        subtitle: 'Overall Usage',
        value: '61.2%',
        icon: 'disk',
        tone: 'cyan',
        progress: 61.2,
    },
    {
        key: 'network',
        title: 'Network',
        subtitle: 'Inbound / Outbound',
        value: '324.7 Mbps',
        icon: 'network',
        tone: 'cyan',
        sparkline: [12, 18, 16, 38, 21, 19, 27, 24, 35, 18],
    },
    {
        key: 'active',
        title: 'Active Servers',
        subtitle: 'Currently Online',
        value: '8 / 12',
        icon: 'layers',
        tone: 'green',
        progress: 66,
        progressType: 'bar',
    },
];

export const zy4ConsoleLogs = [
    '[14:23:11] [INFO] Starting server on 0.0.0.0:25565',
    '[14:23:11] [INFO] Using epoll channel type',
    '[14:23:11] [INFO] Paper 1.20.4 starting',
    '[14:23:12] [INFO] Loading libraries, please wait...',
    "[14:23:13] [INFO] Environment: authHost='https://authserver.mojang.com'",
    '[14:23:13] [INFO] Enabling plugins...',
    '[14:23:14] [INFO] Done! For help, type "help"',
    "[14:23:15] [INFO] [WorldGuard] Loaded configuration for world 'world'",
    '[14:23:16] [INFO] [Vault] Enabled Vault',
    '[14:23:16] [INFO] Server permissions file permissions.yml is empty, ignoring it',
    '[14:23:17] [INFO] Server is running with 0/100 players online.',
];

export const zy4AnalyticsLabels = ['May 12', 'May 13', 'May 14', 'May 15', 'May 16', 'May 17', 'May 18'];

export const zy4AnalyticsSeries: Zy4AnalyticsSeries[] = [
    { label: 'CPU Usage (%)', color: 'blue', values: [55, 50, 58, 76, 60, 88, 52] },
    { label: 'RAM Usage (%)', color: 'purple', values: [22, 30, 42, 38, 28, 40, 43] },
];

export const zy4AnalyticsSummary: Zy4AnalyticsSummary[] = [
    { label: 'Total Users', value: '48', delta: '+12%', icon: 'users', tone: 'blue' },
    { label: 'Total Servers', value: '12', delta: '+8%', icon: 'database', tone: 'cyan' },
    { label: 'Total Backups', value: '156', delta: '+18%', icon: 'layers', tone: 'purple' },
    { label: 'Total Databases', value: '32', delta: '+5%', icon: 'database', tone: 'cyan' },
];

export const zy4ServerCards: Zy4ServerCardData[] = [
    {
        id: 'minecraft-survival',
        name: 'Minecraft Survival',
        domain: 'minecraft-survival.zy4.net',
        cpu: '2.4%',
        ram: '4.2GB',
        status: 'online',
        iconLabel: 'MC',
        sparkline: [8, 12, 10, 34, 18, 16, 24, 12, 20, 22],
        tone: 'green',
    },
    {
        id: 'samp-roleplay',
        name: 'SA:MP Roleplay',
        domain: 'samp-roleplay.zy4.net',
        cpu: '11.6%',
        ram: '512MB',
        status: 'online',
        iconLabel: 'RP',
        sparkline: [16, 20, 42, 18, 38, 22, 45, 25, 50, 19],
        tone: 'purple',
    },
    {
        id: 'vps-hosting',
        name: 'VPS Hosting',
        domain: 'vps.zy4.net',
        cpu: '7.3%',
        ram: '2GB',
        status: 'online',
        iconLabel: 'VP',
        sparkline: [7, 10, 31, 18, 15, 12, 20, 19, 12, 24],
        tone: 'blue',
    },
    {
        id: 'node-app',
        name: 'Node.js App',
        domain: 'nodeapp.zy4.net',
        cpu: '3.1%',
        ram: '1GB',
        status: 'online',
        iconLabel: 'JS',
        sparkline: [10, 11, 26, 12, 13, 31, 16, 19, 12, 21],
        tone: 'cyan',
    },
];

export const zy4StatusSparkline = [8, 9, 13, 8, 15, 11, 26, 9, 12, 24, 10, 14];
