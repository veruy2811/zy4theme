import React from 'react';
import { Link } from 'react-router-dom';
import type { Zy4ServerCardData } from '../data/zy4DemoData';
import { Zy4Icon } from './Zy4Icons';
import { Zy4Sparkline } from './Zy4Sparkline';
import { Zy4StatusBadge } from './Zy4StatusBadge';

interface Zy4ServerCardProps {
    server: Zy4ServerCardData;
}

const toneColor: Record<Zy4ServerCardData['tone'], string> = {
    blue: 'var(--zy4-blue)',
    purple: 'var(--zy4-primary)',
    cyan: 'var(--zy4-cyan)',
    green: 'var(--zy4-green)',
};

export const Zy4ServerCard = ({ server }: Zy4ServerCardProps) => {
    const menuControl = (
        <span aria-hidden="true" className="zy4-icon-button">
            <span aria-hidden="true">...</span>
        </span>
    );

    const body = (
        <>
            <div className="zy4-server-icon" aria-hidden="true">
                {server.iconUrl ? <img alt="" src={server.iconUrl} /> : <span>{server.iconLabel ?? server.name.slice(0, 2)}</span>}
            </div>
            <div className="zy4-server-info">
                <h3>{server.name}</h3>
                <p>{server.domain}</p>
                <div className="zy4-server-meta">
                    <span>{server.cpu} CPU</span>
                    <span>{server.ram} RAM</span>
                    <Zy4StatusBadge status={server.status} />
                </div>
            </div>
            <div className="zy4-server-side">
                {menuControl}
                <Zy4Sparkline values={server.sparkline} color={toneColor[server.tone]} showFill />
            </div>
        </>
    );

    return server.href ? (
        <Link className={`zy4-card zy4-server-card zy4-tone-${server.tone}`} to={server.href}>
            {body}
        </Link>
    ) : (
        <article className={`zy4-card zy4-server-card zy4-tone-${server.tone}`}>{body}</article>
    );
};
