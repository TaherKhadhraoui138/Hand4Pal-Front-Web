export interface UserListResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CITIZEN' | 'ASSOCIATION' | 'ADMINISTRATOR';
    isActive: boolean;
    createdAt: string;
}

export interface UserDetailResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CITIZEN' | 'ASSOCIATION' | 'ADMINISTRATOR';
    phone?: string;
    address?: string;
    bio?: string;
    website?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserUpdateRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: 'CITIZEN' | 'ASSOCIATION' | 'ADMINISTRATOR';
    isActive?: boolean;
}
