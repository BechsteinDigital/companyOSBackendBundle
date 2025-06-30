import template from './co-users-table.hba'
import './co-users-table.scss'

export default {
    template,
    name: 'co-users-table',
    props: {
        users: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    data() {
        return {
            selectedUsers: [],
            loading: false
        }
    },
    computed: {
        allUsersSelected() {
            return this.users.length > 0 && this.selectedUsers.length === this.users.length
        },
        someUsersSelected() {
            return this.selectedUsers.length > 0 && this.selectedUsers.length < this.users.length
        }
    },
    methods: {
        selectAllUsers(event: Event) {
            const target = event.target as HTMLInputElement
            if (target.checked) {
                this.selectedUsers = this.users.map((user: any) => user.id)
            } else {
                this.selectedUsers = []
            }
        },
        formatDate(date: Date): string {
            return new Intl.DateTimeFormat('de-DE', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(date)
        },
        editUser(user: any) {
            // Hier würde die Benutzer-Bearbeitung implementiert
            console.log('Benutzer bearbeiten:', user)
            this.$emit('edit-user', user)
        },
        deleteUser(user: any) {
            if (confirm(`Möchten Sie den Benutzer "${user.name}" wirklich löschen?`)) {
                // Hier würde die Benutzer-Löschung implementiert
                console.log('Benutzer löschen:', user)
                this.$emit('delete-user', user)
            }
        },
        bulkActivate() {
            if (confirm(`Möchten Sie ${this.selectedUsers.length} Benutzer aktivieren?`)) {
                // Hier würde die Bulk-Aktivierung implementiert
                console.log('Bulk aktivieren:', this.selectedUsers)
                this.$emit('bulk-activate', this.selectedUsers)
            }
        },
        bulkDeactivate() {
            if (confirm(`Möchten Sie ${this.selectedUsers.length} Benutzer deaktivieren?`)) {
                // Hier würde die Bulk-Deaktivierung implementiert
                console.log('Bulk deaktivieren:', this.selectedUsers)
                this.$emit('bulk-deactivate', this.selectedUsers)
            }
        },
        bulkDelete() {
            if (confirm(`Möchten Sie ${this.selectedUsers.length} Benutzer wirklich löschen?`)) {
                // Hier würde die Bulk-Löschung implementiert
                console.log('Bulk löschen:', this.selectedUsers)
                this.$emit('bulk-delete', this.selectedUsers)
            }
        }
    },
    watch: {
        users: {
            handler() {
                // Entferne ausgewählte Benutzer, die nicht mehr in der Liste sind
                this.selectedUsers = this.selectedUsers.filter(id => 
                    this.users.some((user: any) => user.id === id)
                )
            },
            immediate: true
        }
    }
} 