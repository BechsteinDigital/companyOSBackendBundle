import template from './co-plugin-card.hba'
import './co-plugin-card.scss'

export default {
    template,
    name: 'co-plugin-card',
    props: {
        plugin: {
            type: Object,
            required: true,
            default: () => ({
                id: '',
                name: '',
                description: '',
                version: '',
                author: '',
                status: 'inactive',
                icon: '/assets/default-plugin-icon.png'
            })
        }
    },
    methods: {
        activatePlugin(plugin: any) {
            // Hier würde die Plugin-Aktivierung implementiert
            console.log('Plugin aktivieren:', plugin.name)
        },
        deactivatePlugin(plugin: any) {
            // Hier würde die Plugin-Deaktivierung implementiert
            console.log('Plugin deaktivieren:', plugin.name)
        },
        configurePlugin(plugin: any) {
            // Hier würde die Plugin-Konfiguration implementiert
            console.log('Plugin konfigurieren:', plugin.name)
        },
        updatePlugin(plugin: any) {
            // Hier würde das Plugin-Update implementiert
            console.log('Plugin updaten:', plugin.name)
        },
        uninstallPlugin(plugin: any) {
            if (confirm(`Möchten Sie das Plugin "${plugin.name}" wirklich deinstallieren?`)) {
                // Hier würde die Plugin-Deinstallation implementiert
                console.log('Plugin deinstallieren:', plugin.name)
            }
        }
    }
} 