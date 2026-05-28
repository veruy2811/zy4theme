#!/usr/bin/env bash

set -Eeuo pipefail

THEME_NAME="ZY4 Theme"
THEME_VERSION="v1.0.0"
DEFAULT_PANEL_DIR="/var/www/pterodactyl"
DEFAULT_BACKUP_ROOT="/var/www/zy4theme-backups"
REPO_OWNER="${ZY4_REPO_OWNER:-veruy2811}"
REPO_NAME="${ZY4_REPO_NAME:-zy4theme}"
REPO_BRANCH="${ZY4_REPO_BRANCH:-main}"
REPO_ARCHIVE_URL="${ZY4_REPO_ARCHIVE_URL:-https://github.com/${REPO_OWNER}/${REPO_NAME}/archive/refs/heads/${REPO_BRANCH}.tar.gz}"

PANEL_DIR="${PANEL_DIR:-$DEFAULT_PANEL_DIR}"
BACKUP_ROOT="${BACKUP_ROOT:-$DEFAULT_BACKUP_ROOT}"
TMP_DIR=""

cleanup() {
    if [[ -n "$TMP_DIR" && -d "$TMP_DIR" ]]; then
        rm -rf "$TMP_DIR"
    fi
}

trap cleanup EXIT

print_banner() {
    cat <<'BANNER'
============================================================
 ZY4 Theme Installer for Pterodactyl Panel
============================================================
BANNER
    echo "Panel path : $PANEL_DIR"
    echo "Backups    : $BACKUP_ROOT"
    echo
}

info() {
    echo "[INFO] $*" >&2
}

warn() {
    echo "[WARN] $*" >&2
}

fail() {
    echo "[ERROR] $*" >&2
    exit 1
}

need_command() {
    command -v "$1" >/dev/null 2>&1 || fail "Command '$1' tidak ditemukan."
}

ask_yes_no() {
    local prompt="$1"
    local default="${2:-Y}"
    local answer
    local suffix="[Y/n]"

    if [[ "$default" == "N" || "$default" == "n" ]]; then
        suffix="[y/N]"
    fi

    read -r -p "$prompt $suffix " answer || true
    answer="${answer:-$default}"

    [[ "$answer" == "Y" || "$answer" == "y" || "$answer" == "yes" || "$answer" == "YES" ]]
}

ensure_environment() {
    need_command tar
    need_command curl
    need_command mktemp
    need_command readlink

    [[ -d "$PANEL_DIR" ]] || fail "Folder panel tidak ditemukan: $PANEL_DIR"
    [[ -d "$PANEL_DIR/resources/scripts" ]] || fail "Ini tidak terlihat seperti frontend Pterodactyl: $PANEL_DIR/resources/scripts tidak ada."

    if [[ ! -w "$PANEL_DIR" || ! -w "$PANEL_DIR/resources/scripts" ]]; then
        fail "Tidak punya izin tulis ke $PANEL_DIR. Jalankan sebagai root, contoh: curl -fsSL https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}/install.sh | sudo bash"
    fi
}

resolve_path() {
    readlink -f "$1"
}

