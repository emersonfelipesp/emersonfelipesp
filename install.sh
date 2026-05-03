#!/usr/bin/env bash
# emersonfelipesp.com — interactive installer
# Usage: ./install.sh           (interactive menu)
#        ./install.sh dev       (install + run dev server)
#        ./install.sh prod      (install + build + start)
#        ./install.sh setup     (install + migrate + seed only)
#        ./install.sh -h        (help)
set -euo pipefail

# --- styling -------------------------------------------------------------------
if [[ -t 1 ]]; then
  BOLD=$'\033[1m'; DIM=$'\033[2m'; RST=$'\033[0m'
  FG_TEAL=$'\033[38;5;43m'; FG_ORANGE=$'\033[38;5;208m'
  FG_BLUE=$'\033[38;5;75m'; FG_GREEN=$'\033[38;5;42m'
  FG_RED=$'\033[38;5;203m'; FG_MUTED=$'\033[38;5;245m'
else
  BOLD=""; DIM=""; RST=""
  FG_TEAL=""; FG_ORANGE=""; FG_BLUE=""; FG_GREEN=""; FG_RED=""; FG_MUTED=""
fi

USER_HOST="emerson@netdevops"

prompt()  { printf "%s%s%s:%s~%s$%s " "$FG_TEAL" "$USER_HOST" "$RST" "$FG_MUTED" "$RST" "$RST"; }
info()    { printf "%s[ * ]%s %s\n" "$FG_BLUE"   "$RST" "$*"; }
ok()      { printf "%s[ ✓ ]%s %s\n" "$FG_GREEN"  "$RST" "$*"; }
warn()    { printf "%s[ ! ]%s %s\n" "$FG_ORANGE" "$RST" "$*"; }
fail()    { printf "%s[ ✗ ]%s %s\n" "$FG_RED"    "$RST" "$*" >&2; }

banner() {
  cat <<EOF
${FG_TEAL}╔══════════════════════════════════════════════════════════╗
║${RST}     ${BOLD}emersonfelipesp.com${RST} ${FG_MUTED}·${RST} ${FG_TEAL}NetBox${RST} ${FG_MUTED}+${RST} ${FG_ORANGE}Proxmox${RST} ${FG_MUTED}portfolio${RST}     ${FG_TEAL}║
╚══════════════════════════════════════════════════════════╝${RST}
${FG_MUTED}  next.js 16 · react 19 · tailwind 4 · prisma 7 · sqlite${RST}
EOF
}

run_step() {
  local label="$1"; shift
  prompt; printf "%s\n" "$*"
  if "$@"; then
    ok "$label"
  else
    fail "$label failed"
    exit 1
  fi
  echo
}

# --- package manager detection ------------------------------------------------
detect_pkg_mgr() {
  if command -v pnpm >/dev/null 2>&1; then
    PKG_MGR="pnpm"
    PKG_X="pnpm exec"
  else
    PKG_MGR="npm"
    PKG_X="npx"
    warn "pnpm not found — falling back to npm"
    echo
  fi
}

# --- checks -------------------------------------------------------------------
check_prereqs() {
  info "checking prerequisites"
  command -v node >/dev/null || { fail "node not found — install Node.js 20+"; exit 1; }
  command -v npm  >/dev/null || { fail "npm not found"; exit 1; }
  local nv major
  nv=$(node -v); major=${nv#v}; major=${major%%.*}
  if (( major < 20 )); then
    fail "Node $nv detected — need Node 20 or newer"
    exit 1
  fi
  detect_pkg_mgr
  ok "node $nv · $PKG_MGR $($PKG_MGR --version)"
  echo
}

# --- steps --------------------------------------------------------------------
ensure_env() {
  if [[ ! -f .env ]]; then
    if [[ -f .env.example ]]; then
      cp .env.example .env
      ok "created .env from .env.example"
    else
      printf 'DATABASE_URL="file:./dev.db"\n' > .env
      ok "created default .env"
    fi
  else
    ok ".env present"
  fi
  echo
}

install_deps()    { run_step "dependencies installed"  $PKG_MGR install; }
prisma_generate() { run_step "prisma client generated" $PKG_X prisma generate; }
prisma_migrate()  { run_step "database migrated"       $PKG_X prisma migrate deploy; }
prisma_seed()     { run_step "database seeded"         $PKG_X tsx prisma/seed.ts; }
build_app()       { run_step "production build done"   $PKG_MGR run build; }

run_dev() {
  info "starting dev server (http://localhost:3000) — Ctrl-C to stop"
  echo
  exec $PKG_MGR run dev
}

run_prod() {
  info "starting production server (http://localhost:3000) — Ctrl-C to stop"
  echo
  exec $PKG_MGR run start
}

# --- modes --------------------------------------------------------------------
do_setup() {
  ensure_env
  install_deps
  prisma_generate
  prisma_migrate
  prisma_seed
  ok "setup complete"
}

do_dev() {
  do_setup
  echo
  run_dev
}

do_prod() {
  do_setup
  build_app
  echo
  run_prod
}

# --- menu ---------------------------------------------------------------------
menu() {
  echo
  printf "%spick a mode:%s\n\n" "$BOLD" "$RST"
  printf "  %s[1]%s ${FG_TEAL}dev${RST}    %s· next dev (hot-reload, port 3000)%s\n" "$FG_TEAL" "$RST" "$FG_MUTED" "$RST"
  printf "  %s[2]%s ${FG_ORANGE}prod${RST}   %s· next build && next start (port 3000)%s\n" "$FG_ORANGE" "$RST" "$FG_MUTED" "$RST"
  printf "  %s[3]%s ${FG_BLUE}setup${RST}  %s· install + migrate + seed only (no server)%s\n" "$FG_BLUE" "$RST" "$FG_MUTED" "$RST"
  printf "  %s[q]%s quit\n\n" "$FG_MUTED" "$RST"
  while true; do
    prompt; printf "select [1/2/3/q]: "
    read -r choice </dev/tty
    case "${choice,,}" in
      1|dev)   do_dev;   return ;;
      2|prod)  do_prod;  return ;;
      3|setup) do_setup; return ;;
      q|quit|exit) info "bye"; exit 0 ;;
      *) warn "unknown option: $choice" ;;
    esac
  done
}

usage() {
  cat <<EOF
${BOLD}usage:${RST} ./install.sh [mode]

modes:
  ${FG_TEAL}dev${RST}    install + run dev server (hot-reload)
  ${FG_ORANGE}prod${RST}   install + build + start production server
  ${FG_BLUE}setup${RST}  install + migrate + seed only
  (no arg)  interactive menu

${FG_MUTED}env:${RST}
  DATABASE_URL  override .env value (default: file:./dev.db)
EOF
}

# --- main ---------------------------------------------------------------------
banner
check_prereqs

case "${1:-}" in
  -h|--help|help) usage; exit 0 ;;
  dev)    do_dev   ;;
  prod)   do_prod  ;;
  setup)  do_setup ;;
  "")     menu     ;;
  *)      warn "unknown arg: $1"; usage; exit 1 ;;
esac
