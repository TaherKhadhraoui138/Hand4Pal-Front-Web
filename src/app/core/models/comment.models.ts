import { Campaign } from './campaign.models';

export interface Comment {
    commentId: number;
    campaignId: number;
    citizenId: number;
    content: string;
    publicationDate: string;
    lastModifiedDate?: string | null;
    // Backend fields
    citizenName?: string | null;
    // Optional fields that might be added by frontend
    userName?: string;
    userEmail?: string;
}

export interface CommentRequestDTO {
    campaignId: number;
    citizenId: number;
    content: string;
}

// Extends the main Campaign model with full details (comments + donations)
// returned by the /campaigns/active/with-details endpoint.
export interface CampaignWithDetails extends Campaign {
    comments?: Comment[];   // already optional on Campaign, but kept for clarity
    donations?: any[];
}
