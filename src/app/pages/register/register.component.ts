import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthViewModel } from '../../core/viewmodels/auth.viewmodel';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  userType: 'citizen' | 'association' = 'citizen';
  registerForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    public authViewModel: AuthViewModel
  ) { }

  ngOnInit(): void {
    // Initialiser le formulaire
    this.initializeForm();

    // S'abonner aux observables du ViewModel
    this.authViewModel.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);

    this.authViewModel.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => this.error = error);

    this.authViewModel.success$
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => this.success = success);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialiser le formulaire selon le type d'utilisateur
   */
  initializeForm(): void {
    if (this.userType === 'citizen') {
      this.registerForm = this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      }, { validators: this.passwordMatchValidator });
    } else {
      this.registerForm = this.fb.group({
        associationName: ['', [Validators.required]],
        ownerFirstName: ['', [Validators.required]],
        ownerLastName: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        description: ['', [Validators.required]],
        address: ['', [Validators.required]],
        webSite: ['']
      }, { validators: this.passwordMatchValidator });
    }
  }

  /**
   * Changer le type d'utilisateur
   */
  selectUserType(type: 'citizen' | 'association'): void {
    this.userType = type;
    this.initializeForm();
  }

  /**
   * Validateur personnalisé pour vérifier que les mots de passe correspondent
   */
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Soumettre le formulaire d'inscription
   */
  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      // Retirer confirmPassword avant d'envoyer
      const { confirmPassword, ...registerData } = formData;

      if (this.userType === 'citizen') {
        await this.authViewModel.registerCitizen(registerData);
      } else {
        await this.authViewModel.registerAssociation(registerData);
      }
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  /**
   * Vérifier si un champ est invalide et a été touché
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtenir le message d'erreur pour un champ
   */
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (field?.hasError('email')) {
      return 'Email invalide';
    }
    if (field?.hasError('minlength')) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (fieldName === 'confirmPassword' && this.registerForm.hasError('passwordMismatch')) {
      return 'Les mots de passe ne correspondent pas';
    }
    return '';
  }

  /**
   * Fermer les messages
   */
  closeMessage(): void {
    this.authViewModel.clearMessages();
  }
}
