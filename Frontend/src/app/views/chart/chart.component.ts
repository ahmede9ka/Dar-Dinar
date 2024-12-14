import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { ChartsModule } from 'ng2-charts';
@Component({
  selector: 'app-chart',
  imports: [NgChartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})


export class ChartjsComponent implements OnInit {

  


  constructor() { }

  ngOnInit() {
  }
  datasets = [
    {
      data: [10, 20, 30],
      label: 'Series A',
    },
  ];
  labels = ['January', 'February', 'March'];
  options = {
    responsive: true,
  };
  type: string = 'bar'; // You can use 'line', 'bar', 'pie', etc.

}
