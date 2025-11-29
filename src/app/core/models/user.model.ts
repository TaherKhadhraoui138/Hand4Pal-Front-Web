export interface User {
    id: string;
    email: string;
    userType: 'CITIZEN' | 'ASSOCIATION';
    firstName?: string;
    lastName?: string;
    phone?: string;
    description?: string;
    address?: string;
    website?: string;
    createdAt?: Date;
}
