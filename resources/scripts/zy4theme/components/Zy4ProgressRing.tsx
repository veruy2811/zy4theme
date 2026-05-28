import React from 'react';

interface Zy4ProgressRingProps {
    value: number;
    label?: string;
    color?: string;
    className?: string;
}

const clampPercentage = (value: number) => Math.max(0, Math.min(100, value));

export const Zy4ProgressRing = ({
    value,
    label,
    color = 'var(--zy4-primary)',
    className,
}: Zy4ProgressRingProps) => {
    const progress = clampPercentage(value);
    const style = {
        '--zy4-progress': `${progress}%`,
        '--zy4-ring-color': color,
    } as React.CSSProperties;

    return (
        <div
            className={className ? `zy4-progress-ring ${className}` : 'zy4-progress-ring'}
            style={style}
            aria-label={`Progress ${Math.round(progress)} percent`}
            role="img"
        >
            <span>{label ?? `${Math.round(progress)}%`}</span>
        </div>
    );
};

