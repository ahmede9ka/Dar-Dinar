import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { GoalService } from '../../services/goal.service';
import { MasroufService } from '../../services/masrouf.service';
import { RevenueService } from '../../services/revenue.service';

interface MasarifItem {
  id: number;
  quantity: number;
  date: string;
  type: string;
}  
@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule,FormsModule,SideBarComponent],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss'
})
export class GoalsComponent implements OnInit{
  masarif: any;
  showModal: boolean = false;
  newMasarif: any;
  showSuccess: boolean = false;
  goals:any;
  showModalzid: boolean = false;
  zyeda:any;
  id:any;
  input:any;
  output:any;
  constructor(private goalservice:GoalService,private masroufservice:MasroufService,private revenueservice:RevenueService){}
  
  ngOnInit(): void {
    this.loadgoals();
    this.masroufservice.getAllMasrouf().subscribe((data:any)=>{
      console.log(data);
      this.input = data[0].total_value;
    })
    this.revenueservice.getAllRevenue().subscribe((data:any)=>{
      console.log(data);
      this.output = data[0].total_value;
    })
    
  }
  loadgoals(){
    this.goalservice.getAllgoals().subscribe((data: any) => {
      console.log(data);
      const user = JSON.parse(localStorage.getItem('user') || '{}'); // Parse the stored user object
      console.log(user);
      
      // Filter goals for the current user and get only the first three
      this.goals = data.filter((goal: any) => goal.user.id === user.id);
      
      console.log('Filtered goals:', this.goals);
    });
  }
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
  addGoal() {
    if (this.newMasarif.goal && this.newMasarif.desiredsum) {
      this.masarif = {
        "goal":this.newMasarif.goal,
        "desiredSum":this.newMasarif.desiredsum,
      }
      this.goalservice.createGoal(this.masarif).subscribe((data:any)=>{
        console.log(data);
      })
      this.showModal = false;
      this.showSuccessMessage();
      this.loadgoals();
    }
  }

  // Delete Record
  /*
  deleteMasarif(id: number) {
    this.masarif = this.masarif.filter((item) => item.id !== id);
  }
  */
  // Show Success Message
  showSuccessMessage() {
    this.showSuccess = true;
    setTimeout(() => (this.showSuccess = false), 3000);
  }
  zid() {
    try {
      const form = {
        zyeda: this.zyeda
      };
  
      this.goalservice.zidFlousLelgoal(this.id, form).subscribe(
        (data: any) => {
          console.log(data);
          this.showModalzid = false; // Hide modal after successful submission
          this.showSuccessMessage(); // Show success message
          this.loadgoals(); // Refresh goals list
        },
        (error: any) => {
          console.error("An error occurred:", error);
          const max = this.output-this.input;
          alert("lezmek tzid maximum "+max);
          this.closeModalzid();
          //this.showErrorMessage(); // Optional: Display an error message to the user
        }
      );
    } catch (errors) {
      console.error("Unexpected error:", errors);
      //this.showErrorMessage();
    }
  }
  
  openModalZid(id:any){
    this.showModalzid = true;
    this.id = id;
  }
  closeModalzid(){
    this.showModalzid= false;
  }
}
