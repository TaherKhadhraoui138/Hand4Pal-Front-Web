import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-association-dashboard',
  imports: [CommonModule],
  templateUrl: './association-dashboard.component.html',
  styleUrl: './association-dashboard.component.css',
})
export class AssociationDashboard {
  protected activeTab = signal('overview');
}
