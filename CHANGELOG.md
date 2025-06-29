#!/usr/bin/env bash
#
# CompanyOS Bundle Release Script
# Automates version bumping, commits, tags, and full-file listing in CHANGELOG.md for both bundles.
#
# Usage: ./release.sh [--ci]
#   --ci    non-interactive: auto-yes all prompts and disable colors.
#
set -euo pipefail

# Default settings
CI_MODE=false
USE_COLORS=true

# Detect flags
for arg in "$@"; do
  case "$arg" in
    --ci) CI_MODE=true ;; 
    *) ;;
  esac
done

# Check for TERM support
if [ "$CI_MODE" = false ] && [ -t 1 ] && command -v tput &>/dev/null; then
  ncolors=$(tput colors)
  if [ -z "$ncolors" ] || [ "$ncolors" -lt 8 ] || [ "${TERM:-}" = "dumb" ]; then
    USE_COLORS=false
  fi
else
  USE_COLORS=false
fi

# Color codes
if [ "$USE_COLORS" = true ]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  BLUE='\033[0;34m'
  CYAN='\033[0;36m'
  NC='\033[0m'
else
  RED='' GREEN='' YELLOW='' BLUE='' CYAN='' NC=''
fi

log()    { printf "%b[INFO]%b %s\n" "$BLUE" "$NC" "$1" >&2; }
success() { printf "%b[SUCCESS]%b %s\n" "$GREEN" "$NC" "$1" >&2; }
warn()   { printf "%b[WARNING]%b %s\n" "$YELLOW" "$NC" "$1" >&2; }
error()  { printf "%b[ERROR]%b %s\n" "$RED" "$NC" "$1" >&2; }
prompt() { printf "%b[PROMPT]%b %s\n" "$CYAN" "$NC" "$1" >&2; }

# Ask user to confirm; returns 0=yes, 1=no, 2=edit
confirm() {
  local msg="$1"
  if [ "$CI_MODE" = true ]; then
    return 0
  fi
  while true; do
    prompt "$msg (y/n/e)"
    read -r ans
    case "$ans" in
      [Yy]*) return 0 ;;  
      [Ee]*) return 2 ;;  
      [Nn]*) return 1 ;;  
      *) warn "Bitte y (ja), n (nein) oder e (edit) eingeben." ;;  
    esac
  done
}

# Cleanup temporary files on exit
cleanup_tmp() {
  [[ -n "${TMPFILE:-}" ]] && rm -f "$TMPFILE"
}
trap cleanup_tmp EXIT

# Bump patch version: x.y.z[-suffix] -> x.y.(z+1)[-suffix]
increment_version() {
  local v=$1
  IFS='.-' read -r major minor patch suffix <<<"$v"
  patch=$((patch + 1))
  if [ -n "$suffix" ]; then
    echo "${major}.${minor}.${patch}-${suffix}"
  else
    echo "${major}.${minor}.${patch}"
  fi
}

