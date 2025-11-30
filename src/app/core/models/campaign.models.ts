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
    imageUrl?: string;         // Frontend naming convention
    imageURL?: string;         // Backend Java naming convention (column name)
    associationId?: number;    // Backend links to association
    associationName?: string;  // Direct field if backend provides it
    association?: {            // Nested association object from backend
        id: number;
        associationName?: string;
        name?: string;
        email?: string;
    };
    createdAt?: string;
    endDate?: string;
    status: CampaignStatus;
}

/**
 * Helper to get campaign image URL (handles both naming conventions)
 */
export function getCampaignImageUrl(campaign: Campaign): string | null {
    return campaign.imageUrl || campaign.imageURL || null;
}

/**
 * Helper to get association name from campaign
 * Note: Backend currently only returns associationId, not the name.
 * Ideally the backend should be updated to include associationName in the response.
 */
export function getAssociationName(campaign: Campaign): string {
    // Try different possible field names from backend
    if (campaign.associationName) {
        return campaign.associationName;
    }
    if (campaign.association?.associationName) {
        return campaign.association.associationName;
    }
    if (campaign.association?.name) {
        return campaign.association.name;
    }
    // Fallback: show association ID if available
    if (campaign.associationId) {
        return `Association #${campaign.associationId}`;
    }
    return 'Unknown';
}

export type CampaignCategory = 
    | 'HEALTH' 
    | 'EDUCATION' 
    | 'ENVIRONMENT' 
    | 'ANIMAL_WELFARE' 
    | 'SOCIAL'
    | 'EMERGENCY' 
    | 'OTHER';

export type CampaignStatus = 
    | 'ACTIVE' 
    | 'APPROVED'
    | 'COMPLETED' 
    | 'PENDING' 
    | 'REJECTED';

export interface CampaignCreateRequest {
    title: string;
    description: string;
    category: CampaignCategory;
    targetAmount: number;
    endDate: string;  // Required - format: YYYY-MM-DD or ISO datetime
    imageUrl?: string;
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
        'HEALTH': 'Health',
        'EDUCATION': 'Education',
        'ENVIRONMENT': 'Environment',
        'ANIMAL_WELFARE': 'Animal Welfare',
        'SOCIAL': 'Social',
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
        'HEALTH': '🏥',
        'EDUCATION': '📚',
        'ENVIRONMENT': '🌍',
        'ANIMAL_WELFARE': '🐾',
        'SOCIAL': '🤝',
        'EMERGENCY': '🚨',
        'OTHER': '💝'
    };
    return categoryEmojis[category] || '💝';
}
