import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MasroufService } from '../../services/masrouf.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
Chart.register(...registerables);

@Component({
  selector: 'app-dash',
  imports: [MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule],
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {
  selectedDate: Date | undefined;
  labeldata: string[] = [
    'January', 'February', 'March', 'April', 'May', 
    'June', 'July', 'August', 'September', 'October', 
    'November', 'December'
  ];
  tabdata: number[] = [1000, 1500, 1200, 1800, 1300, 1700, 1600, 1900, 2200, 2100, 2400, 2300]; 

  // Example Pie Chart Data
  pieChartData: number[] = [300, 450, 120, 100, 250]; 
  pieChartLabels: string[] = ['Red', 'Blue', 'Yellow', 'Green', 'Purple'];
  masroufmonth:any;
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private masroufservice:MasroufService,private authservice:AuthService,private router:Router) {}

  ngOnInit(): void {
    this.selectedDate = new Date();
    if (isPlatformBrowser(this.platformId)) {
      this.initializeChart();  // Bar Chart
      this.initializeChart2(); // Pie Chart
    }
    this.authservice.current().subscribe((data:any)=>{
      console.log(data);
    })
    this.masroufservice.getAllMasroufMonth().subscribe((data:any)=>{
      console.log(data);
      this.masroufmonth = data[0].total_value;
    })
  } 
  logout(): void {
    
    this.router.navigate(['/login']);

  }

  initializeChart(): void {
    const canvasElement = document.getElementById('chart-line') as HTMLCanvasElement;

    if (!canvasElement) {
      console.error('Canvas element with id "chart-line" not found.');
      return;
    }

    if (!this.labeldata.length || !this.tabdata.length) {
      console.error('Chart labels or data are missing.');
      return;
    }

    new Chart(canvasElement, {
      type: 'bar',
      data: {
        labels: this.labeldata,
        datasets: [
          {
            label: 'Monthly Revenue',
            data: this.tabdata,
            backgroundColor: 'rgba(255, 215, 0, 0.2)',  // Light gold with transparency
            borderColor: 'rgba(255, 215, 0, 1)',  // Gold border color

            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  initializeChart2(): void {
    const canvasElement = document.getElementById('chart-pie') as HTMLCanvasElement;

    if (!canvasElement) {
      console.error('Canvas element with id "chart-pie" not found.');
      return;
    }

    if (!this.pieChartData.length || !this.pieChartLabels.length) {
      console.error('Pie chart labels or data are missing.');
      return;
    }

    new Chart(canvasElement, {
      type: 'pie', // Change to 'pie' for Pie chart
      data: {
        labels: this.pieChartLabels, // Use pie chart specific labels
        datasets: [
          {
            data: this.pieChartData, // Use pie chart specific data
            backgroundColor:  ['#4CAF50', '#FFD700', '#1F2937', '#A5D6A7', '#FFEB3B'],
            hoverBackgroundColor: ['#A5D6A7', '#FFEB8B', '#BCC6D3', '#A5D6A7', '#FFF59D'],

          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 20
            }
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  }
}
