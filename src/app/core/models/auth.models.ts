// ============================================
// Authentication Request Models
// ============================================

export interface RegisterCitizenRequest {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
}

export interface RegisterAssociationRequest {
    description: string;
    address: string;
    website?: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface GoogleAuthRequest {
    token: string;
}

// ============================================
// Authentication Response Models
// ============================================

// Réponse d'authentification du backend
export interface AuthResponse {
    token: string;
    userId: number;
    email: string;
    role: string; // CITIZEN, ASSOCIATION, ADMINISTRATOR, etc.
    refreshToken?: string;
}

export interface User {
    id: number;
    email: string;
    userType: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    description?: string;
    address?: string;
    website?: string;
    createdAt?: Date;
}

// ============================================
// Error Response Model
// ============================================

export interface ErrorResponse {
    message: string;
    statusCode: number;
    error?: string;
}
