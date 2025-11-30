// Modèles pour le service de donations

import { Campaign } from './campaign.models';

/**
 * Interface pour la requête de création d'un don
 */
export interface DonationRequest {
    amount: number;
    currency: string;
    campaignId: number;
}

/**
 * Interface pour la réponse d'un don
 */
export interface Donation {
    id: number;
    amount: number;
    currency: string;
    userId: number;
    campaignId: number;
    donationDate: string;
    campaign?: Campaign;
    // User/Donor info (if backend provides it)
    user?: {
        id: number;
        firstName?: string;
        lastName?: string;
        email?: string;
    };
    donorName?: string; // Alternative: direct donor name field
}

/**
 * Helper to get donor display name
 */
export function getDonorName(donation: Donation): string {
    if (donation.donorName) {
        return donation.donorName;
    }
    if (donation.user) {
        const firstName = donation.user.firstName || '';
        const lastName = donation.user.lastName || '';
        if (firstName || lastName) {
            return `${firstName} ${lastName}`.trim();
        }
        return donation.user.email || `User #${donation.user.id}`;
    }
    return `Donor #${donation.userId}`;
}

/**
 * Interface pour les statistiques de donation d'une campagne
 */
export interface CampaignDonationStats {
    campaignId: number;
    totalDonations: number;
    totalAmount: number;
    currency: string;
}
