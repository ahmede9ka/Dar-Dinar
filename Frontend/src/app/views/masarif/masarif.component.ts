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
  styleUrls: ['./masarif.component.scss'] // Fixed to styleUrls
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
    this.masroufService.getAllMasroufs().subscribe((data: any) => {
      console.log(data);
      const user = JSON.parse(localStorage.getItem('user') || '{}'); // Parse the stored user object
      console.log(user);
      
      // Filter goals for the current user and get only the first three
      this.masarif = data;
      
      console.log('Filtered masarif:', this.masarif);
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
  addMasarif() {
    if (this.newMasarif.value && this.newMasarif.date && this.newMasarif.type) {
      const masarifPayload = {
       
        "value": Number(this.newMasarif.value), 
        "date": this.newMasarif.date,
        "type": this.newMasarif.type,
      };
  
      console.log('Payload:', masarifPayload);
  
      this.masroufService.createMasrouf(masarifPayload).subscribe({
        next: (data: any) => {
          console.log('Masarif created successfully:', data);
          this.showModal = false;
          this.showSuccessMessage();
          this.loadMasarif();
        },
        error: (error) => {
          console.error('Error creating Masarif:', error);
        },
      });
    }
  }
  
  

  // Delete Record
  deleteMasarif(id: number): void {
    this.masroufService.deleteMasrouf(id).subscribe(
      () => {
        this.masarif = this.masarif.filter((item) => item.id !== id);
      },
      (error) => {
        console.error('Error deleting Masarif:', error);
      }
    );
  }

  // Show Success Message
  showSuccessMessage(): void {
    this.showSuccess = true;
    setTimeout(() => (this.showSuccess = false), 3000);
  }
}
