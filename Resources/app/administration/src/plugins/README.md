# CompanyOS Plugin Development Guide

## Template Block System

Das CompanyOS Backend verwendet ein Template-Block-System, das es Plugins ermöglicht, bestehende Templates zu erweitern, ohne sie zu überschreiben.

### Verfügbare Template-Blöcke

#### Dashboard (`co-dashboard-index`)

- **`dashboard_header`** - Header-Bereich des Dashboards
- **`dashboard_stats`** - Statistik-Karten
- **`dashboard_main_content`** - Hauptinhalt (Charts, Aktivitäten)
- **`dashboard_sidebar`** - Seitenleiste mit Schnellaktionen
- **`dashboard_footer`** - Footer-Bereich
- **`dashboard_extensions`** - Zusätzliche Inhalte (leer, für Plugins)

#### Users List (`co-users-list`)

- **`users_header`** - Header mit Titel und Aktionen
- **`users_filters`** - Such- und Filter-Optionen
- **`users_table`** - Benutzer-Tabelle
- **`users_pagination`** - Paginierung
- **`users_extensions`** - Zusätzliche Inhalte (leer, für Plugins)

#### Plugins List (`co-plugins-list`)

- **`plugins_header`** - Header mit Titel und Aktionen
- **`plugins_filters`** - Such- und Filter-Optionen
- **`plugins_grid`** - Plugin-Karten-Grid
- **`plugins_extensions`** - Zusätzliche Inhalte (leer, für Plugins)

#### Settings (`co-settings-index`)

- **`settings_header`** - Header mit Titel und Speichern-Button
- **`settings_tabs`** - Tab-Navigation
- **`settings_content`** - Tab-Inhalte
- **`settings_extensions`** - Zusätzliche Inhalte (leer, für Plugins)

### Plugin-Entwicklung

#### 1. Plugin-Struktur

```typescript
import type { CompanyOSPlugin } from '../core/companyos'
import TemplateRenderer from '../core/template-renderer'

const MyPlugin: CompanyOSPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  install: (companyOS) => {
    const templateRenderer = TemplateRenderer.getInstance()
    
    // Template-Blöcke erweitern
    templateRenderer.extendTemplate('template-name', [
      {
        name: 'block-name',
        content: '<div>Mein Plugin-Inhalt</div>',
        priority: 5 // Optional: Priorität (höher = wird zuerst gerendert)
      }
    ])
  }
}

export default MyPlugin
```

#### 2. Template-Blöcke erweitern

```typescript
// Dashboard Header erweitern
templateRenderer.extendTemplate('co-dashboard-index', [
  {
    name: 'dashboard_header',
    content: `
      <div class="mb-4 p-4 bg-blue-50 rounded-lg">
        <h2>Mein Plugin Header</h2>
      </div>
    `,
    priority: 10
  }
])

// Dashboard Extensions Block erweitern
templateRenderer.extendTemplate('co-dashboard-index', [
  {
    name: 'dashboard_extensions',
    content: `
      <div class="mt-8">
        <div class="co-card">
          <div class="co-card-header">
            <h3>Meine Plugin-Funktionen</h3>
          </div>
          <div class="co-card-body">
            <p>Plugin-Inhalt hier...</p>
          </div>
        </div>
      </div>
    `
  }
])
```

#### 3. Prioritäten

Blöcke werden nach Priorität sortiert (höhere Priorität = wird zuerst gerendert):

- **10+** - Sehr hohe Priorität (System-Critical)
- **5-9** - Hohe Priorität (Wichtig)
- **1-4** - Normale Priorität (Standard)
- **0** - Niedrige Priorität (Fallback)

#### 4. Best Practices

1. **Verwende existierende Blöcke** anstatt neue zu erstellen
2. **Nutze `*_extensions` Blöcke** für zusätzliche Inhalte
3. **Setze angemessene Prioritäten** für deine Blöcke
4. **Verwende Tailwind CSS Klassen** für konsistentes Styling
5. **Teste deine Erweiterungen** in verschiedenen Kontexten

#### 5. Beispiel-Plugin

Siehe `example-dashboard-extension.ts` für ein vollständiges Beispiel.

### Template-Rendering

Das Template-Rendering-System ersetzt automatisch Block-Platzhalter:

```handlebars
{{#block "block_name"}}
  Standard-Inhalt
{{/block}}
```

Wird zu:

```html
Standard-Inhalt
Plugin-Inhalt 1
Plugin-Inhalt 2
```

### Erweiterte Funktionen

#### 1. Mehrere Blöcke gleichzeitig erweitern

```typescript
templateRenderer.extendTemplate('co-dashboard-index', [
  {
    name: 'dashboard_header',
    content: 'Header-Erweiterung',
    priority: 5
  },
  {
    name: 'dashboard_extensions',
    content: 'Extensions-Erweiterung',
    priority: 1
  }
])
```

#### 2. Bedingte Erweiterungen

```typescript
if (userHasPermission('admin')) {
  templateRenderer.extendTemplate('co-dashboard-index', [
    {
      name: 'dashboard_extensions',
      content: '<div>Admin-spezifische Inhalte</div>'
    }
  ])
}
```

#### 3. Dynamische Inhalte

```typescript
templateRenderer.extendTemplate('co-dashboard-index', [
  {
    name: 'dashboard_extensions',
    content: `
      <div class="co-card">
        <div class="co-card-header">
          <h3>Dynamische Inhalte</h3>
        </div>
        <div class="co-card-body">
          <p>Benutzer: ${currentUser.name}</p>
          <p>Zeit: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `
  }
])
```

### Troubleshooting

#### Problem: Block wird nicht gerendert
- Überprüfe den Block-Namen (Groß-/Kleinschreibung beachten)
- Stelle sicher, dass das Plugin korrekt installiert ist
- Überprüfe die Browser-Konsole auf Fehler

#### Problem: Falsche Reihenfolge
- Passe die Priorität des Blocks an
- Höhere Priorität = wird zuerst gerendert

#### Problem: Styling-Konflikte
- Verwende spezifische CSS-Klassen für dein Plugin
- Nutze CSS-Scoping oder Präfixe
- Teste in verschiedenen Themes 