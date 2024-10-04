import { Component, Input, SimpleChanges } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
import { MatCardModule } from '@angular/material/card';

Drilldown(Highcharts);
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [HighchartsChartModule, MatCardModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  @Input() data: { data: any, drillDownData: any, categories: any } = {
    data: undefined,
    drillDownData: undefined,
    categories: undefined
  };
  @Input() title: string = 'Chart Title';
  @Input() chartType: 'pie' | 'bar' | 'column' = 'pie';
  @Input() subDrilldownAttribute: string = 'Product Name';
  @Input() suffix: string = '';
  @Input() formatter = ''
  @Input() xAxisLabel: string = ''
  @Input() yAxisLabel: string = ''
  @Input() isStacked: boolean = false

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['chartType']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    const { data, drillDownData, categories } = this.data;
    this.chartOptions = {
      chart: {
        type: this.chartType
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      title: {
        text: '',
      },
      accessibility: {
        announceNewData: {
          enabled: true
        },
        point: {
          valueSuffix: this.suffix
        }
      },
      series: this.isStacked ? data : [{
        type: this.chartType,
        name: this.yAxisLabel,
        data: data as any,
        showInLegend: true,
        dataLabels: {
          enabled: true,
          format: `{point.name}: {point.y: ${this.formatter}}` + this.suffix
        }
      }],
      drilldown: {
        series: drillDownData
      },
      xAxis: this.chartType !== 'pie' ? {
        type: 'category',
        title: { text: this.xAxisLabel },
        categories: categories
      } : undefined,
      yAxis: this.chartType !== 'pie' ? {
        title: { text: this.yAxisLabel }
      } : undefined,
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    };
    console.log(this.chartOptions)
  }
}
