import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserListResponse, UserDetailResponse, UserUpdateRequest } from '../models/admin.models';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly API_URL = 'http://localhost:8080/api/admin';

    constructor(private http: HttpClient) { }

    // Note: L'intercepteur authInterceptor ajoute automatiquement le token JWT

    getAllUsers(): Observable<UserListResponse[]> {
        return this.http.get<UserListResponse[]>(`${this.API_URL}/users`);
    }

    getUserById(id: number): Observable<UserDetailResponse> {
        return this.http.get<UserDetailResponse>(`${this.API_URL}/users/${id}`);
    }

    updateUser(id: number, request: UserUpdateRequest): Observable<UserDetailResponse> {
        return this.http.put<UserDetailResponse>(`${this.API_URL}/users/${id}`, request);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/users/${id}`);
    }

    searchUsers(query: string): Observable<UserListResponse[]> {
        const params = new HttpParams().set('q', query);
        return this.http.get<UserListResponse[]>(`${this.API_URL}/users/search`, { params });
    }

    // Association Management
    getPendingAssociations(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/associations/pending`);
    }

    approveAssociation(id: number, message: string = 'Bienvenue ! Votre compte a été activé.'): Observable<void> {
        const params = new HttpParams().set('message', message);
        return this.http.post<void>(`${this.API_URL}/associations/${id}/approve`, {}, { params });
    }

    rejectAssociation(id: number, message: string = 'Votre demande a été refusée.'): Observable<void> {
        const params = new HttpParams().set('message', message);
        return this.http.post<void>(`${this.API_URL}/associations/${id}/reject`, {}, { params });
    }
}
