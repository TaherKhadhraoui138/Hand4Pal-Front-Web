import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-comment',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent {
    @Input() author: string = 'Anonymous';
    @Input() content: string = '';
    @Input() timeAgo: string = '';
    @Input() donationAmount?: number;
}
