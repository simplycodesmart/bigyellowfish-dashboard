import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Papa, ParseResult } from 'ngx-papaparse';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ChartComponent } from "../charts/chart.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavBarComponent, ChartComponent, NgxSkeletonLoaderModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  orders: any[] = [];
  pieChartDataCategoryPercentage: any;
  monthlySalesTrendChart: any;
  regionWiseSegmentSales: any;
  pofitbyCityChart: any;
  lossbyCityChart: any;
  shipData: any

  listOfYear: any = [];
  selectedYear = '2017'


  constructor(private readonly route: ActivatedRoute, private readonly papa: Papa) { }

  ngOnInit(): void {
    this.fetchAnalyticsData();
  }

  fetchAnalyticsData() {
    this.route.data.subscribe((data) => {
      this.papa.parse(data['dashboardData'], {
        complete: (result: ParseResult) => {
          const headers = result.data[0];
          const rows = result.data.slice(1);
          this.orders = rows.map((row: { [x: string]: any; }) => {
            return headers.reduce((acc: { [x: string]: any; }, header: string | number, index: string | number) => {
              acc[header] = row[index];
              return acc;
            }, {});
          });
          this.getListOfYears()
          this.calculatePieChartCategoryCount();
          this.calculateMonthlySales();
          this.calculateRegionWiseSegmentSales();
          this.pofitbyCityChart = this.createCityProfitChart(false);
          this.lossbyCityChart = this.createCityProfitChart(true);
          this.calcShipData()
        }
      });
    });
  }

  calcShipData(): void {
    const quantityByShipMode = this.orders.reduce((acc, item) => {
      const shipMode = item["Ship Mode"];
      const quantity = parseInt(item.Quantity);

      if (!acc[shipMode]) {
        acc[shipMode] = 0;
      }

      acc[shipMode] += quantity;
      return acc;
    }, {});

    const data = Object.entries(quantityByShipMode).map(([shipMode, quantity]) => ({
      name: shipMode,
      y: quantity
    }));
    this.shipData = { data }
  }

  private calculateRegionWiseSegmentSales() {

    const salesByRegionAndSegment: any = this.orders.reduce((acc, item) => {
      const region = item.Region;
      const segment = item.Segment;
      const sales = parseFloat(item['Quantity']);
      if (!acc[region]) {
        acc[region] = {};
      }
      if (!acc[region][segment]) {
        acc[region][segment] = 0;
      }
      acc[region][segment] += sales;
      return acc;
    }, {});

    const seriesData: { name: any; data: any[]; }[] = [];
    const categories = Object.keys(salesByRegionAndSegment);
    const segments = new Set();
    categories.forEach(region => {
      const segmentData = salesByRegionAndSegment[region];
      for (const segment in segmentData) {
        segments.add(segment);
      }
    });
    segments.forEach((segment: any) => {
      const segmentSales = categories.map(region => {
        return salesByRegionAndSegment[region][segment] || 0;
      });

      seriesData.push({
        name: segment,
        data: segmentSales
      });
    });

    this.regionWiseSegmentSales = { data: seriesData, categories }
  }

  private getListOfYears(): void {
    //assume data is only from 2000
    this.listOfYear = [...new Set(this.orders.map(dateStr => `20${dateStr['Order Date'].slice(-2)}`))].sort((a, b) => Number(b) - Number(a))
  }


  private calculatePieChartCategoryCount(): void {
    const tempData = this.orders.reduce((acc, curr) => {
      acc[curr.Category] = (acc[curr.Category] || 0) + 1;
      return acc;
    }, {})

    const data = Object.entries(tempData).map(item => {
      const [name, value] = item;

      const data = {
        name: name,
        y: Number(((Number(value) / this.orders.length) * 100).toFixed(2)),
        drilldown: name
      }

      return data;
    })

    const drillDownData = this.getDrillDownDataPiePerncetage()

    this.pieChartDataCategoryPercentage = { data, drillDownData }

  }

  private getDrillDownDataPiePerncetage() {
    const grouped = this.orders.reduce((acc, item) => {
      const category = item.Category;
      const subCategory = item["Sub-Category"];

      if (!acc[category]) {
        acc[category] = {};
      }

      if (!acc[category][subCategory]) {
        acc[category][subCategory] = 1; // Initialize count
      } else {
        acc[category][subCategory] += 1; // Increment count
      }

      return acc;
    }, {});

    return Object.entries(grouped).map(([category, subCategories]) => ({
      id: category,
      name: category,
      data: Object.entries(subCategories as any).map(([subCategory, count]) => [
        subCategory,
        count
      ])
    }));
  }

  getCategoryData() {
    const categories: { [key: string]: number } = {};
    this.orders.forEach(order => {
      const category = order['Category'];
      categories[category] = (categories[category] || 0) + 1;
    });

    return Object.keys(categories).map(key => ({
      name: key,
      y: categories[key],
    }));
  }

  private calculateMonthlySales(): void {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const salesByMonth = this.orders.filter(res => res['Order Date'].slice(-2) == this.selectedYear.slice(-2)).reduce((acc, item) => {
      const monthNumber = item['Order Date'].split('/')[1];
      const monthYear = monthNames[monthNumber - 1];
      const sales = parseFloat(item.Quantity);
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += sales;
      return acc;
    }, {})
    const data = Object.entries(salesByMonth).map(([monthYear, totalSales]) => ({
      monthYear,
      totalSales
    })).map(item => ({
      name: item.monthYear,
      y: item.totalSales
    })).sort((a, b) => monthNames.indexOf(a.name) - monthNames.indexOf(b.name));;

    this.monthlySalesTrendChart = { data }
  }


  private createCityProfitChart(isLossMaking = false) {
    // Step 1: Aggregate profit by city
    const profitByCity = this.orders.reduce((acc, item) => {
      const city = item.City;
      const profit = parseFloat(item.Profit);
      if (!acc[city]) {
        acc[city] = 0;
      }
      acc[city] += profit;
      return acc;
    }, {});

    const sortedCities = Object.entries(profitByCity)
      .map(([City, Profit]) => ({ City, Profit }))
      .sort((a, b) => isLossMaking ? Number(a.Profit) - Number(b.Profit) : Number(b.Profit) - Number(a.Profit))
      .slice(0, 10);
    const categories = sortedCities.map(item => item.City);
    const profits = sortedCities.map(item => {
      return { y: item.Profit, color: isLossMaking ? 'red' : 'blue', name: item.City }
    });
    return { data: profits, categories }
  }

  onFilterChange(filter: any): void {
    if (this.selectedYear !== filter.year) {
      this.selectedYear = filter.year;
      this.calculateMonthlySales()
    }
  }
}
