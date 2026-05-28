# ZY4 Theme

Dark futuristic Pterodactyl Panel frontend theme.

## Install

Run on your Pterodactyl server:

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

Direct install:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/veruy2811/zy4theme/main/install.sh) install
```

If you installed an older version and the panel only changed colors instead of showing the full ZY4 dashboard, run the install command again. The installer now patches `DashboardContainer.tsx` and `DashboardRouter.tsx` so the dashboard layout matches the preview.

The dashboard wrapper keeps Pterodactyl's original client API calls, account routes, server links, server resource usage endpoint, and logout endpoint. Account and server pages are wrapped in the ZY4 shell, while page content such as console, files, databases, schedules, backups, network, startup, users, and settings still uses the original Pterodactyl components and permissions.

In the Pterodactyl dashboard mode, ZY4 does not show demo console logs, demo analytics, or fake resource percentages. Values come from the client API/resource endpoint; when the panel does not expose a value, the widget shows `N/A` instead of fake data.

Direct restore:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/veruy2811/zy4theme/main/install.sh) restore
```

If your panel path is different:

```bash
PANEL_DIR=/path/to/pterodactyl bash <(curl -fsSL https://raw.githubusercontent.com/veruy2811/zy4theme/main/install.sh)
```

The installer backs up panel files to `/var/www/zy4theme-backups` before install and before restore. It does not back up or restore the MySQL database.
