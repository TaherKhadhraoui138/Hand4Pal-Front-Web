import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DonationModalComponent } from '../../shared/donation-modal/donation-modal.component';
import { CommentComponent } from '../../shared/comment/comment.component';

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  imports: [RouterLink, CommonModule, DonationModalComponent, CommentComponent],
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent {
  isDonationModalOpen = false;

  openDonationModal() {
    this.isDonationModalOpen = true;
  }

  closeDonationModal() {
    this.isDonationModalOpen = false;
  }
}
