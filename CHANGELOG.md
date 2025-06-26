# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.31-alpha] - 2025-06-26

### Maintenance
- chore: erhöhe Version auf 0.1.30-alpha in composer.json


## [0.1.29-alpha] - 2025-06-26

### Fixed
- fix: Update sass-loader version to 16.0.1 in package.json


## [0.1.28-alpha] - 2025-06-26

### Maintenance
- chore: Update @symfony/webpack-encore to version 5.1.0 in package.json


## [0.1.27-alpha] - 2025-06-26

### Maintenance
- chore: Update dependencies in CompanyOS Backend Bundle


## [0.1.26-alpha] - 2025-06-26

### Maintenance
- chore: Update devDependencies in package.json for CompanyOS Backend Bundle


## [0.1.25-alpha] - 2025-06-26

### Maintenance
- chore: Update dependencies in CompanyOS Backend Bundle


## [0.1.24-alpha] - 2025-06-26

### Added
- feat: Update dependencies in package.json for CompanyOS Backend Bundle


## [0.1.23-alpha] - 2025-06-26

### Added
- feat: Neue Funktion hinzugefügt, um Benutzerprofile zu bearbeiten.


## [0.1.22-alpha] - 2025-06-26

### Changed
- refactor: Entferne nicht benötigte Kommentare und Leerzeilen in backend.html...


## [0.1.21-alpha] - 2025-06-26

### Added
- feat(routes): Update CompanyOS Backend Bundle routes for Vue.js SPA.


## [0.1.20-alpha] - 2025-06-26

### Added
- feat(BackendController): Aktualisiere Routenparameter für CompanyOS Backend ...


## [0.1.19-alpha] - 2025-06-26

### Added
- feat: Ändere die Router-History auf '/admin' in app.js


## [0.1.18-alpha] - 2025-06-26

### Added
- refactor(views): Update CSS and JS loading in backend.html.twig


## [0.1.17-alpha] - 2025-06-26

### Added
- feat: Hinzufügen von symfony/asset als Abhängigkeit für das CompanyOS Back...


## [0.1.16-alpha] - 2025-06-26

### Added
- feat: Add getPath method to retrieve bundle path in CompanyOS Backend Bundle


## [0.1.15-alpha] - 2025-06-26

### Changed
- refactor: Entferne ungenutzte Dateien und Code für CompanyOS Backend Bundle.


## [0.1.14-alpha] - 2025-06-26

### Added
- feat: Update icons and dependencies in CompanyOS Backend Bundle


## [0.1.13-alpha] - 2025-06-26

### Fixed
- fix: Updated webpack entry path for better organization in 'CompanyOS Backend...


## [0.1.12-alpha] - 2025-06-26

### Changed
- refactor: Entferne ungenutzte Dateien und nicht verwendeten Code in webpack.c...


## [0.1.11-alpha] - 2025-06-26

### Added
- feat: Hinzufügen von file-loader zur Unterstützung des Datei-Handlings in S...


## [0.1.10-alpha] - 2025-06-26

### Added
- feat: Set manifest key prefix in webpack config for CompanyOS Backend Bundle


## [0.1.9-alpha] - 2025-06-26

### Maintenance
- chore: Update dependencies versions for vue, coreui, icons-vue, and vue in pa...


## [0.1.8-alpha] - 2025-06-26

### Fixed
- fix: Update resource paths in services.yaml for better organization.


## [0.1.7-alpha] - 2025-06-26

### Changed
- refactor: Update service configuration paths for better organization in servi...


## [0.1.6-alpha] - 2025-06-26

### Changed
- refactor: Update service configuration paths for better organization in services.yaml


## [0.1.5-alpha] - 2025-06-26

### Changed
- refactor: Update Pfad für Bundle-Ressourcen in services.yaml


## [0.1.4-alpha] - 2025-06-26

### Changed
- refactor: Update service configuration paths for better organization.


### Geplant
- Vollständige CRUD-Implementierungen für alle Module
- Plugin-System-Integration
- Unit und Integration Tests
- API-Integration mit CoreBundle
- Erweiterte Dashboard-Widgets

## [0.1.0-alpha] - 2024-01-15

### Hinzugefügt
- Initiale Alpha-Version des BackendBundles
- Vollständige CoreUI-Admin-Template-Integration
- VueJS 3 mit Composition API
- Responsive Sidebar und Header
- Theme-System (Dark/Light Mode)
- Navigation mit Breadcrumbs
- Login-System mit Authentication
- Dashboard mit Widgets
- Routing-System mit Auth-Guard
- Pinia State Management
- Webpack-Konfiguration für Asset-Building
- Admin-Controller für `/admin`-Route
- Twig-Template für VueJS-App
- Grundlegende Views (Dashboard, Login, Users)
- Plugin-System-Vorbereitung

### Technische Details
- Symfony 7.3 Kompatibilität
- PHP 8.2+ Unterstützung
- CoreUI 4.x Integration
- Vue 3.x mit Composition API
- Webpack Encore für Asset-Building
- Pinia für State Management
- Axios für API-Calls

### Architektur
- Reines Frontend-Bundle
- API-First Design
- Modulare Komponenten-Struktur
- Plugin-System vorbereitet
- Responsive Design
