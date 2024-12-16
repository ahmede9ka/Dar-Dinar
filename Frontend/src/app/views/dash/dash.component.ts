import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {
  labeldata: string[] = [
    'January', 'February', 'March', 'April', 'May', 
    'June', 'July', 'August', 'September', 'October', 
    'November', 'December'
  ];
  tabdata: number[] = [1000, 1500, 1200, 1800, 1300, 1700, 1600, 1900, 2200, 2100, 2400, 2300]; 

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeChart();
    }
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
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
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
}
