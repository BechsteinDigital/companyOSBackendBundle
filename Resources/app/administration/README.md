# CompanyOS Administration

Das neue CompanyOS Administration-System kombiniert das Beste aus allen Welten:

## ✅ Features

- **Shopware-ähnliche Template-Erweiterbarkeit** mit Twig-Blöcken
- **Moderne Vue.js 3 Interaktivität** mit Composition API
- **Zero-Config Plugin-Entwicklung** für einfache Erweiterungen
- **Hot-Reload ohne Downtime** für schnelle Entwicklung
- **Lazy-Loading für Performance** mit dynamischen Imports

## 🏗️ Architektur

```
Resources/app/administration/src/
├── core/                    # CompanyOS Core-System
│   └── companyos.ts        # Haupt-Klasse für Plugin-System
├── component/              # Basis-Komponenten
│   ├── base/              # UI-Komponenten (Button, Card, Modal)
│   └── structure/         # Layout-Komponenten (Page, Sidebar, Header)
├── module/                # Funktionsmodule
│   ├── co-dashboard/      # Dashboard-Modul
│   ├── co-users/          # Benutzer-Verwaltung
│   ├── co-plugins/        # Plugin-Management
│   └── co-settings/       # System-Einstellungen
└── styles/                # SCSS-Styles und Variablen
```

## 🚀 Entwicklung

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

## 🔌 Plugin-System

### Plugin erstellen
```typescript
const MyPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  install(companyOS) {
    // Plugin-Logik hier
    companyOS.registerModule({
      name: 'my-module',
      routes: [...],
      components: {...}
    })
  }
}

// Plugin registrieren
window.CompanyOS.registerPlugin(MyPlugin)
```

### Template erweitern
```twig
{# In base.html.twig #}
{% block head %}
  {{ parent() }}
  <link rel="stylesheet" href="/my-plugin/styles.css">
{% endblock %}

{% block scripts %}
  {{ parent() }}
  <script src="/my-plugin/script.js"></script>
{% endblock %}
```

## 🎨 Design-System

Das System verwendet ein konsistentes Design-System mit:
- SCSS-Variablen für Farben, Abstände, etc.
- Modulare Komponenten (CoButton, CoCard, CoModal)
- Responsive Grid-System
- Utility-Klassen

## 📱 Responsive Design

Das Administration-System ist vollständig responsive und funktioniert auf:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔧 Konfiguration

### Vite-Konfiguration
- Hot-Reload für schnelle Entwicklung
- SCSS-Unterstützung mit Variablen
- TypeScript-Integration
- Path-Aliase für einfache Imports

### TypeScript
- Strikte Typisierung
- Path-Mapping für @admin/* Imports
- Vue 3 Support

## 🎯 Nächste Schritte

1. **Plugin-API erweitern** - Mehr Möglichkeiten für Plugin-Entwickler
2. **Theme-System** - Anpassbare Designs
3. **Internationalisierung** - Mehrsprachige Unterstützung
4. **Performance-Optimierung** - Code-Splitting und Caching
5. **Testing-Framework** - Unit und E2E Tests 