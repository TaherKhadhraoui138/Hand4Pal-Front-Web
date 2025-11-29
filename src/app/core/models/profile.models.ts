export interface ProfileUpdateRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    bio?: string; // For associations
    website?: string; // For associations
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ProfileResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CITIZEN' | 'ASSOCIATION' | 'ADMINISTRATOR';
    phone?: string;
    address?: string;
    bio?: string;
    website?: string;
    createdAt: string;
    updatedAt: string;
}
