import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { zy4UserFallback } from '../data/zy4DemoData';
import type { Zy4User } from '../data/zy4DemoData';
import { Zy4Icon } from './Zy4Icons';

interface Zy4AccountLink {
    label: string;
    to: string;
    icon?: 'settings' | 'database' | 'activity' | 'shield';
}

interface Zy4TopbarProps {
    user?: Zy4User;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    actionSlot?: React.ReactNode;
    accountLinks?: Zy4AccountLink[];
    isLoggingOut?: boolean;
    onLogout?: () => void;
}

const getInitials = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

const defaultAccountLinks: Zy4AccountLink[] = [];

export const Zy4Topbar = ({
    user = zy4UserFallback,
    searchValue = '',
    onSearchChange,
    actionSlot,
    accountLinks = defaultAccountLinks,
    isLoggingOut = false,
    onLogout,
}: Zy4TopbarProps) => {
    const [internalSearchValue, setInternalSearchValue] = useState(searchValue);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const value = onSearchChange ? searchValue : internalSearchValue;

    useEffect(() => {
        const closeMenus = (event: MouseEvent) => {
            const target = event.target as Node;

            if (profileRef.current && !profileRef.current.contains(target)) {
                setProfileOpen(false);
            }

            if (notificationsRef.current && !notificationsRef.current.contains(target)) {
                setNotificationsOpen(false);
            }
        };

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setProfileOpen(false);
                setNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', closeMenus);
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.removeEventListener('mousedown', closeMenus);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, []);

    return (
        <header className="zy4-topbar">
            <label className="zy4-search">
                <Zy4Icon name="search" size={22} aria-hidden />
                <input
                    aria-label="Search anything"
                    onChange={(event) => {
                        setInternalSearchValue(event.target.value);
                        onSearchChange?.(event.target.value);
                    }}
                    placeholder="Search anything..."
                    value={value}
                />
                <kbd>CTRL K</kbd>
            </label>

            <div className="zy4-topbar-actions">
                {actionSlot}
                <Link aria-label="Open activity" className="zy4-topbar-button" to="/account/activity">
                    <Zy4Icon name="activity" />
                </Link>
                <Link aria-label="View servers" className="zy4-topbar-button" to="/">
                    <Zy4Icon name="layers" />
                </Link>
                <div className="zy4-dropdown-wrap" ref={notificationsRef}>
                    <button
                        aria-expanded={notificationsOpen}
                        aria-haspopup="menu"
                        aria-label="View notifications"
                        className="zy4-topbar-button zy4-notification-button"
                        type="button"
                        onClick={() => setNotificationsOpen((open) => !open)}
                    >
                        <Zy4Icon name="bell" />
                        <span>3</span>
                    </button>
                    {notificationsOpen && (
                        <div className="zy4-dropdown zy4-notifications-dropdown" role="menu">
                            <strong>Notifications</strong>
                            <p>No new panel notifications.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="zy4-profile-wrap" ref={profileRef}>
                <button
                    aria-expanded={profileOpen}
                    aria-haspopup="menu"
                    className="zy4-profile-button"
                    type="button"
                    onClick={() => setProfileOpen((open) => !open)}
                >
                    <span className="zy4-avatar">
                        {user.avatarUrl ? <img alt="" src={user.avatarUrl} /> : getInitials(user.name)}
                        <i aria-hidden="true" />
                    </span>
                    <span className="zy4-profile-copy">
                        <strong>{user.name}</strong>
                        <small>{user.role ?? 'Administrator'}</small>
                    </span>
                    <Zy4Icon name="chevronDown" size={18} aria-hidden />
                </button>

                {profileOpen && (
                    <div className="zy4-dropdown zy4-account-dropdown" role="menu">
                        <div className="zy4-account-head">
                            <span className="zy4-avatar">
                                {user.avatarUrl ? <img alt="" src={user.avatarUrl} /> : getInitials(user.name)}
                                <i aria-hidden="true" />
                            </span>
                            <div>
                                <strong>{user.name}</strong>
                                {user.email && <small>{user.email}</small>}
                            </div>
                        </div>
                        {accountLinks.length > 0 && (
                            <>
                                <div className="zy4-dropdown-divider" />
                                {accountLinks.map((link) => (
                                    <Link key={link.to} role="menuitem" to={link.to} onClick={() => setProfileOpen(false)}>
                                        <Zy4Icon name={link.icon ?? 'settings'} size={17} aria-hidden />
                                        {link.label}
                                    </Link>
                                ))}
                            </>
                        )}
                        {onLogout && (
                            <>
                                <div className="zy4-dropdown-divider" />
                                <button className="zy4-logout-button" role="menuitem" type="button" onClick={onLogout}>
                                    <Zy4Icon name="arrowRight" size={17} aria-hidden />
                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};
