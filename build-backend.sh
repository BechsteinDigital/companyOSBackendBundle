#!/bin/bash

# CompanyOS Backend Bundle Build Script mit Versioning
# Dieses Script kompiliert die Assets und implementiert ein Versioning-System

set -e

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Pfade
BUNDLE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$BUNDLE_DIR/Resources/public/build"
BACKUP_DIR="$BUNDLE_DIR/Resources/public/build.backup"
TEMP_DIR="$BUNDLE_DIR/Resources/public/build.temp"

echo -e "${BLUE}🚀 CompanyOS Backend Bundle Build Script${NC}"
echo -e "${BLUE}==========================================${NC}"

# Funktion zum Erstellen von Backups
create_backup() {
    echo -e "${YELLOW}📦 Erstelle Backup der aktuellen Assets...${NC}"
    
    if [ -d "$BUILD_DIR" ]; then
        # Altes Backup entfernen falls vorhanden
        if [ -d "$BACKUP_DIR" ]; then
            rm -rf "$BACKUP_DIR"
        fi
        
        # Aktuelles Build als Backup kopieren
        cp -r "$BUILD_DIR" "$BACKUP_DIR"
        echo -e "${GREEN}✅ Backup erstellt: $BACKUP_DIR${NC}"
    else
        echo -e "${YELLOW}⚠️  Keine vorhandenen Assets zum Sichern gefunden${NC}"
    fi
}

# Funktion zum Wiederherstellen des Backups
restore_backup() {
    echo -e "${YELLOW}🔄 Stelle Backup wieder her...${NC}"
    
    if [ -d "$BACKUP_DIR" ]; then
        # Aktuelles Build entfernen
        if [ -d "$BUILD_DIR" ]; then
            rm -rf "$BUILD_DIR"
        fi
        
        # Backup wiederherstellen
        cp -r "$BACKUP_DIR" "$BUILD_DIR"
        echo -e "${GREEN}✅ Backup wiederhergestellt${NC}"
    else
        echo -e "${RED}❌ Kein Backup verfügbar${NC}"
    fi
}

# Funktion zum Aufräumen
cleanup() {
    echo -e "${YELLOW}🧹 Räume temporäre Dateien auf...${NC}"
    
    # Backup entfernen (da Build erfolgreich war)
    if [ -d "$BACKUP_DIR" ]; then
        rm -rf "$BACKUP_DIR"
        echo -e "${GREEN}✅ Backup entfernt${NC}"
    fi
    
    # Temp-Verzeichnis entfernen falls vorhanden
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
        echo -e "${GREEN}✅ Temporäre Dateien entfernt${NC}"
    fi
}

# Funktion zum Behandeln von Fehlern
handle_error() {
    echo -e "${RED}❌ Build fehlgeschlagen!${NC}"
    echo -e "${YELLOW}🔄 Stelle vorherigen Zustand wieder her...${NC}"
    restore_backup
    cleanup
    exit 1
}

# Error Handler setzen
trap handle_error ERR

# Prüfen ob Node.js und npm verfügbar sind
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js ist nicht installiert${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm ist nicht installiert${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js und npm verfügbar${NC}"

# In das Bundle-Verzeichnis wechseln
cd "$BUNDLE_DIR"

# Backup erstellen
create_backup

# Dependencies installieren falls package-lock.json nicht existiert
if [ ! -f "package-lock.json" ]; then
    echo -e "${YELLOW}📦 Installiere Dependencies...${NC}"
    npm install
fi

# Assets in temporäres Verzeichnis kompilieren
echo -e "${YELLOW}🔨 Kompiliere Assets...${NC}"

# Temporäres Verzeichnis erstellen
mkdir -p "$TEMP_DIR"

# Webpack in temporäres Verzeichnis kompilieren
NODE_ENV=production npm run build

# Prüfen ob Build erfolgreich war
if [ ! -f "$BUILD_DIR/entrypoints.json" ]; then
    echo -e "${RED}❌ Build fehlgeschlagen: entrypoints.json nicht gefunden${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Assets erfolgreich kompiliert${NC}"

# Build-Informationen anzeigen
echo -e "${BLUE}📊 Build-Informationen:${NC}"
echo -e "  - Build-Verzeichnis: $BUILD_DIR"
echo -e "  - Entrypoints: $(ls -la "$BUILD_DIR"/*.json 2>/dev/null | wc -l) Dateien"
echo -e "  - JavaScript: $(ls -la "$BUILD_DIR"/*.js 2>/dev/null | wc -l) Dateien"
echo -e "  - CSS: $(ls -la "$BUILD_DIR"/*.css 2>/dev/null | wc -l) Dateien"

# Aufräumen
cleanup

echo -e "${GREEN}🎉 Build erfolgreich abgeschlossen!${NC}"
echo -e "${BLUE}💡 Die alten Assets wurden durch die neuen ersetzt.${NC}" 