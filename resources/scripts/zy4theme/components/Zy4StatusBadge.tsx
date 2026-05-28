import React from 'react';
import type { Zy4ServerStatus } from '../data/zy4DemoData';

interface Zy4StatusBadgeProps {
    status: Zy4ServerStatus;
    label?: string;
    className?: string;
}

const statusLabels: Record<Zy4ServerStatus, string> = {
    online: 'Online',
    offline: 'Offline',
    starting: 'Starting',
    stopping: 'Stopping',
    installing: 'Installing',
    suspended: 'Suspended',
    unknown: 'Unknown',
};

export const Zy4StatusBadge = ({ status, label, className }: Zy4StatusBadgeProps) => (
    <span className={className ? `zy4-status zy4-status-${status} ${className}` : `zy4-status zy4-status-${status}`}>
        <span className="zy4-status-dot" aria-hidden="true" />
        {label ?? statusLabels[status]}
    </span>
);
