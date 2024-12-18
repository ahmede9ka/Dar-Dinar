import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SideBarComponent } from "../side-bar/side-bar.component";

interface MasarifItem {
  id: number;
  quantity: number;
  date: string;
  type: string;
}  
@Component({
  selector: 'app-masarif',
  standalone: true,
  imports: [CommonModule, FormsModule, SideBarComponent],
  templateUrl: './masarif.component.html',
  styleUrl: './masarif.component.scss'
})
export class MasarifComponent {
  masarif: MasarifItem[] = [];
  showModal: boolean = false;
  newMasarif: Partial<MasarifItem> = {};
  showSuccess: boolean = false;

  // Open Modal
  openModal() {
    this.showModal = true;
    this.newMasarif = {};
  }

  // Close Modal
  closeModal() {
    this.showModal = false;
  }

  // Add New Record
  addMasarif() {
    if (this.newMasarif.quantity && this.newMasarif.date && this.newMasarif.type) {
      this.masarif.push({
        id: Date.now(),
        quantity: Number(this.newMasarif.quantity),
        date: this.newMasarif.date,
        type: this.newMasarif.type,
      });
      this.showModal = false;
      this.showSuccessMessage();
    }
  }

  // Delete Record
  deleteMasarif(id: number) {
    this.masarif = this.masarif.filter((item) => item.id !== id);
  }

  // Show Success Message
  showSuccessMessage() {
    this.showSuccess = true;
    setTimeout(() => (this.showSuccess = false), 3000);
  }
}
