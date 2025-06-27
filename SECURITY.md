# Sicherheitsrichtlinien

## Melden von Sicherheitslücken

Wir nehmen die Sicherheit von CompanyOS Backend Bundle sehr ernst. Wenn Sie eine Sicherheitslücke entdecken, melden Sie diese bitte direkt an uns, anstatt einen öffentlichen Issue zu erstellen.

### Wie Sie eine Sicherheitslücke melden können:

1. **E-Mail**: Senden Sie eine detaillierte Beschreibung an security@bechstein.digital
2. **Verschlüsselt**: Verwenden Sie PGP für sensible Informationen
3. **Detailliert**: Beschreiben Sie die Lücke so genau wie möglich

### Was wir erwarten:

- **Beschreibung**: Detaillierte Beschreibung der Sicherheitslücke
- **Schritte zur Reproduktion**: Wie kann die Lücke reproduziert werden?
- **Betroffene Versionen**: Welche Versionen sind betroffen?
- **Auswirkungen**: Was sind die möglichen Auswirkungen?
- **Vorschläge**: Haben Sie Vorschläge zur Behebung?

### Was wir tun werden:

1. **Bestätigung**: Wir bestätigen den Eingang innerhalb von 24 Stunden
2. **Untersuchung**: Wir untersuchen die gemeldete Lücke
3. **Behebung**: Wir entwickeln eine Lösung
4. **Update**: Wir veröffentlichen ein Security-Update
5. **Credits**: Wir geben Ihnen Credits in der Changelog

### Verantwortungsvolle Offenlegung:

- **Keine öffentliche Diskussion**: Diskutieren Sie die Lücke nicht öffentlich
- **Angemessene Zeit**: Geben Sie uns Zeit zur Behebung
- **Kooperation**: Arbeiten Sie mit uns zusammen

### Kontakt:

- **E-Mail**: security@bechstein.digital
- **PGP-Key**: [PGP-Key hier einfügen]
- **Response Time**: 24 Stunden

### Implementierte Sicherheitsmaßnahmen:

#### ✅ OAuth2-Authentifizierung
- Sichere Token-basierte Authentifizierung
- Access- und Refresh-Token mit konfigurierbaren TTLs
- Stateless API-Design für bessere Skalierbarkeit

#### ✅ Passwort-Sicherheit
- Symfony Password Hasher mit automatischer Algorithmus-Auswahl
- Sichere Passwort-Hashing-Verfahren (Argon2i/bcrypt)
- Mindestlänge von 8 Zeichen für Passwörter

#### ✅ CSRF-Schutz
- CSRF-Token für alle Formulare
- Automatische Token-Validierung
- Token-Erneuerung bei Ablauf

#### ✅ Input-Validierung & Sanitization
- E-Mail-Format-Validierung
- Input-Sanitization für alle Benutzereingaben
- XSS-Schutz durch Content Security Policy

#### ✅ Rate Limiting & Brute Force Protection
- IP-basierte Sperrung nach 5 fehlgeschlagenen Login-Versuchen
- 15-minütige Sperrzeit für blockierte IPs
- Umfassendes Audit-Logging

#### ✅ Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy für Browser-Features

#### ✅ Session-Sicherheit
- HttpOnly-Cookies
- SameSite-Cookie-Attribute
- Session-Fixation-Schutz
- Automatische Session-Bereinigung

#### ✅ Umgebungsunterscheidung
- **Development**: Weniger strenge Security Headers für bessere Entwicklererfahrung
- **Production**: Strenge Security Headers für maximale Sicherheit
- **Test**: Deaktivierte CSRF-Schutz für automatisierte Tests

### Bekannte Sicherheitslücken:

Derzeit sind keine bekannten Sicherheitslücken bekannt.

### Sicherheits-Updates:

Alle Sicherheits-Updates werden in der [CHANGELOG.md](CHANGELOG.md) dokumentiert.

### Empfohlene Produktionskonfiguration:

```yaml
# .env.local für Production
APP_ENV=prod
APP_SECRET=your-very-long-random-secret-key
OAUTH2_ENCRYPTION_KEY=your-oauth2-encryption-key
DATABASE_URL="mysql://user:password@host:port/database?charset=utf8mb4"
```

### Sicherheitscheckliste für Production:

- [ ] HTTPS/SSL konfiguriert
- [ ] Sichere APP_SECRET gesetzt
- [ ] OAuth2-Schlüssel generiert
- [ ] Datenbank-Backup konfiguriert
- [ ] Logging für Security-Events aktiviert
- [ ] Rate Limiting aktiviert
- [ ] Security Headers konfiguriert
- [ ] Session-Sicherheit aktiviert

---

**Wichtig**: Diese Alpha-Version ist NICHT für den Produktiveinsatz geeignet und sollte nur in Entwicklungsumgebungen verwendet werden. 