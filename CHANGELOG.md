# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.72-alpha] - 2025-06-27

### Changed
- refactor: Services direkt registrieren und Controller als Service hinzufügen


## [0.1.71-alpha] - 2025-06-27

### Fixed
- fix: Update resource paths in services.yaml for correct Composer package path


## [0.1.70-alpha] - 2025-06-27

### Added
- feat: Update CompanyOSBackendExtension to extend Symfony\Component\Dependency...


## [0.1.69-alpha] - 2025-06-27

### Added
- feat: Hinzufügen von Security Headers Listener und CSRF-Token Generierung in...


## [0.1.68-alpha] - 2025-06-27

### Security
- **BREAKING**: Implementiere umfassende Sicherheitsverbesserungen
- **feat(security)**: CSRF-Schutz für alle Formulare hinzugefügt
- **feat(security)**: Security Headers mit Umgebungsunterscheidung implementiert
- **feat(security)**: Verbesserte Session-Sicherheit mit HttpOnly und SameSite-Cookies
- **feat(security)**: Input-Validierung und Sanitization für Login-Daten
- **feat(security)**: Content Security Policy (CSP) für XSS-Schutz
- **feat(security)**: Automatische CSRF-Token-Erneuerung bei Ablauf
- **feat(security)**: E-Mail-Format-Validierung im Frontend und Backend
- **feat(security)**: Passwort-Mindestlänge von 8 Zeichen
- **feat(security)**: Umgebungsunterscheidung für Development/Production/Test
- **feat(security)**: Verbesserte Axios-Interceptors mit CSRF-Schutz
- **feat(security)**: Security-Dokumentation aktualisiert

### Changed
- **refactor(auth)**: Auth-Store um CSRF-Token-Management erweitert
- **refactor(login)**: Login-Formular mit Client-seitiger Validierung
- **refactor(backend)**: BackendController um CSRF-Token-Endpunkt erweitert
- **refactor(user)**: UserRepository mit Input-Sanitization verbessert

### Technical
- **config(security)**: Security-Konfiguration mit Umgebungsunterscheidung
- **config(framework)**: Session-Sicherheit und CSRF-Schutz konfiguriert
- **config(headers)**: Security Headers für verschiedene Umgebungen

## [0.1.67-alpha] - 2025-06-27

### Added
- feat(auth): Aktualisiere Login- und Refresh-Methoden, entferne Debug-Logging


## [0.1.66-alpha] - 2025-06-27

### Added
- feat(auth): Hinzufügen von Scope-Unterstützung für Login und Refresh-Token


## [0.1.65-alpha] - 2025-06-27

### Added
- feat(auth): Profile nach Token-Setup abrufen


## [0.1.64-alpha] - 2025-06-27

### Added
- feat: Implement use of auth store for logout in AppHeaderDropdownAccnt.vue


## [0.1.63-alpha] - 2025-06-27

### Added
- fix(auth): Fix encoding issue in password field in OAuth2 request


## [0.1.62-alpha] - 2025-06-27

### Added
- feat(auth): Hinzufügen von Debug-Logging für OAuth2-Anforderungen und -Antworten


## [0.1.61-alpha] - 2025-06-27

### Added
- feat(auth): Verwende FormData für OAuth2 Token-Anforderungen


## [0.1.60-alpha] - 2025-06-27

### Fixed
- fix: Verhindere Axios-Transformation bei Authentifizierungsanfragen


## [0.1.59-alpha] - 2025-06-27

### Fixed
- fix: Set correct Content-Type header for OAuth token requests


## [0.1.58-alpha] - 2025-06-27

### Changed
- refactor: Update API endpoint for fetching user profile in auth store


## [0.1.57-alpha] - 2025-06-27

### Fixed
- fix: Behebe fehlenden Zeilenumbruch am Ende der Datei App.vue


## [0.1.56-alpha] - 2025-06-27

### Changed
- refactor: Dynamische Anzeige von Layout-Komponenten basierend auf dem aktuell...


## [0.1.55-alpha] - 2025-06-27

### Fixed
- fix: Update import path for useAuthStore in Login.vue to fix path issue.


## [0.1.54-alpha] - 2025-06-27

### Added
- feat: Implementiere Authentifizierung mit Store und Axios-Interceptor


## [0.1.53-alpha] - 2025-06-27

### Maintenance
- chore: Update composer require version to ^0.1.52-alpha in README.md


## [0.1.52-alpha] - 2025-06-26

### Added
- feat(app): Theme-Color-Mode Handling wie im CoreUIAdminTemplate verbessert


## [0.1.51-alpha] - 2025-06-26

### Added
- feat: Hinzufügen von @coreui/chartjs und @coreui/vue-chartjs dependencies


## [0.1.50-alpha] - 2025-06-26

### Changed
- refactor: Verwendung von externen Styles in App.vue aktualisiert


## [0.1.49-alpha] - 2025-06-26

### Changed
- refactor: Aktualisiere Styling in App.vue und entferne ungenutzte Imports


## [0.1.48-alpha] - 2025-06-26

### Added
- feat: Enable Sass loader in webpack configuration


## [0.1.47-alpha] - 2025-06-26

### Fixed
- fix: Behebe fehlenden Zeilenumbruch in app.js im CompanyOS Backend Bundle


## [0.1.46-alpha] - 2025-06-26

### Added
- feat: Implement Theme-Color-Mode Handling and Sidebar Visibility Toggle in 'C...


## [0.1.45-alpha] - 2025-06-26

### Added
- feat: Update layout in App.vue to improve user experience


## [0.1.44-alpha] - 2025-06-26

### Changed
- refactor: Aktualisiere die Sidebar-Store-Implementierung mit Vue 3 Reactive-API


## [0.1.43-alpha] - 2025-06-26

### Added
- feat: Add piniaPluginPersistedstate and simplebar-vue dependencies, update Ap...


## [0.1.42-alpha] - 2025-06-26

### Added
- feat: Hinzufügen von CSidebarNav zu AppSidebarNav-Komponente


## [0.1.41-alpha] - 2025-06-26

### Added
- feat: Swap AppHeader and AppSidebar components in App.vue layout for better u...


## [0.1.40-alpha] - 2025-06-26

### Maintenance
- chore: Update devDependencies and dependencies versions in package.json


## [0.1.39-alpha] - 2025-06-26

### Fixed
- fix: Update postcss-simple-vars and postcss-nested versions in package.json


## [0.1.38-alpha] - 2025-06-26

### Fixed
- fix: Update popper.js to @popperjs/core in package.json


## [0.1.37-alpha] - 2025-06-26

### Changed
- refactor: Ändere Namespace in CompanyOS\Bundle\BackendBundle\Controller.


## [0.1.36-alpha] - 2025-06-26

### Changed
- refactor: Update namespace in services.yaml for consistency with bundle namin...


## [0.1.35-alpha] - 2025-06-26

### Changed
- refactor: Ändere den Controller-Pfad in CompanyOS\BundleBackendBundle\Contro...


## [0.1.34-alpha] - 2025-06-26

### Added
- feat: Neue Funktion hinzugefügt, um Benutzerprofile zu verwalten.


## [0.1.33-alpha] - 2025-06-26

### Added
- feat: Hinzufügen von CompanyOSBackendExtension für die Erweiterung des Bundles


## [0.1.32-alpha] - 2025-06-26

### Added
- feat: Neue Funktion hinzugefügt, um Benutzerprofile zu verwalten.


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
