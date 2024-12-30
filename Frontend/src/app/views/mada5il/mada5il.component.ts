import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { GoalService } from '../../services/goal.service';
import { RevenueService } from '../../services/revenue.service';




interface Mada5ilItem {
  id: number;
  value: number;
  date: string;
  type: string;
}

@Component({
  selector: 'app-Mada5il',
  standalone: true,
  imports: [CommonModule, FormsModule, SideBarComponent],
  templateUrl: './Mada5il.component.html',
  styleUrls: ['./Mada5il.component.scss'] // Fixed to styleUrls
})
export class Mada5ilComponent implements OnInit {
  Mada5il: Mada5ilItem[] = [];
  showModal: boolean = false;
  newMada5il: Partial<Mada5ilItem> = {};
  showSuccess: boolean = false;
  input: number | null = null;

  constructor(
    private goalService: GoalService,
    private RevenueService: RevenueService,
    private revenueService: RevenueService
  ) {}

  ngOnInit(): void {
    this.loadMada5il();
  }

  // Fetch all Mada5il records
  loadMada5il(): void {
    this.RevenueService.getAllRevenues().subscribe((data: any) => {
      console.log(data);
      const user = JSON.parse(localStorage.getItem('user') || '{}'); // Parse the stored user object
      console.log(user);
      
      // Filter goals for the current user and get only the first three
      this.Mada5il = data.filter((masarif: any) => masarif.user.id === user.id);
      console.log(data);
      console.log('Filtered Mada5il:', this.Mada5il);
    });
    
  }

  // Open Modal
  openModal(): void {
    this.showModal = true;
    this.newMada5il = {};
  }

  // Close Modal
  closeModal(): void {
    this.showModal = false;
  }

  // Add New Record
  addMada5il() {
    if (this.newMada5il.value && this.newMada5il.date && this.newMada5il.type) {
      const Mada5ilPayload = {
       
        "value": Number(this.newMada5il.value), 
        "date": this.newMada5il.date,
        "type": this.newMada5il.type,
      };
  
      console.log('Payload:', Mada5ilPayload);
  
      this.RevenueService.createRevenue(Mada5ilPayload).subscribe({
        next: (data: any) => {
          console.log('Mada5il created successfully:', data);
          this.showModal = false;
          this.showSuccessMessage();
          this.loadMada5il();
        },
        error: (error) => {
          console.error('Error creating Mada5il:', error);
        },
      });
    }
  }
  
  

  // Delete Record
  deleteMada5il(id: number): void {
    this.RevenueService.deleteRevenue(id).subscribe(
      () => {
        this.Mada5il = this.Mada5il.filter((item) => item.id !== id);
      },
      (error) => {
        console.error('Error deleting Mada5il:', error);
      }
    );
  }

  // Show Success Message
  showSuccessMessage(): void {
    this.showSuccess = true;
    setTimeout(() => (this.showSuccess = false), 3000);
  }
}
