import { Component, inject, effect } from '@angular/core';
import { profileStore } from '../../core/stores/profile.store';
import { playlistStore } from '../../core/stores/playlist.store';
import { songStore } from '../../core/stores/songs.store';
import { OnInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables, ChartDataLabels);
import { SonglistingComponent } from '../../shared/songlisting/songlisting.component';
import { UserdropdownComponent } from '../../shared/userdropdown/userdropdown.component';
import { RouterLink } from '@angular/router';
import { uiStore } from '../../core/stores/ui.store';
import { recentListensStore } from '../../core/stores/recentlistens.store';
import { settingStore } from '../../core/stores/settings.store';
import { NgClass } from '@angular/common';
import { Genre } from '../../core/interfaces/genre';

@Component({
  selector: 'app-dashboard',
  imports: [SonglistingComponent, UserdropdownComponent, RouterLink, NgClass],
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

  title: String = this.uiStore.title();
  randomPlaylistImg!: string; // On playlist-clean segment, a random playlist img (of user's playlists) is shown
  chart!: any;
  chartInitialized: boolean = false; // check if chart is already initialized to prevent multiple initializations
  daysSinceRegister: number = 0; // used in formatDate-method
  lastTimePlayed!: string; // used in formatDate-method

  chartColors = [
    '#4CC9F0',
    '#F72585',
    '#4361EE',
    '#7209B7',
    '#B5179E',
    '#3A0CA3',
    '#4895EF',
  ];

  constructor() {
    // Using effect to make sure the api requests have concluded before doing anything else
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

  /* This method are used for two different elements, the number that shows days since register and the day the last month's favorite
  song was listened to
  */
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

  // Convert last month's favorite's duration to minutes and seconds
  msToMinSec(ms: number | null) {
    if (typeof ms === 'number') {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds}`;
    } else {
      return console.log('duration is null');
    }
  }
}