ensure_inside_panel() {
    local target="$1"
    local resolved_target
    local resolved_panel

    resolved_target="$(resolve_path "$target")"
    resolved_panel="$(resolve_path "$PANEL_DIR")"

    case "$resolved_target" in
        "$resolved_panel"/*) ;;
        *) fail "Path target di luar panel, operasi dibatalkan: $resolved_target" ;;
    esac
}

ensure_safe_panel_target() {
    local resolved_panel

    resolved_panel="$(resolve_path "$PANEL_DIR")"

    case "$resolved_panel" in
        "/"|"/var"|"/var/www"|"/usr"|"/opt"|"/home")
            fail "PANEL_DIR terlalu luas untuk operasi restore: $resolved_panel"
            ;;
    esac

    [[ -n "$resolved_panel" ]] || fail "PANEL_DIR tidak valid."
}

backup_modified_file() {
    local target="$1"
    local backup="$target.zy4-original"

    ensure_inside_panel "$target"

    if [[ -f "$target" && ! -f "$backup" ]]; then
        cp "$target" "$backup"
        info "Backup file original dibuat: $backup"
    fi
}

make_backup() {
    local reason="${1:-install}"
    local timestamp
    local panel_parent
    local panel_base
    local backup_file
    local manifest_file

    timestamp="$(date +%Y%m%d-%H%M%S)"
    panel_parent="$(dirname "$PANEL_DIR")"
    panel_base="$(basename "$PANEL_DIR")"
    backup_file="$BACKUP_ROOT/pterodactyl-${reason}-${timestamp}.tar.gz"
    manifest_file="${backup_file}.info"

    mkdir -p "$BACKUP_ROOT"
    case "$(resolve_path "$BACKUP_ROOT")" in
        "$(resolve_path "$PANEL_DIR")"/*)
            fail "BACKUP_ROOT tidak boleh berada di dalam PANEL_DIR agar backup tidak ikut ter-archive berulang."
            ;;
    esac

    info "Membuat backup panel ke: $backup_file"
    tar -czf "$backup_file" -C "$panel_parent" "$panel_base"

    cat > "$manifest_file" <<EOF
theme=$THEME_NAME
version=$THEME_VERSION
reason=$reason
panel_dir=$PANEL_DIR
created_at=$(date -Is)
archive=$backup_file
note=This backup contains Pterodactyl files only, not the MySQL database.
EOF

    info "Backup selesai."
    echo "$backup_file"
}

find_local_theme_source() {
    local script_path
    local script_dir

    script_path="${BASH_SOURCE[0]}"
    if [[ -f "$script_path" ]]; then
        script_dir="$(cd "$(dirname "$script_path")" && pwd)"
        if [[ -d "$script_dir/resources/scripts/zy4theme" ]]; then
            echo "$script_dir/resources/scripts/zy4theme"
            return 0
        fi
    fi

    return 1
}

download_theme_source() {
    local archive_file
    local theme_source

    TMP_DIR="$(mktemp -d)"
    archive_file="$TMP_DIR/zy4theme.tar.gz"

    info "Mengunduh source theme dari: $REPO_ARCHIVE_URL"
    curl -fL "$REPO_ARCHIVE_URL" -o "$archive_file"

    tar -xzf "$archive_file" -C "$TMP_DIR"
    theme_source="$(find "$TMP_DIR" -type d -path "*/resources/scripts/zy4theme" | head -n 1)"

    [[ -n "$theme_source" && -d "$theme_source" ]] || fail "Folder resources/scripts/zy4theme tidak ditemukan di archive GitHub."
    echo "$theme_source"
}

get_theme_source() {
    if find_local_theme_source >/dev/null 2>&1; then
        find_local_theme_source
        return 0
    fi

    download_theme_source
}

copy_theme_files() {
    local theme_source="$1"
    local theme_target="$PANEL_DIR/resources/scripts/zy4theme"

    mkdir -p "$(dirname "$theme_target")"
    ensure_inside_panel "$(dirname "$theme_target")"

    if [[ -e "$theme_target" ]]; then
        ensure_inside_panel "$theme_target"
        rm -rf "$theme_target"
    fi

    mkdir -p "$theme_target"

    info "Menyalin ZY4 Theme ke: $theme_target"
    if command -v rsync >/dev/null 2>&1; then
        rsync -a --delete "$theme_source"/ "$theme_target"/
    else
        cp -a "$theme_source"/. "$theme_target"/
    fi

    if [[ "$(id -u)" == "0" ]]; then
        local owner_group
        owner_group="$(stat -c '%U:%G' "$PANEL_DIR" 2>/dev/null || true)"
        if [[ -n "$owner_group" ]]; then
            chown -R "$owner_group" "$theme_target" || true
        fi
    fi
}

find_entrypoint() {
    local candidates=(
        "$PANEL_DIR/resources/scripts/index.tsx"
        "$PANEL_DIR/resources/scripts/index.ts"
        "$PANEL_DIR/resources/scripts/app.tsx"
        "$PANEL_DIR/resources/scripts/App.tsx"
    )
    local candidate

    for candidate in "${candidates[@]}"; do
        if [[ -f "$candidate" ]]; then
            echo "$candidate"
            return 0
        fi
    done

    return 1
}

