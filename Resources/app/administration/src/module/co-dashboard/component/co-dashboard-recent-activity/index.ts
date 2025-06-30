import template from './co-dashboard-recent-activity.hba'
import './co-dashboard-recent-activity.scss'

export default {
    template,
    name: 'co-dashboard-recent-activity',
    data() {
        return {
            activities: [
                {
                    id: 1,
                    type: 'user',
                    message: 'Neuer Benutzer registriert: Max Mustermann',
                    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 Minuten ago
                },
                {
                    id: 2,
                    type: 'order',
                    message: 'Neue Bestellung eingegangen: #ORD-2024-001',
                    timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 Minuten ago
                },
                {
                    id: 3,
                    type: 'system',
                    message: 'System-Update abgeschlossen',
                    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 Minuten ago
                }
            ]
        }
    },
    methods: {
        getActivityIcon(type: string): string {
            const icons = {
                user: 'icon icon-users',
                order: 'icon icon-shopping-cart',
                system: 'icon icon-cog'
            }
            return icons[type] || 'icon icon-info'
        },
        formatTime(timestamp: Date): string {
            const now = new Date()
            const diff = now.getTime() - timestamp.getTime()
            const minutes = Math.floor(diff / (1000 * 60))
            
            if (minutes < 1) return 'Gerade eben'
            if (minutes < 60) return `vor ${minutes} Minuten`
            
            const hours = Math.floor(minutes / 60)
            if (hours < 24) return `vor ${hours} Stunden`
            
            const days = Math.floor(hours / 24)
            return `vor ${days} Tagen`
        },
        refreshActivities() {
            // Hier würde der API-Call stehen
            console.log('Refreshing activities...')
        }
    }
} 