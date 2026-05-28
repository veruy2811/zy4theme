import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Can from '@/components/elements/Can';
import { zy4NavItems, zy4StatusSparkline } from '../data/zy4DemoData';
import type { Zy4NavItem, Zy4NavKey } from '../data/zy4DemoData';
import { Zy4Icon } from './Zy4Icons';
import { Zy4Sparkline } from './Zy4Sparkline';

interface Zy4SidebarProps {
    active?: Zy4NavKey;
    collapsed?: boolean;
    items?: Zy4NavItem[];
    onCollapse?: (collapsed: boolean) => void;
}

export const Zy4Sidebar = ({ active = 'dashboard', collapsed, items = zy4NavItems, onCollapse }: Zy4SidebarProps) => {
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const isCollapsed = collapsed ?? internalCollapsed;

    const toggleSidebar = () => {
        const nextValue = !isCollapsed;

        if (onCollapse) {
            onCollapse(nextValue);
            return;
        }

        setInternalCollapsed(nextValue);
    };

    return (
        <aside className={isCollapsed ? 'zy4-sidebar zy4-sidebar-collapsed' : 'zy4-sidebar'}>
            <div className="zy4-brand">
                <NavLink to="/" exact aria-label="ZY4 Theme dashboard">
                    <span>ZY4</span>
                    <strong>THEME</strong>
                    <small>PTERODACTYL PANEL</small>
                </NavLink>
                <button aria-label="Collapse sidebar" className="zy4-sidebar-toggle" onClick={toggleSidebar} type="button">
                    <Zy4Icon name="chevronsLeft" size={18} />
                </button>
            </div>

            <nav className="zy4-nav" aria-label="Primary navigation">
                {items.map((item) => {
                    const isActive = active === item.key;
                    const className = isActive ? 'zy4-nav-item zy4-nav-item-active' : 'zy4-nav-item';
                    const navItem = item.external ? (
                        <a
                            aria-current={isActive ? 'page' : undefined}
                            className={className}
                            href={item.href}
                            key={item.key}
                        >
                            <Zy4Icon name={item.icon} size={22} />
                            <span>{item.label}</span>
                        </a>
                    ) : (
                        <NavLink
                            aria-current={isActive ? 'page' : undefined}
                            className={className}
                            activeClassName="zy4-nav-item-active"
                            exact={item.exact}
                            key={item.key}
                            to={item.href}
                        >
                            <Zy4Icon name={item.icon} size={22} />
                            <span>{item.label}</span>
                        </NavLink>
                    );

                    return item.permission ? (
                        <Can key={item.key} action={item.permission} matchAny>
                            {navItem}
                        </Can>
                    ) : (
                        navItem
                    );
                })}
            </nav>

            <div className="zy4-sidebar-spacer" />

            <section className="zy4-status-card" aria-label="Panel Status">
                <div>
                    <p>
                        <span aria-hidden="true" />
                        Panel Status
                    </p>
                    <strong>Online</strong>
                    <small>All systems operational</small>
                </div>
                <Zy4Sparkline values={zy4StatusSparkline} color="var(--zy4-primary)" />
            </section>

            <footer className="zy4-sidebar-footer">
                <p>&copy; 2026 ZY4 Theme</p>
                <p>
                    Crafted for Performance
                    <Zy4Icon name="heart" size={14} />
                </p>
            </footer>
        </aside>
    );
};
