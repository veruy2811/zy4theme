import React from 'react';
import { Link } from 'react-router-dom';
import {
    zy4AnalyticsLabels,
    zy4AnalyticsSeries,
    zy4AnalyticsSummary,
    zy4ConsoleLogs,
    zy4HeroMetrics,
    zy4MetricCards,
    zy4ServerCards,
} from '../data/zy4DemoData';
import type {
    Zy4AnalyticsSeries,
    Zy4AnalyticsSummary,
    Zy4HeroMetric,
    Zy4MetricCardData,
    Zy4ServerCardData,
    Zy4User,
} from '../data/zy4DemoData';
import { Zy4Analytics } from './Zy4Analytics';
import { Zy4ConsolePreview } from './Zy4ConsolePreview';
import { Zy4Hero } from './Zy4Hero';
import { Zy4Icon } from './Zy4Icons';
import { Zy4ServerCard } from './Zy4ServerCard';
import { Zy4StatsCard } from './Zy4StatsCard';

interface Zy4DashboardProps {
    user?: Zy4User;
    heroMetrics?: Zy4HeroMetric[];
    stats?: Zy4MetricCardData[];
    consoleLogs?: string[];
    consoleHref?: string;
    analyticsLabels?: string[];
    analyticsSeries?: Zy4AnalyticsSeries[];
    analyticsSummary?: Zy4AnalyticsSummary[];
    servers?: Zy4ServerCardData[];
    serversHref?: string;
    createServerHref?: string;
    showConsolePanel?: boolean;
    showAnalyticsPanel?: boolean;
}

export const Zy4Dashboard = ({
    user,
    heroMetrics = zy4HeroMetrics,
    stats = zy4MetricCards,
    consoleLogs = zy4ConsoleLogs,
    consoleHref,
    analyticsLabels = zy4AnalyticsLabels,
    analyticsSeries = zy4AnalyticsSeries,
    analyticsSummary = zy4AnalyticsSummary,
    servers = zy4ServerCards,
    serversHref = '/',
    createServerHref = '/admin/servers/new',
    showConsolePanel = true,
    showAnalyticsPanel = true,
}: Zy4DashboardProps) => (
    <div className="zy4-dashboard">
        <Zy4Hero metrics={heroMetrics} userName={user?.name} />

        <section className="zy4-stats-grid" aria-label="Resource overview">
            {stats.map((metric) => (
                <Zy4StatsCard key={metric.key} metric={metric} />
            ))}
        </section>

        {(showConsolePanel || showAnalyticsPanel) && (
            <div className="zy4-mid-grid">
                {showConsolePanel && <Zy4ConsolePreview consoleHref={consoleHref} logs={consoleLogs} />}
                {showAnalyticsPanel && (
                    <Zy4Analytics labels={analyticsLabels} series={analyticsSeries} summary={analyticsSummary} />
                )}
            </div>
        )}

        <section className="zy4-card zy4-servers-section" aria-labelledby="zy4-servers-title">
            <div className="zy4-section-header">
                <div>
                    <Zy4Icon name="layers" size={22} aria-hidden />
                    <h2 id="zy4-servers-title">Your Servers</h2>
                </div>
                <div className="zy4-section-actions">
                    <Link className="zy4-secondary-button" to={serversHref}>
                        View All Servers
                    </Link>
                    {createServerHref && (
                        <a className="zy4-primary-button" href={createServerHref}>
                            <Zy4Icon name="plus" size={18} aria-hidden />
                            Create Server
                        </a>
                    )}
                </div>
            </div>
            <div className="zy4-server-grid">
                {servers.length > 0 ? (
                    servers.map((server) => <Zy4ServerCard key={server.id} server={server} />)
                ) : (
                    <div className="zy4-empty-servers">
                        <Zy4Icon name="server" size={28} aria-hidden />
                        <strong>No servers found</strong>
                        <p>Your Pterodactyl account does not have any visible servers yet.</p>
                    </div>
                )}
            </div>
        </section>
    </div>
);
