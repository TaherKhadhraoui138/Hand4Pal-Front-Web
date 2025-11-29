import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import {
    RegisterCitizenRequest,
    RegisterAssociationRequest,
    LoginRequest,
    GoogleAuthRequest,
    User
} from '../models/auth.models';

@Injectable({
    providedIn: 'root'
})
export class AuthViewModel {
    // Loading state
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    // Error state
    private errorSubject = new BehaviorSubject<string | null>(null);
    public error$ = this.errorSubject.asObservable();

    // Success message state
    private successSubject = new BehaviorSubject<string | null>(null);
    public success$ = this.successSubject.asObservable();

    // Current user
    public currentUser$: Observable<User | null>;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        this.currentUser$ = this.authService.currentUser;
    }

    // ============================================
    // Authentication Methods
    // ============================================

    /**
     * Enregistrer un citoyen
     */
    async registerCitizen(data: RegisterCitizenRequest): Promise<boolean> {
        this.setLoading(true);
        this.clearMessages();

        try {
            console.log('Tentative d\'inscription citoyen avec:', data);
            await this.authService.registerCitizen(data).toPromise();
            console.log('Inscription réussie');
            this.setSuccess('Votre compte a été créé avec succès !');
            this.setLoading(false);

            // Rediriger vers le tableau de bord ou la page d'accueil
            setTimeout(() => {
                this.router.navigate(['/']);
            }, 1500);

            return true;
        } catch (error: any) {
            console.error('Erreur lors de l\'inscription:', error);
            this.handleError(error);
            this.setLoading(false);
            return false;
        }
    }

    /**
     * Enregistrer une association
     */
    async registerAssociation(data: RegisterAssociationRequest): Promise<boolean> {
        this.setLoading(true);
        this.clearMessages();

        try {
            await this.authService.registerAssociation(data).toPromise();
            this.setSuccess('Votre compte a été créé avec succès !');
            this.setLoading(false);

            // Rediriger vers le tableau de bord association
            setTimeout(() => {
                this.router.navigate(['/association-dashboard']);
            }, 1500);

            return true;
        } catch (error: any) {
            this.handleError(error);
            this.setLoading(false);
            return false;
        }
    }

    /**
     * Se connecter
     */
    async login(data: LoginRequest): Promise<boolean> {
        this.setLoading(true);
        this.clearMessages();

        try {
            console.log('Tentative de connexion avec:', { email: data.email });
            const response = await this.authService.login(data).toPromise();
            console.log('Connexion réussie:', response);
            this.setSuccess('Connexion réussie !');
            this.setLoading(false);

            // Rediriger selon le rôle d'utilisateur
            setTimeout(() => {
                if (response?.role === 'ADMINISTRATOR') {
                    this.router.navigate(['/admin']);
                } else if (response?.role === 'ASSOCIATION') {
                    this.router.navigate(['/association-dashboard']);
                } else {
                    this.router.navigate(['/']);
                }
            }, 1000);

            return true;
        } catch (error: any) {
            console.error('Erreur lors de la connexion:', error);
            this.handleError(error);
            this.setLoading(false);
            return false;
        }
    }

    /**
     * Authentification Google
     */
    async googleAuth(token: string): Promise<boolean> {
        this.setLoading(true);
        this.clearMessages();

        try {
            const request: GoogleAuthRequest = { token };
            const response = await this.authService.googleAuth(request).toPromise();
            this.setSuccess('Connexion Google réussie !');
            this.setLoading(false);

            // Rediriger selon le rôle d'utilisateur
            setTimeout(() => {
                if (response?.role === 'ADMINISTRATOR') {
                    this.router.navigate(['/admin']);
                } else if (response?.role === 'ASSOCIATION') {
                    this.router.navigate(['/association-dashboard']);
                } else {
                    this.router.navigate(['/']);
                }
            }, 1000);

            return true;
        } catch (error: any) {
            this.handleError(error);
            this.setLoading(false);
            return false;
        }
    }

    /**
     * Se déconnecter
     */
    logout(): void {
        this.authService.logout();
        this.setSuccess('Vous avez été déconnecté.');
        this.router.navigate(['/login']);
    }

    // ============================================
    // Utility Methods
    // ============================================

    /**
     * Vérifier si l'utilisateur est authentifié
     */
    isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }

    /**
     * Obtenir l'utilisateur actuel
     */
    getCurrentUser(): User | null {
        return this.authService.currentUserValue;
    }

    /**
     * Définir l'état de chargement
     */
    private setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

    /**
     * Définir un message de succès
     */
    private setSuccess(message: string): void {
        this.successSubject.next(message);
        // Auto-clear après 5 secondes
        setTimeout(() => this.clearSuccess(), 5000);
    }

    /**
     * Définir un message d'erreur
     */
    private setError(message: string): void {
        this.errorSubject.next(message);
        // Auto-clear après 5 secondes
        setTimeout(() => this.clearError(), 5000);
    }

    /**
     * Effacer les messages
     */
    clearMessages(): void {
        this.errorSubject.next(null);
        this.successSubject.next(null);
    }

    /**
     * Effacer le message d'erreur
     */
    clearError(): void {
        this.errorSubject.next(null);
    }

    /**
     * Effacer le message de succès
     */
    clearSuccess(): void {
        this.successSubject.next(null);
    }

    /**
     * Gérer les erreurs de l'API
     */
    private handleError(error: any): void {
        console.error('Détails complets de l\'erreur:', error);
        let errorMessage = 'Une erreur s\'est produite. Veuillez réessayer.';

        if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        } else if (error.status === 0) {
            errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré et l\'URL est correcte.';
            console.error('Erreur de connexion - vérifiez l\'URL de l\'API:', error);
        } else if (error.status === 401) {
            errorMessage = 'Email ou mot de passe incorrect.';
        } else if (error.status === 409) {
            errorMessage = 'Cet email est déjà utilisé.';
        } else if (error.status === 500) {
            errorMessage = 'Erreur du serveur. Veuillez réessayer plus tard.';
        } else if (error.status === 404) {
            errorMessage = 'Endpoint introuvable. Vérifiez l\'URL de l\'API.';
        }

        this.setError(errorMessage);
    }
}
