# CompanyOS Backend Bundle

Ein vollständiges Symfony-Bundle für das CompanyOS Backend-Frontend mit VueJS, CoreUI und modularem Admin-Interface.

[![Latest Version on Packagist](https://img.shields.io/packagist/v/companyos/backend.svg)](https://packagist.org/packages/companyos/backend)
[![Total Downloads](https://img.shields.io/packagist/dt/companyos/backend.svg)](https://packagist.org/packages/companyos/backend)
[![License](https://img.shields.io/packagist/l/companyos/backend.svg)](https://packagist.org/packages/companyos/backend)

## ⚠️ Alpha Version

**Dies ist eine Alpha-Version (0.1.133-alpha

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
composer require companyos/backend:^0.1.133-alpha
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

### Dynamische Plugin-Integration

- Plugins werden als eigenständige Bundles entwickelt und gebaut
- Nach dem Login werden alle aktiven Plugins über die API geladen
- Die Sidebar und die Routen werden automatisch um die Navigation und Views der aktiven Plugins erweitert
- Plugins registrieren ihre Navigation und Routen in ihrem eigenen Bundle (z.B. `window.plugin_MyPlugin`)
- Keine statischen Entrypoints oder manuelle Navigationserweiterung nötig

### Beispiel für ein Plugin

```javascript
// In custom/plugins/CompanyOSCRMPlugin/Resources/app/main.js
import CustomerList from './components/CustomerList.vue'
import ContractList from './components/ContractList.vue'

export const components = {
    'CustomerList': CustomerList,
    'ContractList': ContractList
}

export const routes = [
    {
        path: '/plugin/crm/customers',
        name: 'crm-customers',
        component: CustomerList,
        meta: { title: 'Kunden', permission: 'crm.customers' }
    },
    {
        path: '/plugin/crm/contracts',
        name: 'crm-contracts',
        component: ContractList,
        meta: { title: 'Verträge', permission: 'crm.contracts' }
    }
]

export const navigation = [
    { component: 'CNavTitle', name: 'CRM', permission: 'crm' },
    { component: 'CNavItem', name: 'Kunden', to: '/plugin/crm/customers', icon: 'cil-people', permission: 'crm.customers' },
    { component: 'CNavItem', name: 'Verträge', to: '/plugin/crm/contracts', icon: 'cil-file', permission: 'crm.contracts' }
]

window.plugin_CompanyOSCRMPlugin = {
    components,
    routes,
    navigation,
    name: 'CompanyOSCRMPlugin'
}
```

### Berechtigungen

- Die Sidebar und die Routen werden automatisch nach den Berechtigungen des eingeloggten Users gefiltert
- Jede Navigation und Route kann ein `permission`-Attribut haben
- Nur User mit entsprechender Berechtigung sehen und nutzen die Plugin-Funktionen

---

**Das Plugin-System ist jetzt vollständig dynamisch und benötigt keine statischen Entrypoints oder Navigationserweiterungen mehr!**

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