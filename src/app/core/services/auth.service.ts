import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
    RegisterCitizenRequest,
    RegisterAssociationRequest,
    LoginRequest,
    GoogleAuthRequest,
    AuthResponse,
    User
} from '../models/auth.models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // L'URL de votre Gateway API (port 8080)
    private readonly API_URL = 'http://localhost:8080/api/auth';

    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    private tokenSubject: BehaviorSubject<string | null>;
    public token: Observable<string | null>;

    constructor(private http: HttpClient) {
        // Initialiser avec les données du localStorage si elles existent
        const storedUser = localStorage.getItem('currentUser');
        const storedToken = localStorage.getItem('authToken');

        // Nettoyer les valeurs corrompues
        let parsedUser: User | null = null;
        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
            try {
                parsedUser = JSON.parse(storedUser);
            } catch (e) {
                // Si le parse échoue, nettoyer le localStorage
                localStorage.removeItem('currentUser');
            }
        }

        this.currentUserSubject = new BehaviorSubject<User | null>(parsedUser);
        this.tokenSubject = new BehaviorSubject<string | null>(
            storedToken && storedToken !== 'undefined' && storedToken !== 'null' ? storedToken : null
        );

        this.currentUser = this.currentUserSubject.asObservable();
        this.token = this.tokenSubject.asObservable();
    }

    // ============================================
    // Getters
    // ============================================

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    public get tokenValue(): string | null {
        return this.tokenSubject.value;
    }

    // ============================================
    // Authentication Methods
    // ============================================

    /**
     * Enregistrer un citoyen
     */
    registerCitizen(request: RegisterCitizenRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/register/citizen`, request)
            .pipe(
                tap(response => this.handleAuthResponse(response))
            );
    }

    /**
     * Enregistrer une association
     */
    registerAssociation(request: RegisterAssociationRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/register/association`, request)
            .pipe(
                tap(response => this.handleAuthResponse(response))
            );
    }

    /**
     * Se connecter
     */
    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, request)
            .pipe(
                tap(response => this.handleAuthResponse(response))
            );
    }

    /**
     * Authentification Google
     */
    googleAuth(request: GoogleAuthRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/google`, request)
            .pipe(
                tap(response => this.handleAuthResponse(response))
            );
    }

    /**
     * Se déconnecter
     */
    logout(): void {
        // Supprimer les données du localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');

        // Mettre à jour les subjects
        this.currentUserSubject.next(null);
        this.tokenSubject.next(null);
    }

    /**
     * Vérifier si l'utilisateur est authentifié
     */
    isAuthenticated(): boolean {
        return !!this.tokenValue;
    }

    /**
     * Obtenir le token pour les requêtes HTTP
     */
    getAuthHeaders(): HttpHeaders {
        const token = this.tokenValue;
        if (token) {
            return new HttpHeaders({
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            });
        }
        return new HttpHeaders({
            'Content-Type': 'application/json'
        });
    }

    /**
     * Rafraîchir le token d'accès avec le refresh token
     */
    refreshAccessToken(): Observable<AuthResponse> {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            return throwError(() => new Error('No refresh token available'));
        }

        return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, { refreshToken })
            .pipe(
                tap(response => {
                    // Mettre à jour seulement le token, pas le user
                    localStorage.setItem('authToken', response.token);
                    if (response.refreshToken) {
                        localStorage.setItem('refreshToken', response.refreshToken);
                    }
                    this.tokenSubject.next(response.token);
                })
            );
    }


    // ============================================
    // Private Helper Methods
    // ============================================

    /**
     * Gérer la réponse d'authentification
     */
    private handleAuthResponse(response: AuthResponse): void {
        // Créer un objet User à partir de la réponse
        const user: User = {
            id: response.userId,
            email: response.email,
            userType: response.role,
            // Les autres champs seront remplis plus tard si nécessaire
            firstName: '',
            lastName: '',
            phone: ''
        };

        // Sauvegarder dans le localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', response.token);
        if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
        }

        // Mettre à jour les subjects
        this.currentUserSubject.next(user);
        this.tokenSubject.next(response.token);
    }
}
