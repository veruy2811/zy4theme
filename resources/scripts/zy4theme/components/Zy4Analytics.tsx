import React from 'react';
import {
    zy4AnalyticsLabels,
    zy4AnalyticsSeries,
    zy4AnalyticsSummary,
} from '../data/zy4DemoData';
import type { Zy4AnalyticsSeries, Zy4AnalyticsSummary } from '../data/zy4DemoData';
import { Zy4Icon } from './Zy4Icons';

interface Zy4AnalyticsProps {
    labels?: string[];
    series?: Zy4AnalyticsSeries[];
    summary?: Zy4AnalyticsSummary[];
}

const seriesColor: Record<Zy4AnalyticsSeries['color'], string> = {
    blue: 'var(--zy4-blue)',
    purple: 'var(--zy4-primary)',
    cyan: 'var(--zy4-cyan)',
    green: 'var(--zy4-green)',
};

const buildLinePath = (values: number[], width: number, height: number) => {
    const step = width / Math.max(1, values.length - 1);

    return values
        .map((value, index) => {
            const x = Number((index * step).toFixed(2));
            const y = Number((height - (Math.max(0, Math.min(100, value)) / 100) * height).toFixed(2));

            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');
};

export const Zy4Analytics = ({
    labels = zy4AnalyticsLabels,
    series = zy4AnalyticsSeries,
    summary = zy4AnalyticsSummary,
}: Zy4AnalyticsProps) => {
    const width = 620;
    const height = 190;

    return (
        <section className="zy4-card zy4-analytics" aria-labelledby="zy4-analytics-title">
            <div className="zy4-panel-header">
                <div>
                    <Zy4Icon name="activity" size={22} aria-hidden />
                    <h2 id="zy4-analytics-title">Analytics Overview</h2>
                </div>
                <span className="zy4-select-button" aria-label="Analytics period">
                    Last 7 Days
                    <Zy4Icon name="chevronDown" size={16} aria-hidden />
                </span>
            </div>

            <div className="zy4-chart-wrap">
                <div className="zy4-chart-legend">
                    {series.map((item) => (
                        <span key={item.label}>
                            <i style={{ backgroundColor: seriesColor[item.color] }} />
                            {item.label}
                        </span>
                    ))}
                </div>
                <svg className="zy4-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img">
                    <title>CPU and RAM usage trend</title>
                    <defs>
                        <linearGradient id="zy4-chart-blue-area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="zy4-chart-purple-area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.32" />
                            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {[0, 25, 50, 75, 100].map((tick) => {
                        const y = height - (tick / 100) * height;

                        return (
                            <g key={tick} className="zy4-chart-grid">
                                <line x1="0" x2={width} y1={y} y2={y} />
                                <text x="0" y={Math.max(11, y - 4)}>
                                    {tick}
                                </text>
                            </g>
                        );
                    })}
                    {series.map((item) => {
                        const linePath = buildLinePath(item.values, width, height);
                        const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

                        return (
                            <g key={item.label}>
                                <path
                                    className="zy4-chart-area"
                                    d={areaPath}
                                    fill={`url(#zy4-chart-${item.color === 'purple' ? 'purple' : 'blue'}-area)`}
                                />
                                <path
                                    className={`zy4-chart-line zy4-chart-line-${item.color}`}
                                    d={linePath}
                                    fill="none"
                                    stroke={seriesColor[item.color]}
                                />
                            </g>
                        );
                    })}
                </svg>
                <div className="zy4-chart-labels" aria-hidden="true">
                    {labels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>
            </div>

            <div className="zy4-analytics-summary">
                {summary.map((item) => (
                    <article className={`zy4-mini-card zy4-tone-${item.tone}`} key={item.label}>
                        <Zy4Icon name={item.icon} size={22} aria-hidden />
                        <div>
                            <p>{item.label}</p>
                            <strong>{item.value}</strong>
                            <span>{item.delta}</span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};
