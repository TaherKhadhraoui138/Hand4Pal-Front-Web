/**
 * Campaign model interfaces - Matching backend Campaign entity
 */

export interface Campaign {
    id: number;
    title: string;
    description: string;
    category: CampaignCategory;
    targetAmount: number;      // Backend uses targetAmount
    collectedAmount: number;   // Backend uses collectedAmount
    imageUrl?: string;
    associationId: number;     // Backend links to association
    associationName?: string;  // Populated from backend
    createdAt?: string;
    endDate?: string;
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
    | 'REJECTED';

export interface CampaignCreateRequest {
    title: string;
    description: string;
    category: CampaignCategory;
    targetAmount: number;
    imageUrl?: string;
    endDate?: string;
}

export interface CampaignUpdateRequest {
    title?: string;
    description?: string;
    category?: CampaignCategory;
    targetAmount?: number;
    collectedAmount?: number;
    imageUrl?: string;
    endDate?: string;
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
