import React from 'react';

interface Zy4SparklineProps {
    values: number[];
    className?: string;
    color?: string;
    height?: number;
    width?: number;
    showFill?: boolean;
}

const buildPath = (values: number[], width: number, height: number) => {
    const points = values.length > 1 ? values : [0, 0];
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const step = width / (points.length - 1);

    return points
        .map((value, index) => {
            const x = Number((index * step).toFixed(2));
            const y = Number((height - ((value - min) / range) * height).toFixed(2));

            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');
};

export const Zy4Sparkline = ({
    values,
    className,
    color = 'var(--zy4-primary)',
    height = 42,
    width = 120,
    showFill = false,
}: Zy4SparklineProps) => {
    const linePath = buildPath(values, width, height);
    const fillPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

    return (
        <svg
            className={className ? `zy4-sparkline ${className}` : 'zy4-sparkline'}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            {showFill && <path d={fillPath} fill={color} opacity="0.14" />}
            <path d={linePath} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
    );
};

