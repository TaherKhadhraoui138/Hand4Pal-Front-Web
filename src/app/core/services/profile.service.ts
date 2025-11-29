import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileUpdateRequest, ChangePasswordRequest, ProfileResponse } from '../models/profile.models';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private readonly API_URL = 'http://localhost:8080/api/profile';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        return this.authService.getAuthHeaders();
    }

    getProfile(): Observable<ProfileResponse> {
        return this.http.get<ProfileResponse>(`${this.API_URL}/me`, { headers: this.getHeaders() });
    }

    updateProfile(request: ProfileUpdateRequest): Observable<ProfileResponse> {
        return this.http.put<ProfileResponse>(`${this.API_URL}/me`, request, { headers: this.getHeaders() });
    }

    changePassword(request: ChangePasswordRequest): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/change-password`, request, { headers: this.getHeaders() });
    }

    deleteAccount(): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/me`, { headers: this.getHeaders() });
    }
}
