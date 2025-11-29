import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserListResponse, UserDetailResponse, UserUpdateRequest } from '../models/admin.models';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly API_URL = 'http://localhost:8080/api/admin';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        return this.authService.getAuthHeaders();
    }

    getAllUsers(): Observable<UserListResponse[]> {
        return this.http.get<UserListResponse[]>(`${this.API_URL}/users`, { headers: this.getHeaders() });
    }

    getUserById(id: number): Observable<UserDetailResponse> {
        return this.http.get<UserDetailResponse>(`${this.API_URL}/users/${id}`, { headers: this.getHeaders() });
    }

    updateUser(id: number, request: UserUpdateRequest): Observable<UserDetailResponse> {
        return this.http.put<UserDetailResponse>(`${this.API_URL}/users/${id}`, request, { headers: this.getHeaders() });
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/users/${id}`, { headers: this.getHeaders() });
    }

    searchUsers(query: string): Observable<UserListResponse[]> {
        const params = new HttpParams().set('q', query);
        return this.http.get<UserListResponse[]>(`${this.API_URL}/users/search`, { headers: this.getHeaders(), params });
    }

    // Association Management
    getPendingAssociations(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/associations/pending`, { headers: this.getHeaders() });
    }

    approveAssociation(id: number): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/associations/${id}/approve`, {}, { headers: this.getHeaders() });
    }

    rejectAssociation(id: number): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/associations/${id}/reject`, {}, { headers: this.getHeaders() });
    }
}
