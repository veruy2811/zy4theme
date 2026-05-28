import React from 'react';

export type Zy4IconName =
    | 'activity'
    | 'arrowRight'
    | 'bell'
    | 'chevronDown'
    | 'chevronsLeft'
    | 'command'
    | 'console'
    | 'cpu'
    | 'database'
    | 'disk'
    | 'external'
    | 'files'
    | 'grid'
    | 'heart'
    | 'layers'
    | 'network'
    | 'plus'
    | 'ram'
    | 'schedule'
    | 'search'
    | 'server'
    | 'settings'
    | 'shield'
    | 'terminal'
    | 'users';

interface Zy4IconProps {
    name: Zy4IconName;
    className?: string;
    size?: number;
    strokeWidth?: number;
    'aria-hidden'?: boolean;
}

const iconPaths: Record<Zy4IconName, React.ReactNode> = {
    activity: <path d="M3 12h4l2.5-7 5 14 2.5-7h4" />,
    arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
    bell: (
        <>
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
        </>
    ),
    chevronDown: <path d="m6 9 6 6 6-6" />,
    chevronsLeft: (
        <>
            <path d="m11 17-5-5 5-5" />
            <path d="m18 17-5-5 5-5" />
        </>
    ),
    command: (
        <>
            <path d="M9 7H7a3 3 0 1 1 3-3v16a3 3 0 1 1-3-3h10a3 3 0 1 1-3 3V4a3 3 0 1 1 3 3H7" />
            <path d="M9 12h6" />
        </>
    ),
    console: (
        <>
            <path d="m4 17 6-6-6-6" />
            <path d="M12 19h8" />
        </>
    ),
    cpu: (
        <>
            <rect x="7" y="7" width="10" height="10" rx="2" />
            <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
        </>
    ),
    database: (
        <>
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
            <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
        </>
    ),
    disk: (
        <>
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M8 7h8M8 17h8M9 13h6" />
        </>
    ),
    external: (
        <>
            <path d="M14 3h7v7" />
            <path d="M10 14 21 3" />
            <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
        </>
    ),
    files: (
        <>
            <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
            <path d="M3 10h18" />
        </>
    ),
    grid: (
        <>
            <rect x="4" y="4" width="6" height="6" rx="1.5" />
            <rect x="14" y="4" width="6" height="6" rx="1.5" />
            <rect x="4" y="14" width="6" height="6" rx="1.5" />
            <rect x="14" y="14" width="6" height="6" rx="1.5" />
        </>
    ),
    heart: (
        <path
            d="M20.8 5.8a5.1 5.1 0 0 0-7.2 0L12 7.4l-1.6-1.6a5.1 5.1 0 1 0-7.2 7.2L12 21.8l8.8-8.8a5.1 5.1 0 0 0 0-7.2Z"
            fill="currentColor"
            stroke="none"
        />
    ),
    layers: (
        <>
            <path d="m12 2 9 5-9 5-9-5z" />
            <path d="m3 12 9 5 9-5" />
            <path d="m3 17 9 5 9-5" />
        </>
    ),
    network: (
        <>
            <circle cx="12" cy="5" r="3" />
            <circle cx="5" cy="19" r="3" />
            <circle cx="19" cy="19" r="3" />
            <path d="M10.8 7.7 6.2 16.3M13.2 7.7l4.6 8.6M8 19h8" />
        </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    ram: (
        <>
            <rect x="5" y="7" width="14" height="10" rx="2" />
            <path d="M8 10h8M8 14h8M7 17v3M12 17v3M17 17v3M7 4v3M12 4v3M17 4v3" />
        </>
    ),
    schedule: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
        </>
    ),
    search: (
        <>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </>
    ),
    server: (
        <>
            <rect x="4" y="4" width="16" height="6" rx="2" />
            <rect x="4" y="14" width="16" height="6" rx="2" />
            <path d="M8 7h.01M8 17h.01M12 7h4M12 17h4" />
        </>
    ),
    settings: (
        <>
            <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9c.3.6.9 1 1.6 1h.2a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z" />
        </>
    ),
    shield: (
        <>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-5" />
        </>
    ),
    terminal: (
        <>
            <path d="m4 17 6-6-6-6" />
            <path d="M12 19h8" />
        </>
    ),
    users: (
        <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
        </>
    ),
};

export const Zy4Icon = ({ name, className, size = 20, strokeWidth = 2, ...rest }: Zy4IconProps) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        aria-hidden={rest['aria-hidden'] ?? true}
    >
        {iconPaths[name]}
    </svg>
);

