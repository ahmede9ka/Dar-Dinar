import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Chart, registerables } from 'chart.js';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardComponent {
  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [30, 50, 20],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          }
        ]
      }
    });
  }
}