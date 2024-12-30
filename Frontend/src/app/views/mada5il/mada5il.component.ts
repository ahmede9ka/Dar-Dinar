import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SideBarComponent } from '../side-bar/side-bar.component';

interface Mada5ilItem {
  id: number;
  quantity: number;
  date: string;
  type: string;
}  
@Component({
  selector: 'app-mada5il',
  standalone: true,
  imports: [CommonModule,FormsModule,SideBarComponent],
  templateUrl: './mada5il.component.html',
  styleUrl: './mada5il.component.scss'
})
export class Mada5ilComponent {
  Mada5il: Mada5ilItem[] = [];
  showModal: boolean = false;
  newMada5il: Partial<Mada5ilItem> = {};
  showSuccess: boolean = false;

  // Open Modal
  openModal() {
    this.showModal = true;
    this.newMada5il = {};
  }

  // Close Modal
  closeModal() {
    this.showModal = false;
  }

  // Add New Record
  addMada5il() {
    if (this.newMada5il.quantity && this.newMada5il.date && this.newMada5il.type) {
      this.Mada5il.push({
        id: Date.now(),
        quantity: Number(this.newMada5il.quantity),
        date: this.newMada5il.date,
        type: this.newMada5il.type,
      });
      this.showModal = false;
      this.showSuccessMessage();
    }
  }

  // Delete Record
  deleteMada5il(id: number) {
    this.Mada5il = this.Mada5il.filter((item) => item.id !== id);
  }

  // Show Success Message
  showSuccessMessage() {
    this.showSuccess = true;
    setTimeout(() => (this.showSuccess = false), 3000);
  }
}
