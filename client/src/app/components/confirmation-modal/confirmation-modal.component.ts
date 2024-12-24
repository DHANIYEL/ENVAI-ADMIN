// confirmation-modal.component.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css'],
  standalone: true
})
export class ConfirmationModalComponent {
  @Output() confirm = new EventEmitter<void>(); // Emit confirmation event
  @Output() cancel = new EventEmitter<void>(); // Emit cancel event

  // Close the modal and confirm the action
  confirmLogout() {
    this.confirm.emit(); // Emit event when confirmed
  }

  // Close the modal without any action
  cancelLogout() {
    this.cancel.emit(); // Emit event when canceled
  }
}
