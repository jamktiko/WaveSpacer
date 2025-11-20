import { Component, inject, effect } from '@angular/core';
import { profileStore } from '../utilities/stores/profile.store';
import { playlistStore } from '../utilities/stores/playlist.store';
import { songStore } from '../utilities/stores/songs.store';
import { OnInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables, ChartDataLabels);
import { RecentlistenedComponent } from '../recentlistened/recentlistened.component';
import { UserdropdownComponent } from '../userdropdown/userdropdown.component';
import { RouterLink } from '@angular/router';
import { uiStore } from '../utilities/stores/ui.store';
import { recentListensStore } from '../utilities/stores/recentlistens.store';
import { settingStore } from '../utilities/stores/settings.store';
import { NgClass } from '@angular/common';
import { Genre } from '../utilities/interfaces/genre';
import { ApiService } from '../utilities/services/api.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    RecentlistenedComponent,
    UserdropdownComponent,
    RouterLink,
    NgClass,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  profileStore = inject(profileStore);
  playlistStore = inject(playlistStore);
  songStore = inject(songStore);
  uiStore = inject(uiStore);
  recentlistensStore = inject(recentListensStore);
  settingStore = inject(settingStore);
  a = inject(ApiService);

  title: String = this.uiStore.title();
  randomPlaylistImg!: string;
  chart!: any;
  userDropDownVisible: boolean = false;
  chartInitialized: boolean = false;
  daysSinceRegister: number = 0;
  lastTimePlayed!: string;

  colors = [
    '#4CC9F0',
    '#F72585',
    '#4361EE',
    '#7209B7',
    '#B5179E',
    '#3A0CA3',
    '#4895EF',
  ];

  constructor() {
    effect(() => {
      const playlists = this.playlistStore.playlists();
      const genres = this.songStore.genres();
      const regDate = this.profileStore.regdate();
      const lastMonthFav = this.recentlistensStore.lastMonthFav();

      if (playlists.length > 0) {
        const index = Math.floor(Math.random() * playlists.length);
        this.randomPlaylistImg = this.playlistStore.playlists()[index].img;
      }

      if (genres && genres.length > 0 && !this.chartInitialized) {
        this.createChart(genres);
        this.chartInitialized = true;
      }

      if (regDate) {
        this.formatDate(regDate, 'day');
      }

      if (lastMonthFav) {
        this.formatDate(lastMonthFav.last_played);
      }
    });
  }

  ngOnInit(): void {
    this.profileStore.getProfile();
    this.playlistStore.getPlaylists();
    this.songStore.getGenres();
    this.recentlistensStore.getLastMonthFav();
    localStorage.removeItem('selectedPlaylist');
    this.recentlistensStore.getRecentListens();
    if (localStorage.getItem('lightmode')) {
      if (JSON.parse(localStorage.getItem('lightmode') || '')) {
        this.settingStore.turnOnLightMode();
      }
    }
    this.a.getLastMonthFavorite2();
  }

  createChart(genres: Genre[]) {
    const labels = genres.map((genre) => genre.genre);
    const amount = genres.map((genre) => genre.amount);

    const data = {
      labels: labels.slice(0, 5),
      datasets: [
        {
          data: amount.slice(0, 5),
          backgroundColor: this.colors,
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

  formatDate(date: any, type: string = 'date') {
    if (type === 'day') {
      const date1 = new Date();
      const date2 = new Date(date);
      this.daysSinceRegister =
        (date1.getTime() - date2.getTime()) / (1000 * 3600 * 24);
    } else {
      this.lastTimePlayed = new Date(date).toLocaleDateString();
    }
  }
}
