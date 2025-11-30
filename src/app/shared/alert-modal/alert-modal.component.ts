import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
    selector: 'app-alert-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './alert-modal.component.html',
    styleUrls: ['./alert-modal.component.css']
})
export class AlertModalComponent {
    @Input() isOpen = false;
    @Input() title = '';
    @Input() message = '';
    @Input() type: AlertType = 'info';
    @Input() confirmText = 'OK';
    @Input() showCancel = false;
    @Input() cancelText = 'Cancel';
    
    @Output() closed = new EventEmitter<void>();
    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    get icon(): string {
        switch (this.type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return 'ℹ️';
        }
    }

    onConfirm(): void {
        this.confirmed.emit();
        this.closed.emit();
    }

    onCancel(): void {
        this.cancelled.emit();
        this.closed.emit();
    }

    onOverlayClick(): void {
        this.closed.emit();
    }
}
