import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthViewModel } from '../../core/viewmodels/auth.viewmodel';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isAuthenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  isAssociation$: Observable<boolean>;

  constructor(public authViewModel: AuthViewModel) {
    this.isAuthenticated$ = this.authViewModel.currentUser$.pipe(
      map(user => !!user)
    );

    this.isAdmin$ = this.authViewModel.currentUser$.pipe(
      map(user => user?.userType === 'ADMINISTRATOR')
    );

    this.isAssociation$ = this.authViewModel.currentUser$.pipe(
      map(user => user?.userType === 'ASSOCIATION')
    );
  }

  logout(): void {
    this.authViewModel.logout();
  }
}
