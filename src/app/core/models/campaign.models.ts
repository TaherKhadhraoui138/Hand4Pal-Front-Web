/**
 * Campaign model interfaces
 */

export interface Campaign {
    id: number;
    title: string;
    description: string;
    category: CampaignCategory;
    goalAmount: number;
    raisedAmount: number;
    imageUrl?: string;
    organizerName: string;
    organizerAvatar?: string;
    createdAt?: Date;
    endDate?: Date;
    status: CampaignStatus;
}

export type CampaignCategory = 
    | 'MEDICAL_AID' 
    | 'FOOD_WATER' 
    | 'EDUCATION' 
    | 'RECONSTRUCTION' 
    | 'EMERGENCY' 
    | 'OTHER';

export type CampaignStatus = 
    | 'ACTIVE' 
    | 'COMPLETED' 
    | 'PENDING' 
    | 'CANCELLED';

export interface CampaignCreateRequest {
    title: string;
    description: string;
    category: CampaignCategory;
    goalAmount: number;
    imageUrl?: string;
    endDate?: Date;
}

export interface CampaignUpdateRequest {
    title?: string;
    description?: string;
    category?: CampaignCategory;
    goalAmount?: number;
    imageUrl?: string;
    endDate?: Date;
}

/**
 * Helper function to get display name for category
 */
export function getCategoryDisplayName(category: CampaignCategory): string {
    const categoryNames: Record<CampaignCategory, string> = {
        'MEDICAL_AID': 'Medical Aid',
        'FOOD_WATER': 'Food & Water',
        'EDUCATION': 'Education',
        'RECONSTRUCTION': 'Reconstruction',
        'EMERGENCY': 'Emergency',
        'OTHER': 'Other'
    };
    return categoryNames[category] || category;
}

/**
 * Helper function to get emoji for category
 */
export function getCategoryEmoji(category: CampaignCategory): string {
    const categoryEmojis: Record<CampaignCategory, string> = {
        'MEDICAL_AID': '🏥',
        'FOOD_WATER': '🍞',
        'EDUCATION': '📚',
        'RECONSTRUCTION': '🏗️',
        'EMERGENCY': '🚨',
        'OTHER': '💝'
    };
    return categoryEmojis[category] || '💝';
}
