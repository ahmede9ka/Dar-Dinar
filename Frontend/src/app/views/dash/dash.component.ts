import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MasroufService } from '../../services/masrouf.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RevenueService } from '../../services/revenue.service';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { GoalService } from '../../services/goal.service';
import { NgForOf } from '@angular/common';
import { AdviceService } from '../../services/advice.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dash',
  imports: [MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule,SideBarComponent,CommonModule],
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {
  selectedDate: Date | undefined;
  months: string[] = [];
  valuemonth: number[] = [];
  types: string[] = [];
  values: number[] = [];
  masroufmonth: number = 0;
  masroufyear: number = 0;
  revenuemonth: number = 0;
  revenueyear: number = 0;
  barChartInstance: any; // To handle existing bar chart instance
  pieChartInstance: any; // To handle existing pie chart instance
  goals:any;
  advice:any;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private masroufservice: MasroufService,
    private authservice: AuthService,
    private router: Router,
    private revenueservice: RevenueService,
    private goalservice:GoalService,
    private adviceservice:AdviceService
  ) {}

  ngOnInit(): void {
    this.selectedDate = new Date();

    this.loadData();

    if (isPlatformBrowser(this.platformId)) {
      this.initializeChart();
      this.initializeChart2();
    }
    this.getadvice();
  }

  loadData(): void {
    this.authservice.current().subscribe({
      next: (data) => console.log(data),
      error: (err) => console.error('Error fetching current user:', err)
    });

    this.masroufservice.getAllMasroufMonth().subscribe({
      next: (data: any) => this.masroufmonth = data[0]?.total_value || 0,
      error: (err) => console.error('Error fetching monthly masrouf:', err)
    });

    this.masroufservice.getAllMasroufYear().subscribe({
      next: (data: any) => this.masroufyear = data[0]?.total_value || 0,
      error: (err) => console.error('Error fetching yearly masrouf:', err)
    });

    this.revenueservice.getMonthlyRevenue().subscribe({
      next: (data: any) => this.revenuemonth = data[0]?.total_value || 0,
      error: (err) => console.error('Error fetching monthly revenue:', err)
    });

    this.revenueservice.getYearlyRevenue().subscribe({
      next: (data: any) => this.revenueyear = data[0]?.total_value || 0,
      error: (err) => console.error('Error fetching yearly revenue:', err)
    });
    this.goalservice.getAllgoals().subscribe((data: any) => {
      console.log(data);
      const user = JSON.parse(localStorage.getItem('user') || '{}'); // Parse the stored user object
      console.log(user);
      
      // Filter goals for the current user and get only the first three
      this.goals = data.filter((goal: any) => goal.user.id === user.id).slice(0, 3);
      
      console.log('Filtered goals:', this.goals);
    });


    
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  initializeChart(): void {
    this.revenueservice.getRevenueOfAllMonths().subscribe({
      next: (data: any) => {
        this.months = data.map((item: any) => item.month_name);
        this.valuemonth = data.map((item: any) => item.total_value);

        const canvasElement = document.getElementById('chart-line') as HTMLCanvasElement;
        if (!canvasElement) {
          console.error('Canvas element with id "chart-line" not found.');
          return;
        }

        if (this.barChartInstance) {
          this.barChartInstance.destroy();
        }

        this.barChartInstance = new Chart(canvasElement, {
          type: 'bar',
          data: {
            labels: this.months,
            datasets: [
              {
                label: 'Monthly Revenue',
                data: this.valuemonth,
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true, position: 'top' }
            },
            scales: { y: { beginAtZero: true } }
          }
        });
      },
      error: (err) => console.error('Error fetching monthly revenue data:', err)
    });
  }

  initializeChart2(): void {
    this.masroufservice.getMonthMasroufOfAllTypes().subscribe({
      next: (data: any) => {
        this.types = data.map((item: any) => item.type);
        this.values = data.map((item: any) => item.total_value);

        const canvasElement = document.getElementById('chart-pie') as HTMLCanvasElement;
        if (!canvasElement) {
          console.error('Canvas element with id "chart-pie" not found.');
          return;
        }

        if (this.pieChartInstance) {
          this.pieChartInstance.destroy();
        }

        this.pieChartInstance = new Chart(canvasElement, {
          type: 'pie',
          data: {
            labels: this.types,
            datasets: [
              {
                data: this.values,
                backgroundColor: this.generateColors(this.types.length),
                hoverBackgroundColor: this.generateColors(this.types.length, true)
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                labels: { boxWidth: 20 }
              }
            }
          }
        });
      },
      error: (err) => console.error('Error fetching masrouf data:', err)
    });
  }

  generateColors(count: number, isHover: boolean = false): string[] {
    const baseColors = ['#4CAF50', '#FFD700', '#1F2937', '#A5D6A7', '#FFEB3B', '#FF5722', '#673AB7', '#00BCD4', '#E91E63', '#8BC34A'];
    const colors = Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
    return isHover ? colors.map(color => this.adjustBrightness(color, 30)) : colors;
  }

  adjustBrightness(hex: string, amount: number): string {
    let usePound = false;

    if (hex[0] === '#') {
      hex = hex.slice(1);
      usePound = true;
    }

    const num = parseInt(hex, 16);
    let r = Math.min(255, Math.max(0, (num >> 16) + amount));
    let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    let b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));

    return (usePound ? '#' : '') + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  }
  getadvice(){
    this.adviceservice.getadvice().subscribe((data:any)=>{
      console.log(data);
      this.advice = data;
    })
  }
}
