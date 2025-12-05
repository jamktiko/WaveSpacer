import { Component, inject, OnInit, effect } from '@angular/core';
import { uiStore } from '../../../core/stores/ui.store';
import { profileStore } from '../../../core/stores/profile.store';
import { UserdropdownComponent } from '../../../shared/userdropdown/userdropdown.component';
import { DecadecardComponent } from '../decadecard/decadecard.component';
import { RouterLink } from '@angular/router';
import { settingStore } from '../../../core/stores/settings.store';
import { NgClass } from '@angular/common';
import { recentListensStore } from '../../../core/stores/recentlistens.store';
import { SonglistingComponent } from '../../../shared/songlisting/songlisting.component';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables, ChartDataLabels);
import { songStore } from '../../../core/stores/songs.store';
import { Genre } from '../../../core/interfaces/genre';

@Component({
  selector: 'app-statistics',
  imports: [
    UserdropdownComponent,
    DecadecardComponent,
    RouterLink,
    NgClass,
    SonglistingComponent,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  uiStore = inject(uiStore);
  profileStore = inject(profileStore);
  settingStore = inject(settingStore);
  recentlistensStore = inject(recentListensStore);
  songStore = inject(songStore);

  title: string = this.uiStore.title();
  profilepic!: string;
  chart!: any;
  chartInitialized: boolean = false; // check if chart is already initialized to prevent multiple initializations
  totalGenreListens!: number; // Total number of listens with every genre accounted

  decades = [
    {
      decade: "1970's",
      count: 13.5,
    },
    {
      decade: "1980's",
      count: 13.5,
    },
    {
      decade: "1990's",
      count: 13.5,
    },
    {
      decade: "2000's",
      count: 13.5,
    },
    {
      decade: "2010's",
      count: 13.5,
    },
    {
      decade: "2020's",
      count: 13.5,
    },
  ];

  otherCategories = [
    {
      category: 'Obscure',
      count: 13.5,
    },
    {
      category: 'Mainstream',
      count: 24.2,
    },
    {
      category: 'Average',
      count: 62.3,
    },
  ];

  chartColors = ['#6bb4cf', '#cc3e84', '#5b6ccf', '#7434a8', '#a03896'];

  constructor() {
    effect(() => {
      const genres = this.songStore.genres();

      if (genres && genres.length > 0 && !this.chartInitialized) {
        this.createChart(genres);
        this.chartInitialized = true;
        this.calculateGenreListenTotal();
      }
    });
  }

  ngOnInit(): void {
    this.profilepic = localStorage.getItem('profilepic') || 'placeholderpp.png';

    this.recentlistensStore.getRecentListens();
    this.songStore.getGenres();
  }

  createChart(genres: Genre[]) {
    const labels = genres.map((genre) => genre.genre);
    const amount = genres.map((genre) => genre.amount);

    const data = {
      labels: labels.slice(0, 5),
      datasets: [
        {
          data: amount.slice(0, 5),
          backgroundColor: this.chartColors,
          hoverOffset: 4,
        },
      ],
    };

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            formatter: (value: any, context: any) => {
              const dataset = context.chart.data.datasets[0];
              const total = dataset.data.reduce(
                (a: number, b: number) => a + b,
                0
              );
              const percentage = ((value / total) * 100).toFixed(1);

              return `${value} (${percentage}%)`;
            },
            color: '#000000',
            font: {
              size: 10,
              weight: 'bold',
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = (context.raw as number) || 0;
                const dataset = context.chart.data.datasets[0];
                const total = (dataset.data as number[]).reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
          legend: {
            labels: {
              color: '#FFFFFF',
            },
            position: 'bottom',
          },
        },
        aspectRatio: 2.5,
      },
      plugins: [ChartDataLabels],
    };

    this.chart = new Chart(
      document.getElementById('genreChart') as HTMLCanvasElement,
      config
    );
  }

  calculateGenreListenTotal() {
    this.totalGenreListens = this.songStore
      .genres()
      .reduce((acc, curVal) => acc + curVal.amount, 0);
  }
}