patch_entrypoint() {
    local entrypoint
    local tmp_file
    local owner_group

    if ! entrypoint="$(find_entrypoint)"; then
        warn "Entrypoint frontend tidak ditemukan. Import manual diperlukan."
        warn "Tambahkan: import { installZy4ThemeClass } from './zy4theme'; lalu panggil installZy4ThemeClass();"
        return 0
    fi

    ensure_inside_panel "$entrypoint"

    if grep -q "installZy4ThemeClass" "$entrypoint"; then
        info "Entrypoint sudah berisi installZy4ThemeClass, skip patch: $entrypoint"
        return 0
    fi

    info "Inject ZY4 Theme ke entrypoint: $entrypoint"
    backup_modified_file "$entrypoint"
    tmp_file="$(mktemp)"
    {
        echo "import { installZy4ThemeClass } from './zy4theme';"
        cat "$entrypoint"
        echo
        echo "installZy4ThemeClass();"
    } > "$tmp_file"

    cat "$tmp_file" > "$entrypoint"
    rm -f "$tmp_file"

    if [[ "$(id -u)" == "0" ]]; then
        owner_group="$(stat -c '%U:%G' "$PANEL_DIR" 2>/dev/null || true)"
        if [[ -n "$owner_group" ]]; then
            chown "$owner_group" "$entrypoint" || true
        fi
    fi
}

patch_dashboard_container() {
    local dashboard_file="$PANEL_DIR/resources/scripts/components/dashboard/DashboardContainer.tsx"
    local owner_group

    if [[ ! -f "$dashboard_file" ]]; then
        warn "DashboardContainer.tsx tidak ditemukan, dashboard full ZY4 tidak bisa dipatch otomatis."
        warn "Cari file dashboard panel lu lalu export Zy4PterodactylDashboard dari '@/zy4theme/components/Zy4PterodactylDashboard'."
        return 0
    fi

    ensure_inside_panel "$dashboard_file"

    if grep -q "Zy4PterodactylDashboard" "$dashboard_file"; then
        info "DashboardContainer sudah memakai ZY4, skip patch: $dashboard_file"
        return 0
    fi

    info "Mengganti dashboard Pterodactyl dengan dashboard full ZY4: $dashboard_file"
    backup_modified_file "$dashboard_file"
    cat > "$dashboard_file" <<'EOF'
import Zy4PterodactylDashboard from '@/zy4theme/components/Zy4PterodactylDashboard';

export default Zy4PterodactylDashboard;
EOF

    if [[ "$(id -u)" == "0" ]]; then
        owner_group="$(stat -c '%U:%G' "$PANEL_DIR" 2>/dev/null || true)"
        if [[ -n "$owner_group" ]]; then
            chown "$owner_group" "$dashboard_file" || true
        fi
    fi
}

patch_dashboard_router() {
    local router_file="$PANEL_DIR/resources/scripts/routers/DashboardRouter.tsx"
    local owner_group

    if [[ ! -f "$router_file" ]]; then
        warn "DashboardRouter.tsx tidak ditemukan, account navigation lama mungkin masih tampil."
        return 0
    fi

    ensure_inside_panel "$router_file"

    if grep -q "Zy4PanelShell" "$router_file"; then
        info "DashboardRouter sudah memakai ZY4 shell, skip patch."
        return 0
    fi

    info "Mengganti DashboardRouter supaya account pages memakai sidebar/topbar ZY4."
    backup_modified_file "$router_file"
    cat > "$router_file" <<'EOF'
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import { useLocation } from 'react-router';
import Spinner from '@/components/elements/Spinner';
import routes from '@/routers/routes';
import { Zy4PanelShell } from '@/zy4theme/components/Zy4PanelShell';
import type { Zy4NavKey } from '@/zy4theme/data/zy4DemoData';

const activeAccountRoute = (path: string): Zy4NavKey => {
    if (path.startsWith('/api')) return 'api';
    if (path.startsWith('/ssh')) return 'ssh';
    if (path.startsWith('/activity')) return 'activity';

    return 'account';
};

export default () => {
    const location = useLocation();

    return (
        <TransitionRouter>
            <React.Suspense fallback={<Spinner centered />}>
                <Switch location={location}>
                    <Route path={'/'} exact>
                        <DashboardContainer />
                    </Route>
                    {routes.account.map(({ path, component: Component, exact }) => (
                        <Route key={path} path={`/account/${path}`.replace('//', '/')} exact={exact}>
                            <Zy4PanelShell active={activeAccountRoute(path)}>
                                <Component />
                            </Zy4PanelShell>
                        </Route>
                    ))}
                    <Route path={'*'}>
                        <Zy4PanelShell active="dashboard">
                            <NotFound />
                        </Zy4PanelShell>
                    </Route>
                </Switch>
            </React.Suspense>
        </TransitionRouter>
    );
};
EOF

    if [[ "$(id -u)" == "0" ]]; then
        owner_group="$(stat -c '%U:%G' "$PANEL_DIR" 2>/dev/null || true)"
        if [[ -n "$owner_group" ]]; then
            chown "$owner_group" "$router_file" || true
        fi
    fi
}

