import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.css'],
  standalone: true
})
export class SuccessModalComponent {
  @Input() title: string = ''; // Modal title
  @Input() description: string = ''; // Modal description
  @Input() successButtonText: string = 'Success - Close'; // Button text

  @Output() close = new EventEmitter<void>(); // Event emitter for closing the modal

  onClose(): void {
    this.close.emit(); // Emit the event to close the modal
  }
}
