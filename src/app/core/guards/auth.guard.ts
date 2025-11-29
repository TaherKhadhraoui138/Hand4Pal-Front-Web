import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

/**
 * Guard pour protéger les routes nécessitant une authentification
 * Peut aussi vérifier le rôle de l'utilisateur si spécifié dans route.data['role']
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser.pipe(
        map(user => {
            // Vérifier si l'utilisateur est connecté
            if (!user) {
                // Sauvegarder l'URL pour rediriger après login
                router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return false;
            }

            // Vérifier le rôle si nécessaire
            const requiredRole = route.data['role'];
            if (requiredRole && user.userType !== requiredRole) {
                // L'utilisateur n'a pas le bon rôle, rediriger vers la page d'accueil
                router.navigate(['/']);
                return false;
            }

            return true;
        })
    );
};
