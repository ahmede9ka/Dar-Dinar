import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // Fake monthly revenue data
  labeldata: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  tabdata: number[] = [1000, 1500, 1200, 1800, 1300, 1700, 1600, 1900, 2200, 2100, 2400, 2300]; // Fake revenue data

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeChart();
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
      type: 'bar', // 'line' can be used for a line chart
      data: {
        labels: this.labeldata, // Fake months
        datasets: [
          {
            label: 'Monthly Revenue',
            data: this.tabdata, // Fake revenue data
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light blue background
            borderColor: 'rgba(75, 192, 192, 1)', // Darker blue border
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
