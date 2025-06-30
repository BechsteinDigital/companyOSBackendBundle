import template from './co-user-form.hba'
import './co-user-form.scss'

export default {
    template,
    name: 'co-user-form',
    props: {
        user: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            loading: false,
            form: {
                firstName: '',
                lastName: '',
                email: '',
                username: '',
                password: '',
                passwordConfirm: '',
                role: '',
                status: 'active',
                emailVerified: false,
                phone: '',
                department: '',
                notes: ''
            },
            errors: {}
        }
    },
    computed: {
        isEditMode(): boolean {
            return !!this.user
        },
        fullName(): string {
            return `${this.form.firstName} ${this.form.lastName}`.trim()
        }
    },
    methods: {
        async submitForm() {
            if (!this.validateForm()) {
                return
            }

            this.loading = true
            try {
                const userData = this.prepareUserData()
                
                if (this.isEditMode) {
                    await this.updateUser(userData)
                } else {
                    await this.createUser(userData)
                }

                this.$emit('success', userData)
            } catch (error) {
                console.error('Fehler beim Speichern des Benutzers:', error)
                this.$emit('error', error)
            } finally {
                this.loading = false
            }
        },
        validateForm(): boolean {
            this.errors = {}

            // Required fields
            if (!this.form.firstName.trim()) {
                this.errors.firstName = 'Vorname ist erforderlich'
            }
            if (!this.form.lastName.trim()) {
                this.errors.lastName = 'Nachname ist erforderlich'
            }
            if (!this.form.email.trim()) {
                this.errors.email = 'E-Mail ist erforderlich'
            } else if (!this.isValidEmail(this.form.email)) {
                this.errors.email = 'Ungültige E-Mail-Adresse'
            }
            if (!this.form.username.trim()) {
                this.errors.username = 'Benutzername ist erforderlich'
            }
            if (!this.isEditMode && !this.form.password) {
                this.errors.password = 'Passwort ist erforderlich'
            }
            if (this.form.password && this.form.password.length < 8) {
                this.errors.password = 'Passwort muss mindestens 8 Zeichen lang sein'
            }
            if (this.form.password && this.form.password !== this.form.passwordConfirm) {
                this.errors.passwordConfirm = 'Passwörter stimmen nicht überein'
            }
            if (!this.form.role) {
                this.errors.role = 'Rolle ist erforderlich'
            }

            return Object.keys(this.errors).length === 0
        },
        isValidEmail(email: string): boolean {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return emailRegex.test(email)
        },
        prepareUserData() {
            const userData = {
                firstName: this.form.firstName.trim(),
                lastName: this.form.lastName.trim(),
                email: this.form.email.trim(),
                username: this.form.username.trim(),
                role: this.form.role,
                status: this.form.status,
                emailVerified: this.form.emailVerified,
                phone: this.form.phone.trim(),
                department: this.form.department.trim(),
                notes: this.form.notes.trim()
            }

            // Only include password if provided
            if (this.form.password) {
                userData.password = this.form.password
            }

            return userData
        },
        async createUser(userData: any) {
            // Hier würde der API-Call für die Benutzer-Erstellung stehen
            console.log('Benutzer erstellen:', userData)
            return userData
        },
        async updateUser(userData: any) {
            // Hier würde der API-Call für die Benutzer-Aktualisierung stehen
            console.log('Benutzer aktualisieren:', userData)
            return userData
        },
        cancel() {
            this.$emit('cancel')
        },
        resetForm() {
            this.form = {
                firstName: '',
                lastName: '',
                email: '',
                username: '',
                password: '',
                passwordConfirm: '',
                role: '',
                status: 'active',
                emailVerified: false,
                phone: '',
                department: '',
                notes: ''
            }
            this.errors = {}
        }
    },
    watch: {
        user: {
            handler(newUser: any) {
                if (newUser) {
                    // Edit mode - populate form with user data
                    this.form = {
                        firstName: newUser.firstName || '',
                        lastName: newUser.lastName || '',
                        email: newUser.email || '',
                        username: newUser.username || '',
                        password: '',
                        passwordConfirm: '',
                        role: newUser.role || '',
                        status: newUser.status || 'active',
                        emailVerified: newUser.emailVerified || false,
                        phone: newUser.phone || '',
                        department: newUser.department || '',
                        notes: newUser.notes || ''
                    }
                } else {
                    // Create mode - reset form
                    this.resetForm()
                }
            },
            immediate: true
        }
    }
} 