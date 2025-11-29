import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Intercepteur HTTP pour ajouter automatiquement le token JWT aux requêtes
 * et gérer le refresh du token en cas d'expiration
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.tokenValue;

    // Ne pas ajouter le token pour les endpoints d'authentification
    if (req.url.includes('/auth/')) {
        return next(req);
    }

    // Cloner la requête et ajouter le token si disponible
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Si erreur 401 (Non autorisé), tenter de refresh le token
            if (error.status === 401 && !req.url.includes('/auth/refresh')) {
                return authService.refreshAccessToken().pipe(
                    switchMap((response) => {
                        // Retry la requête avec le nouveau token
                        const newReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${response.token}`
                            }
                        });
                        return next(newReq);
                    }),
                    catchError((refreshError) => {
                        // Si le refresh échoue, déconnecter l'utilisateur et rediriger
                        authService.logout();
                        router.navigate(['/login']);
                        return throwError(() => refreshError);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};
