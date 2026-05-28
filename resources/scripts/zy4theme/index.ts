import './styles/zy4-theme.css';

export { Zy4Analytics } from './components/Zy4Analytics';
export { Zy4ConsolePreview } from './components/Zy4ConsolePreview';
export { Zy4Dashboard } from './components/Zy4Dashboard';
export { Zy4Footer } from './components/Zy4Footer';
export { Zy4Hero } from './components/Zy4Hero';
export { Zy4Icon } from './components/Zy4Icons';
export { Zy4Layout } from './components/Zy4Layout';
export { Zy4PanelShell, buildZy4ClientSidebarItems } from './components/Zy4PanelShell';
export { Zy4ProgressRing } from './components/Zy4ProgressRing';
export { default as Zy4PterodactylDashboard } from './components/Zy4PterodactylDashboard';
export { Zy4ServerCard } from './components/Zy4ServerCard';
export { Zy4Sidebar } from './components/Zy4Sidebar';
export { Zy4Sparkline } from './components/Zy4Sparkline';
export { Zy4StatsCard } from './components/Zy4StatsCard';
export { Zy4StatusBadge } from './components/Zy4StatusBadge';
export { Zy4Topbar } from './components/Zy4Topbar';
export * from './data/zy4DemoData';

export const installZy4ThemeClass = () => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.classList.add('zy4-theme-root');
    document.body.classList.add('zy4-theme');
};
