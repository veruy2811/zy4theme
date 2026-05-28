import React from 'react';
import type { Zy4MetricCardData } from '../data/zy4DemoData';
import { Zy4Icon } from './Zy4Icons';
import { Zy4ProgressRing } from './Zy4ProgressRing';
import { Zy4Sparkline } from './Zy4Sparkline';

interface Zy4StatsCardProps {
    metric: Zy4MetricCardData;
}

const toneColor: Record<Zy4MetricCardData['tone'], string> = {
    blue: 'var(--zy4-blue)',
    purple: 'var(--zy4-primary)',
    cyan: 'var(--zy4-cyan)',
    green: 'var(--zy4-green)',
    amber: 'var(--zy4-warning)',
    danger: 'var(--zy4-danger)',
};

export const Zy4StatsCard = ({ metric }: Zy4StatsCardProps) => {
    const color = toneColor[metric.tone];

    return (
        <article className={`zy4-card zy4-stat-card zy4-tone-${metric.tone}`}>
            <div className="zy4-stat-icon" aria-hidden="true">
                <Zy4Icon name={metric.icon} size={24} />
            </div>
            <div className="zy4-stat-copy">
                <h3>{metric.title}</h3>
                <p>{metric.subtitle}</p>
                <strong>{metric.value}</strong>
            </div>
            <div className="zy4-stat-visual">
                {metric.sparkline ? (
                    <Zy4Sparkline values={metric.sparkline} color={color} showFill />
                ) : metric.progressType === 'bar' && typeof metric.progress === 'number' ? (
                    <div className="zy4-stat-bar" aria-label={`Progress ${Math.round(metric.progress)} percent`}>
                        <span style={{ width: `${Math.max(0, Math.min(100, metric.progress))}%` }} />
                    </div>
                ) : typeof metric.progress === 'number' ? (
                    <Zy4ProgressRing value={metric.progress} color={color} label="" />
                ) : null}
            </div>
        </article>
    );
};

