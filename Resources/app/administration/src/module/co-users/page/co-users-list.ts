import template from './co-users-list.hba'
import './co-users-list.scss'

export default {
    template,
    name: 'co-users-list',
    data() {
        return {
            users: [
                {
                    id: 1,
                    name: 'Max Mustermann',
                    username: 'max.mustermann',
                    email: 'max@example.com',
                    role: 'admin',
                    status: 'active',
                    avatar: null,
                    createdAt: new Date('2024-01-15')
                },
                {
                    id: 2,
                    name: 'Anna Schmidt',
                    username: 'anna.schmidt',
                    email: 'anna@example.com',
                    role: 'user',
                    status: 'active',
                    avatar: null,
                    createdAt: new Date('2024-02-20')
                },
                {
                    id: 3,
                    name: 'Tom Weber',
                    username: 'tom.weber',
                    email: 'tom@example.com',
                    role: 'guest',
                    status: 'inactive',
                    avatar: null,
                    createdAt: new Date('2024-03-10')
                }
            ],
            searchQuery: '',
            roleFilter: '',
            currentPage: 1,
            itemsPerPage: 10,
            loading: false
        }
    },
    computed: {
        filteredUsers() {
            let filtered = this.users

            // Suche
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase()
                filtered = filtered.filter(user => 
                    user.name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.username.toLowerCase().includes(query)
                )
            }

            // Rollen-Filter
            if (this.roleFilter) {
                filtered = filtered.filter(user => user.role === this.roleFilter)
            }

            return filtered
        },
        totalPages() {
            return Math.ceil(this.filteredUsers.length / this.itemsPerPage)
        }
    },
    methods: {
        formatDate(date: Date): string {
            return new Intl.DateTimeFormat('de-DE', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(date)
        },
        filterUsers() {
            this.currentPage = 1
        },
        changePage(page: number) {
            this.currentPage = page
        },
        createUser() {
            // Hier würde die Benutzer-Erstellung implementiert
            console.log('Neuen Benutzer erstellen')
        },
        editUser(user: any) {
            // Hier würde die Benutzer-Bearbeitung implementiert
            console.log('Benutzer bearbeiten:', user)
        },
        deleteUser(user: any) {
            if (confirm(`Möchten Sie den Benutzer "${user.name}" wirklich löschen?`)) {
                // Hier würde die Benutzer-Löschung implementiert
                console.log('Benutzer löschen:', user)
            }
        }
    },
    mounted() {
        // Hier würde das Laden der Benutzer-Daten implementiert
        console.log('Users list component mounted')
    }
} 