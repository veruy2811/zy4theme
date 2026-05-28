# ZY4 Theme

React/TypeScript theme module for Pterodactyl Panel.

## Auto installer

After this repository is uploaded to GitHub, install from a Pterodactyl server with:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/veruy2811/zy4theme/main/install.sh)
```

Menu:

```text
1) Install / Update ZY4 Theme
2) Restore Backup
3) Exit
```

Default paths:

```bash
PANEL_DIR=/var/www/pterodactyl
BACKUP_ROOT=/var/www/zy4theme-backups
```

Direct commands:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/veruy2811/zy4theme/main/install.sh) install
bash <(curl -fsSL https://raw.githubusercontent.com/veruy2811/zy4theme/main/install.sh) restore
```

The installer patches the Pterodactyl dashboard route by replacing `resources/scripts/components/dashboard/DashboardContainer.tsx` with a ZY4 wrapper and hiding the old dashboard navigation on `/`.

Server detail routes are wrapped by the ZY4 shell, but console websocket, file manager, databases, schedules, backups, network, startup, settings, subusers, permissions, and power actions continue to use upstream Pterodactyl components and route guards.

The Pterodactyl dashboard wrapper disables preview-only demo panels. Fake logs, demo analytics, and hardcoded resource numbers are only kept in reusable preview components, not in the installed dashboard route.

The backup contains Pterodactyl panel files only, not the MySQL database.

## Import

Add the theme import in the frontend entrypoint, commonly `resources/scripts/index.tsx` or the app bootstrap file:

```ts
import { installZy4ThemeClass } from '@/zy4theme';

installZy4ThemeClass();
```

The import loads `styles/zy4-theme.css` through `zy4theme/index.ts`.

## Dashboard usage

Wrap the dashboard page with the layout and pass real Pterodactyl data when available:

```tsx
import { Zy4Dashboard, Zy4Layout } from '@/zy4theme';

export default () => (
    <Zy4Layout active="dashboard" user={currentUser}>
        <Zy4Dashboard user={currentUser} servers={servers} />
    </Zy4Layout>
);
```

Fallback demo data is used only when props are not passed.

## Notes

- Keep existing Pterodactyl API calls, websocket console logic, file manager logic, permissions, and power actions.
- Use ZY4 components as wrappers or visual replacements only around existing data and actions.
- The global CSS includes scoped `body.zy4-theme` rules for login, console, file manager, database, schedules, server detail, tables, modals, and navigation surfaces.
