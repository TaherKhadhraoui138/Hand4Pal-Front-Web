import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // ============================================
  // Profile Management
  // ============================================

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/profile`);
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/profile`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/profile/change-password`, data);
  }

  setPassword(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/profile/set-password`, data);
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.API_URL}/profile`);
  }

  // ============================================
  // Admin User Management
  // ============================================

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/admin/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/admin/users/${id}`);
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/admin/users/${id}`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/admin/users/${id}`);
  }

  searchUsers(query: string): Observable<User[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<User[]>(`${this.API_URL}/admin/users/search`, { params });
  }
}
