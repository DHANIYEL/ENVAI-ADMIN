import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class ConfirmationModalComponent {
  @Input() title: string = ''; // Modal title
  @Input() description?: string; // Optional description
  @Input() confirmButtonText: string = 'Confirm'; // Confirm button text
  @Input() cancelButtonText: string = 'Cancel'; // Cancel button text
  @Input() confirmButtonColor: string = 'bg-green-500'; // Confirm button color
  @Input() cancelButtonColor: string = 'bg-gray-500'; // Cancel button color

  @Output() confirm = new EventEmitter<void>(); // Emit confirm action
  @Output() cancel = new EventEmitter<void>(); // Emit cancel action

  // Emit confirm event
  confirmAction() {
    this.confirm.emit();
  }

  // Emit cancel event
  cancelAction() {
    this.cancel.emit();
  }
}
