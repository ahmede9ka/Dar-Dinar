import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { GoalService } from '../../services/goal.service';
import { MasroufService } from '../../services/masrouf.service';
import { RevenueService } from '../../services/revenue.service';

interface MasarifItem {
  id: number;
  value: number;
  date: string;
  type: string;
}

@Component({
  selector: 'app-masarif',
  standalone: true,
  imports: [CommonModule, FormsModule, SideBarComponent],
  templateUrl: './masarif.component.html',
  styleUrls: ['./masarif.component.scss'], // Corrected usage
})
export class MasarifComponent implements OnInit {
  masarif: MasarifItem[] = [];
  showModal: boolean = false;
  newMasarif: Partial<MasarifItem> = {};
  showSuccess: boolean = false;
  input: number | null = null;

  constructor(
    private goalService: GoalService,
    private masroufService: MasroufService,
    private revenueService: RevenueService
  ) {}

  ngOnInit(): void {
    this.loadMasarif();
  }

  // Fetch all Masarif records
  loadMasarif(): void {
    this.masroufService.getAllMasroufs().subscribe({
      next: (data: MasarifItem[]) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('User from localStorage:', user);

        // Directly assigning data to masarif since no filtering is applied
        this.masarif = data;
        console.log('Loaded masarif:', this.masarif);
      },
      error: (error) => {
        console.error('Error fetching Masarif records:', error);
      },
    });
  }

  // Open Modal
  openModal(): void {
    this.showModal = true;
    this.newMasarif = {};
  }

  // Close Modal
  closeModal(): void {
    this.showModal = false;
  }

  // Add New Record
  addMasarif(): void {
    if (this.newMasarif.value && this.newMasarif.date && this.newMasarif.type) {
      const masarifPayload: Omit<MasarifItem, 'id'> = {
        value: Number(this.newMasarif.value),
        date: this.newMasarif.date,
        type: this.newMasarif.type,
      };

      console.log('Payload:', masarifPayload);

      this.masroufService.createMasrouf(masarifPayload).subscribe({
        next: (data: MasarifItem) => {
          console.log('Masarif created successfully:', data);
          this.showModal = false;
          this.showSuccessMessage();
          this.loadMasarif(); // Reload after addition
        },
        error: (error) => {
          console.error('Error creating Masarif:', error);
        },
      });
    } else {
      console.warn('Missing required fields for creating Masarif.');
    }
  }

  // Delete Record
  deleteMasarif(id: number): void {
    this.masroufService.deleteMasrouf(id).subscribe({
      next: () => {
        console.log(`Masarif with id ${id} deleted successfully.`);
        this.masarif = this.masarif.filter((item) => item.id !== id);
      },
      error: (error) => {
        console.error(`Error deleting Masarif with id ${id}:`, error);
      },
    });
  }

  // Show Success Message
  showSuccessMessage(): void {
    this.showSuccess = true;
    setTimeout(() => (this.showSuccess = false), 3000);
  }
}
