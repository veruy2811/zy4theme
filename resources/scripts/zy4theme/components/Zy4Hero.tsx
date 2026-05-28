import React from 'react';
import { zy4HeroMetrics } from '../data/zy4DemoData';
import type { Zy4HeroMetric } from '../data/zy4DemoData';
import { Zy4Icon } from './Zy4Icons';

interface Zy4HeroProps {
    metrics?: Zy4HeroMetric[];
    userName?: string;
    titlePrefix?: string;
    titleAccent?: string;
    description?: string;
}

export const Zy4Hero = ({
    metrics = zy4HeroMetrics,
    userName,
    titlePrefix = 'ZY4',
    titleAccent = 'Theme',
    description = 'Next-gen Pterodactyl theme with futuristic design, powerful features, and unmatched performance.',
}: Zy4HeroProps) => (
    <section className="zy4-hero zy4-card" aria-labelledby="zy4-hero-title">
        <div className="zy4-hero-stars" aria-hidden="true" />
        <div className="zy4-hero-planet" aria-hidden="true" />
        <div className="zy4-hero-copy">
            <p className="zy4-kicker">Welcome back{userName ? `, ${userName}` : ','}</p>
            <h1 id="zy4-hero-title">
                <span>{titlePrefix}</span> <span>{titleAccent}</span>
            </h1>
            <p>{description}</p>
        </div>
        <div className="zy4-hero-metrics" aria-label="Panel overview">
            {metrics.map((metric) => (
                <div className="zy4-hero-metric" key={metric.label}>
                    <span aria-hidden="true">
                        <Zy4Icon name={metric.icon} size={24} />
                    </span>
                    <div>
                        <p>{metric.label}</p>
                        <strong>{metric.value}</strong>
                    </div>
                </div>
            ))}
        </div>
        <div className="zy4-hero-mark" aria-hidden="true">
            ZY4
        </div>
    </section>
);

