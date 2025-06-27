# CompanyOS Backend Bundle

Ein vollständiges Symfony-Bundle für das CompanyOS Backend-Frontend mit VueJS, CoreUI und modularem Admin-Interface.

[![Latest Version on Packagist](https://img.shields.io/packagist/v/companyos/backend-bundle.svg)](https://packagist.org/packages/companyos/backend-bundle)
[![Total Downloads](https://img.shields.io/packagist/dt/companyos/backend-bundle.svg)](https://packagist.org/packages/companyos/backend-bundle)
[![License](https://img.shields.io/packagist/l/companyos/backend-bundle.svg)](https://packagist.org/packages/companyos/backend-bundle)

## ⚠️ Alpha Version

**Dies ist eine Alpha-Version (0.1.6-alpha) und ist NICHT für den Produktiveinsatz geeignet.**

### Was funktioniert:
- ✅ Vollständiges CoreUI-Admin-Template
- ✅ VueJS 3 mit Composition API
- ✅ Responsive Sidebar und Header
- ✅ Theme-Switching (Dark/Light Mode)
- ✅ Routing und Navigation
- ✅ Login-System
- ✅ Dashboard mit Widgets

### Was noch fehlt:
- ❌ Vollständige CRUD-Implementierungen
- ❌ Unit/Integration Tests
- ❌ Plugin-System-Integration
- ❌ Vollständige API-Integration

## Architektur

Das BackendBundle ist ein **reines Frontend-Bundle**:

- **VueJS-Frontend**: SPA mit CoreUI-Design
- **Webpack-Build**: Asset-Kompilierung
- **Admin-Interface**: Vollständige Admin-Oberfläche
- **Plugin-System**: Erweiterbar durch Plugins
- **API-First**: Konsumiert CoreBundle-API

## Features

- **CoreUI-Integration**: Vollständiges Admin-Template
- **VueJS 3**: Modernes Frontend-Framework
- **Responsive Design**: Mobile-freundlich
- **Theme-System**: Dark/Light Mode
- **Navigation**: Dynamische Sidebar-Navigation
- **Authentication**: Login/Logout-System
- **Dashboard**: Übersicht mit Widgets
- **Plugin-Ready**: Erweiterbar durch Plugins

## Installation

### ⚠️ Nur für Entwickler und Tester

```bash
composer require companyos/backend:^0.1.64-alpha
```

### Bundle registrieren

```php
// config/bundles.php
return [
    // ... andere Bundles
    CompanyOS\BackendBundle\CompanyOSBackendBundle::class => ['all' => true],
];
```

### Frontend-Dependencies installieren

```bash
cd vendor/companyos/backend
npm install
```

### Assets kompilieren

```bash
# Development
npm run dev

# Production
npm run build
```

## Verwendung

### Admin-Interface aufrufen

Das Bundle registriert automatisch die `/admin`-Route:

```
http://your-domain.com/admin
```

### Navigation

Das Admin-Interface bietet folgende Bereiche:

- **Dashboard**: Übersicht und Statistiken
- **Benutzer**: Benutzer-Verwaltung
- **Rollen**: Rollen- und Berechtigungsverwaltung
- **Plugins**: Plugin-Management
- **Einstellungen**: System-Konfiguration
- **Webhooks**: Webhook-Verwaltung
- **API-Dokumentation**: API-Referenz
- **System-Status**: System-Monitoring

### Theme-System

Das Bundle unterstützt automatisch:

- **Light Mode**: Helles Design
- **Dark Mode**: Dunkles Design
- **Auto Mode**: Automatische Erkennung

## Entwicklung

### Frontend-Entwicklung

```bash
# Im Bundle-Verzeichnis
cd vendor/companyos/backend

# Dependencies installieren
npm install

# Development-Server starten
npm run dev

# Watch-Modus
npm run watch

# Production-Build
npm run build
```

### Neue Views erstellen

```vue
<!-- Resources/app/views/MyView.vue -->
<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader>
        <strong>Meine View</strong>
      </CCardHeader>
      <CCardBody>
        <p>Meine View-Inhalte</p>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
// View-Logik hier
</script>
```

### Navigation erweitern

```javascript
// _nav.js erweitern
export default [
  // ... bestehende Navigation
  {
    component: 'CNavItem',
    name: 'Meine View',
    to: '/my-view',
    icon: 'cil-star',
  },
]
```

## Plugin-System

Plugins können das BackendBundle erweitern durch:

### Vue-Komponenten

```vue
<!-- Plugin-Komponente -->
<template>
  <div class="plugin-component">
    <h3>Plugin-Komponente</h3>
  </div>
</template>
```

### Navigation-Erweiterungen

```javascript
// Plugin-Navigation
export const pluginNav = [
  {
    component: 'CNavItem',
    name: 'Plugin-Feature',
    to: '/plugin-feature',
    icon: 'cil-puzzle',
  },
]
```

### Asset-Überschreibungen

Plugins können CoreUI-Komponenten überschreiben und eigene Assets hinzufügen.

## API-Integration

Das BackendBundle konsumiert die API des CoreBundles:

```javascript
// API-Calls
import axios from 'axios'

// Benutzer abrufen
const users = await axios.get('/api/users')

// Plugin installieren
await axios.post('/api/plugins/my-plugin/install')
```

## Konfiguration

### Webpack-Konfiguration

```javascript
// webpack.config.js
Encore
  .setOutputPath('Resources/public/build/')
  .setPublicPath('/bundles/companyosbackend/build')
  .addEntry('app', './Resources/app/frontend/app.js')
  .enableVueLoader()
```

### Asset-Pfade

```twig
{# admin.html.twig #}
<link rel="stylesheet" href="{{ asset('bundles/companyosbackend/build/app.css') }}">
<script src="{{ asset('bundles/companyosbackend/build/app.js') }}"></script>
```

## Testing

```bash
# PHPUnit Tests
./vendor/bin/phpunit

# Frontend Tests (später)
npm run test
```

## Contributing

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## License

Dieses Bundle ist unter der MIT-Lizenz lizenziert. Siehe [LICENSE](LICENSE) für Details.

## Support

- **Issues**: [GitHub Issues](https://github.com/companyos/backend-bundle/issues)
- **Documentation**: [GitHub Wiki](https://github.com/companyos/backend-bundle/wiki)
- **Email**: info@bechstein.digital

## Changelog

Siehe [CHANGELOG.md](CHANGELOG.md) für eine Liste der Änderungen.