# Generate commit message (OpenAI fallback)
generate_commit_message() {
  local bundle="$1"
  if [ -n "${OPENAI_API_KEY:-}" ] && command -v curl &>/dev/null; then
    log "Generating commit message via OpenAI..."
    TMPFILE=$(mktemp)
    local diffs
    diffs=$(git diff --unified=0 HEAD | head -c 8000)
    jq -n --arg m "gpt-3.5-turbo" \
          --arg p "Erstelle eine prägnante Conventional-Commit Nachricht (Deutsch, max.80 Zeichen) für Symfony-Bundle '$bundle' basierend auf Änderungen: $diffs" \
          '{model: $m, messages: [{role:"user",content:$p}], max_tokens:100, temperature:0.3}' \
      > "$TMPFILE"
    local resp
    if resp=$(timeout 10 curl -sS -H "Authorization: Bearer $OPENAI_API_KEY" \
        -H "Content-Type: application/json" \
        -d @"$TMPFILE" https://api.openai.com/v1/chat/completions) &&
       echo "$resp" | jq -e '.choices[0].message.content' &>/dev/null; then
      echo "$resp" | jq -r '.choices[0].message.content'
      return
    else
      warn "OpenAI unavailable, falling back..."
    fi
  fi
  # Fallback summary
  log "Generating fallback commit message..."
  local files
  files=$(git diff --name-status HEAD)
  if [ -z "$files" ]; then
    echo "feat: Verschiedene Verbesserungen"
  else
    local msg="feat: Release – Änderungen: "
    msg+=$(echo "$files" | awk '{printf "%s %s; ", $1, $2}')
    echo "${msg:0:80}"
  fi
}

process_bundle() {
  local dir=$1 name="$2"
  log "Processing $name..."
  if ! [ -d "$dir" ]; then
    warn "Directory '$dir' not found, skipping."
    return
  fi

  pushd "$dir" >/dev/null

  # ensure on main
  branch=$(git rev-parse --abbrev-ref HEAD)
  if [ "$branch" != "main" ]; then
    error "Branch is '$branch', expected 'main'. Aborting."
    popd >/dev/null
    exit 1
  fi

  if git diff-index --quiet HEAD --; then
    warn "No changes in $name, skipping."
    popd >/dev/null
    return
  fi

  # Commit message
  msg=$(generate_commit_message "$name")
  msg=${msg//$'\n'/ }       # remove newlines
  msg="${msg:0:77}..."
  if confirm "Commit-Message für $name: '$msg'?"; then
    :
  elif [ $? -eq 2 ]; then
    ${EDITOR:-nano} <(echo "$msg")
    read -r msg
  else
    prompt "Neue Commit-Message eingeben:"
    read -r msg
  fi
  msg=${msg//$'\n'/ }       # final cleanup
  success "Using commit message: $msg"

  # Version bump
  current=$(jq -r '.version' composer.json)
  next=$(increment_version "$current")
  success "Bumping version: $current → $next"
  jq ".version = \"$next\"" composer.json > composer.json.tmp && mv composer.json.tmp composer.json

  # Changelog update with full file list at top
  if confirm "CHANGELOG.md aktualisieren für $next?"; then
    date=$(date +%Y-%m-%d)
    files=$(git diff --name-status HEAD)
    TMPCHANGELOG=$(mktemp)
    {
      echo
      echo "## [$next] - $date"
      echo
      echo "- Commit: $msg"
      while IFS= read -r line; do
        status=$(echo "$line" | awk '{print $1}')
        file=$(echo "$line" | awk '{print $2}')
        echo "- [$status] $file"
      done <<< "$files"
      echo
    } > "$TMPCHANGELOG"
    sed -i.bak "/^## \[Unreleased\]/r $TMPCHANGELOG" CHANGELOG.md
    rm "$TMPCHANGELOG"
    success "CHANGELOG.md updated with full file list at top."
  fi

  # README update
  if [ -f README.md ] && confirm "README.md Version updaten?"; then
    sed -i.bak -E "s/[0-9]+\.[0-9]+\.[0-9]+(-[^\"]+)?/$next/g" README.md
    success "README.md updated (backup at README.md.bak)."
  fi

  # Git operations
  git add .
  git commit -m "$msg"
  git push origin main
  git tag "v$next"
  git push origin "v$next"
  success "Released $name v$next"

  popd >/dev/null
}

main() {
  # pre-checks
  for cmd in git jq; do
    if ! command -v "$cmd" &>/dev/null; then
      error "Required command '$cmd' not found."
      exit 1
    fi
  done

  process_bundle "CompanyOSCoreBundle"    "CompanyOS Core Bundle"
  process_bundle "CompanyOSBackendBundle" "CompanyOS Backend Bundle"
  success "All bundles processed."
}

main "$@"

## [0.1.123-alpha] - 2025-06-28

- Commit: fix: Aktualisiere Routenpfad in routes.yaml, um das '/admin'-Präfix zu entfer...
- [M] CHANGELOG.md
- [M] composer.json

## [0.1.124-alpha] - 2025-06-28

- Commit: "Plugin-Komponenten dynamisch registrieren und laden"...
- [M] Resources/app/app.js
- [M] composer.json

## [0.1.125-alpha] - 2025-06-28

- Commit: Hinzufügen von "Hallo" in base.html.twig-Datei....
- [M] Resources/views/backend/base.html.twig
- [M] composer.json

## [0.1.126-alpha] - 2025-06-28

- Commit: Hinzufügen von Login- und Dashboard-Komponenten, dynamisches Plugin-Laden nur...
- [M] Resources/app/app.js
- [M] composer.json

## [0.1.127-alpha] - 2025-06-28

- Commit: Fix: Änderung des API-Endpunkts für Benutzerprofil abgerufen....
- [M] Resources/app/stores/auth.js
- [M] composer.json

## [0.1.128-alpha] - 2025-06-28

- Commit: "Entferne überflüssige Begrüßung im Backend-Template"...
- [M] Resources/views/backend/base.html.twig
- [M] composer.json

## [0.1.129-alpha] - 2025-06-28

- Commit: "Verbessere Dashboard-Statistiken und füge Mock-Aktivitätsdaten hinzu"...
- [M] Resources/app/views/Dashboard.vue
- [M] composer.json

## [0.1.130-alpha] - 2025-06-28

- Commit: "Verbesserte Authentifizierung und Fehlerbehandlung hinzugefügt"...
- [M] Resources/app/app.js
- [M] Resources/app/layout/App.vue
- [M] Resources/app/stores/auth.js
- [M] composer.json

## [0.1.131-alpha] - 2025-06-28

- Commit: "Update: Permission-Prüfung für Navigation, Rollen durch Permissions ersetzt"...
- [M] Resources/app/_nav.js
- [M] Resources/app/app.js
- [M] Resources/app/components/AppSidebarNav.js
- [M] Resources/app/stores/auth.js
- [M] Resources/app/views/ApiDocs.vue
- [M] Resources/app/views/Permissions.vue
- [M] Resources/app/views/Plugins.vue
- [M] Resources/app/views/Roles.vue
- [M] Resources/app/views/Settings.vue
- [M] Resources/app/views/Users.vue
- [M] Resources/app/views/Webhooks.vue
- [M] composer.json

## [0.1.132-alpha] - 2025-06-29

- Commit: Fix: Einrückung und Formatierung verbessert....
- [M] Resources/app/app.js
- [M] composer.json

## [0.1.133-alpha] - 2025-06-29

- Commit: "Erweiterte Berechtigungen für Navigation hinzugefügt"...
- [M] Resources/app/_nav.js
- [M] Resources/app/app.js
- [M] Resources/app/components/AppSidebarNav.js
- [M] Resources/app/views/Plugins.vue
- [M] Resources/app/views/Roles.vue
- [M] Resources/app/views/Settings.vue
- [M] Resources/app/views/Users.vue
- [M] Resources/app/views/Webhooks.vue
- [M] composer.json

## [0.1.134-alpha] - 2025-06-29

- Commit: Fix export statement in AppSidebarNav component....
- [M] Resources/app/components/AppSidebarNav.js
- [M] composer.json

## [0.1.135-alpha] - 2025-06-29

- Commit: "Fix: Fehler behoben in Webhooks.vue Datei"...
- [M] Resources/app/views/Webhooks.vue
- [M] composer.json

## [0.1.136-alpha] - 2025-06-29

- Commit: 🔒 Verbesserte Backend-Permission-Prüfung hinzugefügt...
- [M] Resources/app/app.js
- [M] Resources/app/stores/auth.js
- [M] composer.json

## [0.1.137-alpha] - 2025-06-29

- Commit: "Verbesserte Permission-Prüfung mit vollständiger Authentifizierung"...
- [M] Resources/app/app.js
- [M] Resources/app/stores/auth.js
- [M] composer.json

## [0.1.138-alpha] - 2025-06-29

- Commit: "🔧 Debug-Modus aktivieren, automatische Permission-Diagnose hinzugefügt"...
- [M] Resources/app/app.js
- [M] Resources/app/stores/auth.js
- [M] composer.json

## [0.1.139-alpha] - 2025-06-29

- Commit: Refactor: Lazy laden der Debug-Tools, Navigation-Spezifische Permission-Mappi...
- [M] Resources/app/app.js
- [M] Resources/app/stores/auth.js
- [M] composer.json

## [0.1.140-alpha] - 2025-06-29

- Commit: "Optimierung der Berechtigungsprüfung für Navigation"...
- [M] Resources/app/stores/auth.js
- [M] composer.json

## [0.1.141-alpha] - 2025-06-29

- Commit: Refactor OAuth2-Authentifizierung und Profil-Endpunkte....
- [M] Resources/app/stores/auth.js
- [M] composer.json

## [0.1.142-alpha] - 2025-06-29

- Commit: "Optimistische Berechtigungen für bessere UX hinzugefügt"...
- [M] Resources/app/app.js
- [M] composer.json

## [0.1.143-alpha] - 2025-06-29

- Commit: 🔒 Sicherheitsüberprüfung verbessert & Fallbacks implementiert...
- [M] Resources/app/app.js
- [M] Resources/app/stores/auth.js
- [M] composer.json

## [0.1.144-alpha] - 2025-06-29

- Commit: refactor: Verbessere Token-Handling und Fehlerbehandlung...
- [M] Resources/app/app.js
- [M] Resources/app/stores/auth.js
- [M] composer.json

## [0.1.145-alpha] - 2025-06-29

- Commit: "Anpassungen für CoreBundle API-Endpunkte und verbesserte Fehlerbehandlung"...
- [M] Resources/app/stores/auth.js
- [M] composer.json

## [0.1.146-alpha] - 2025-06-29

- Commit: Fix API endpoint paths for user permissions....
- [M] Resources/app/stores/auth.js
- [M] composer.json

## [0.1.147-alpha] - 2025-06-29

- Commit: Fix: Änderung des API-Endpunkts für Benutzerberechtigungen....
- [M] Resources/app/stores/navigation.js
- [M] composer.json