patch_server_router() {
    local router_file="$PANEL_DIR/resources/scripts/routers/ServerRouter.tsx"
    local owner_group

    if [[ ! -f "$router_file" ]]; then
        warn "ServerRouter.tsx tidak ditemukan, server navigation lama mungkin masih tampil."
        return 0
    fi

    ensure_inside_panel "$router_file"

    if grep -q "buildZy4ServerSidebarItems" "$router_file"; then
        info "ServerRouter sudah memakai ZY4 shell, skip patch."
        return 0
    fi

    info "Mengganti ServerRouter supaya console/files/databases/schedules memakai shell ZY4 tanpa mengubah logic asli."
    backup_modified_file "$router_file"
    cat > "$router_file" <<'EOF'
import TransferListener from '@/components/server/TransferListener';
import React, { useEffect, useMemo, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import TransitionRouter from '@/TransitionRouter';
import WebsocketHandler from '@/components/server/WebsocketHandler';
import { ServerContext } from '@/state/server';
import Spinner from '@/components/elements/Spinner';
import { NotFound, ServerError } from '@/components/elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import { useStoreState } from 'easy-peasy';
import InstallListener from '@/components/server/InstallListener';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { useLocation } from 'react-router';
import ConflictStateRenderer from '@/components/server/ConflictStateRenderer';
import PermissionRoute from '@/components/elements/PermissionRoute';
import routes from '@/routers/routes';
import { Zy4PanelShell } from '@/zy4theme/components/Zy4PanelShell';
import type { Zy4IconName } from '@/zy4theme/components/Zy4Icons';
import type { Zy4NavItem, Zy4NavKey } from '@/zy4theme/data/zy4DemoData';

const routeKey = (path: string): Zy4NavKey => {
    if (path.startsWith('/files')) return 'files';
    if (path.startsWith('/databases')) return 'databases';
    if (path.startsWith('/schedules')) return 'schedules';
    if (path.startsWith('/users')) return 'users';
    if (path.startsWith('/backups')) return 'backups';
    if (path.startsWith('/network')) return 'network';
    if (path.startsWith('/startup')) return 'startup';
    if (path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/activity')) return 'activity';

    return 'console';
};

const routeIcon = (key: Zy4NavKey): Zy4IconName => {
    switch (key) {
        case 'files':
            return 'files';
        case 'databases':
            return 'database';
        case 'schedules':
            return 'schedule';
        case 'users':
            return 'users';
        case 'backups':
            return 'layers';
        case 'network':
            return 'network';
        case 'startup':
            return 'command';
        case 'settings':
            return 'settings';
        case 'activity':
            return 'activity';
        default:
            return 'console';
    }
};

const activeServerRoute = (pathname: string, baseUrl: string): Zy4NavKey => {
    const relative = pathname.replace(baseUrl.replace(/\/*$/, ''), '') || '/';

    return routeKey(relative);
};

const buildZy4ServerSidebarItems = (
    to: (value: string, url?: boolean) => string,
    rootAdmin: boolean,
    serverId?: number | string
): Zy4NavItem[] => [
    { key: 'dashboard', label: 'Dashboard', href: '/', icon: 'grid', exact: true },
    ...routes.server
        .filter((route) => !!route.name)
        .map((route) => {
            const key = routeKey(route.path);

            return {
                key,
                label: route.name!,
                href: to(route.path, true),
                icon: routeIcon(key),
                exact: route.exact,
                permission: route.permission,
            };
        }),
    ...(rootAdmin && serverId
        ? [
              {
                  key: 'admin' as const,
                  label: 'Admin View',
                  href: `/admin/servers/view/${serverId}`,
                  icon: 'layers' as const,
                  external: true,
              },
          ]
        : []),
];

export default () => {
    const match = useRouteMatch<{ id: string }>();
    const location = useLocation();

    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [error, setError] = useState('');

    const id = ServerContext.useStoreState((state) => state.server.data?.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const inConflictState = ServerContext.useStoreState((state) => state.server.inConflictState);
    const serverId = ServerContext.useStoreState((state) => state.server.data?.internalId);
    const getServer = ServerContext.useStoreActions((actions) => actions.server.getServer);
    const clearServerState = ServerContext.useStoreActions((actions) => actions.clearServerState);

    const to = (value: string, url = false) => {
        if (value === '/') {
            return url ? match.url : match.path;
        }
        return `${(url ? match.url : match.path).replace(/\/*$/, '')}/${value.replace(/^\/+/, '')}`;
    };

    const sidebarItems = useMemo(() => buildZy4ServerSidebarItems(to, rootAdmin, serverId), [match.url, rootAdmin, serverId]);
    const active = activeServerRoute(location.pathname, match.url);

    useEffect(
        () => () => {
            clearServerState();
        },
        []
    );

    useEffect(() => {
        setError('');

        getServer(match.params.id).catch((error) => {
            console.error(error);
            setError(httpErrorToHuman(error));
        });

        return () => {
            clearServerState();
        };
    }, [match.params.id]);

    return (
        <Zy4PanelShell active={active} sidebarItems={sidebarItems}>
            {!uuid || !id ? (
                error ? (
                    <ServerError message={error} />
                ) : (
                    <Spinner size={'large'} centered />
                )
            ) : (
                <>
                    <InstallListener />
                    <TransferListener />
                    <WebsocketHandler />
                    {inConflictState && (!rootAdmin || (rootAdmin && !location.pathname.endsWith(`/server/${id}`))) ? (
                        <ConflictStateRenderer />
                    ) : (
                        <ErrorBoundary>
                            <TransitionRouter>
                                <Switch location={location}>
                                    {routes.server.map(({ path, permission, component: Component }) => (
                                        <PermissionRoute key={path} permission={permission} path={to(path)} exact>
                                            <Spinner.Suspense>
                                                <Component />
                                            </Spinner.Suspense>
                                        </PermissionRoute>
                                    ))}
                                    <Route path={'*'} component={NotFound} />
                                </Switch>
                            </TransitionRouter>
                        </ErrorBoundary>
                    )}
                </>
            )}
        </Zy4PanelShell>
    );
};
EOF

    if [[ "$(id -u)" == "0" ]]; then
        owner_group="$(stat -c '%U:%G' "$PANEL_DIR" 2>/dev/null || true)"
        if [[ -n "$owner_group" ]]; then
            chown "$owner_group" "$router_file" || true
        fi
    fi
}

mark_install() {
    local marker="$PANEL_DIR/.zy4theme-installed"

    cat > "$marker" <<EOF
theme=$THEME_NAME
version=$THEME_VERSION
installed_at=$(date -Is)
repo=https://github.com/${REPO_OWNER}/${REPO_NAME}
branch=$REPO_BRANCH
backup_root=$BACKUP_ROOT
EOF
}

package_has_script() {
    local script_name="$1"
    [[ -f "$PANEL_DIR/package.json" ]] || return 1
    grep -Eq "\"$script_name\"[[:space:]]*:" "$PANEL_DIR/package.json"
}

run_build() {
    [[ -f "$PANEL_DIR/package.json" ]] || {
        warn "package.json tidak ditemukan, build frontend dilewati."
        return 0
    }

    info "Menjalankan build frontend di $PANEL_DIR"
    (
        cd "$PANEL_DIR"

        if [[ -f yarn.lock && -x "$(command -v yarn 2>/dev/null || true)" ]]; then
            yarn install --frozen-lockfile || yarn install
            if package_has_script "build:production"; then
                yarn build:production
            elif package_has_script "build"; then
                yarn build
            else
                warn "Script build tidak ditemukan di package.json."
            fi
        elif command -v npm >/dev/null 2>&1; then
            npm install
            if package_has_script "build:production"; then
                npm run build:production
            elif package_has_script "build"; then
                npm run build
            else
                warn "Script build tidak ditemukan di package.json."
            fi
        else
            warn "npm/yarn tidak ditemukan, build frontend dilewati."
        fi
    )
}

install_theme() {
    local theme_source

    print_banner
    ensure_environment

    warn "Backup ini hanya file panel, bukan database MySQL."
    make_backup "install" >/dev/null

    theme_source="$(get_theme_source)"
    copy_theme_files "$theme_source"
    patch_entrypoint
    patch_dashboard_container
    patch_dashboard_router
    patch_server_router
    mark_install

    if ask_yes_no "Build frontend assets sekarang?" "Y"; then
        run_build
    else
        warn "Build dilewati. Jalankan build manual sebelum panel dipakai produksi."
    fi

    echo
    info "$THEME_NAME $THEME_VERSION selesai diinstall."
}

list_backups() {
    find "$BACKUP_ROOT" -maxdepth 1 -type f -name "pterodactyl-*.tar.gz" 2>/dev/null | sort -r
}

restore_backup() {
    local backups=()
    local index=1
    local choice
    local selected
    local panel_parent
    local panel_base

    print_banner
    need_command tar
    need_command readlink

    [[ -d "$BACKUP_ROOT" ]] || fail "Folder backup tidak ditemukan: $BACKUP_ROOT"

    mapfile -t backups < <(list_backups)
    [[ "${#backups[@]}" -gt 0 ]] || fail "Tidak ada backup di $BACKUP_ROOT"

    echo "Backup tersedia:"
    for selected in "${backups[@]}"; do
        echo "  $index) $(basename "$selected")"
        index=$((index + 1))
    done
    echo

    read -r -p "Pilih nomor backup untuk restore: " choice
    [[ "$choice" =~ ^[0-9]+$ ]] || fail "Pilihan tidak valid."
    [[ "$choice" -ge 1 && "$choice" -le "${#backups[@]}" ]] || fail "Nomor backup tidak tersedia."

    selected="${backups[$((choice - 1))]}"
    panel_parent="$(dirname "$PANEL_DIR")"
    panel_base="$(basename "$PANEL_DIR")"

    if ! tar -tzf "$selected" | head -n 1 | grep -q "^${panel_base}/"; then
        fail "Archive tidak berisi folder ${panel_base}/, restore dibatalkan."
    fi

    warn "Restore akan mengganti file di $PANEL_DIR dengan backup: $(basename "$selected")"
    warn "Database MySQL tidak ikut direstore."

    if ! ask_yes_no "Lanjut restore?" "N"; then
        warn "Restore dibatalkan."
        return 0
    fi

    if [[ -d "$PANEL_DIR" ]]; then
        make_backup "pre-restore" >/dev/null
        ensure_safe_panel_target
        info "Menghapus panel saat ini: $PANEL_DIR"
        rm -rf "$PANEL_DIR"
    fi

    mkdir -p "$panel_parent"
    info "Extract backup ke: $panel_parent"
    tar -xzf "$selected" -C "$panel_parent"

    info "Restore selesai dari: $selected"
}

show_menu() {
    local choice

    print_banner
    echo "1) Install / Update ZY4 Theme"
    echo "2) Restore Backup"
    echo "3) Exit"
    echo
    read -r -p "Pilih menu [1-3]: " choice

    case "$choice" in
        1) install_theme ;;
        2) restore_backup ;;
        3) exit 0 ;;
        *) fail "Pilihan tidak valid." ;;
    esac
}

main() {
    local action="${1:-menu}"

    case "$action" in
        install|--install) install_theme ;;
        restore|--restore) restore_backup ;;
        menu|--menu) show_menu ;;
        *)
            echo "Usage: bash install.sh [install|restore]"
            exit 1
            ;;
    esac
}

main "$@"
