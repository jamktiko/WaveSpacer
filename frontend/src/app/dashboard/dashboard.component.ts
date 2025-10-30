import { Component, inject, effect } from '@angular/core';
import { profileStore } from '../utilities/stores/profile.store';
import { playlistStore } from '../utilities/stores/playlist.store';
import { songStore } from '../utilities/stores/songs.store';
import { OnInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Songdata } from '../utilities/interfaces/songdata';
import { RecentlistenedComponent } from '../recentlistened/recentlistened.component';
import { UserdropdownComponent } from '../userdropdown/userdropdown.component';
Chart.register(...registerables, ChartDataLabels);
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RecentlistenedComponent, UserdropdownComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  title: String = 'WaveSpacer';
  randomPlaylistImg!: string;
  randomSong = {
    img: '',
    song: '',
    artist: '',
  };
  chart!: any;
  userDropDownVisible: boolean = false;

  profileStore = inject(profileStore);
  playlistStore = inject(playlistStore);
  songStore = inject(songStore);

  constructor() {
    effect(() => {
      const playlists = this.playlistStore.playlists();
      const songs = this.songStore.songs();

      if (playlists.length > 0) {
        const index = Math.floor(Math.random() * playlists.length);
        this.randomPlaylistImg = this.playlistStore.playlists()[index].img;
      }

      if (songs.length > 0) {
        const index = Math.floor(Math.random() * songs.length);
        const randomSong: Songdata = this.songStore.songs()[index];
        this.randomSong.img = randomSong.track_image || '';
        this.randomSong.song = randomSong.name || '';
        this.randomSong.artist = randomSong.artist_names?.join(', ') || '';
      }
    });
  }

  ngOnInit(): void {
    this.profileStore.getProfile();
    this.playlistStore.getPlaylists();
    this.createChart();
    // localStorage.removeItem('selectedPlaylist');
  }

  createChart() {
    const data = {
      labels: ['a', 'b', 'c', 'd', 'e'],
      datasets: [
        {
          data: [100, 50, 30, 20, 10],
          backgroundColor: ['red', 'green', 'blue', 'purple', 'yellow'],
          hoverOffset: 4,
        },
      ],
    };

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data,
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            formatter: (value: any, context: any) => {
              const dataset = context.chart.data.datasets[0];
              const total = dataset.data.reduce(
                (a: number, b: number) => a + b,
                0
              );
              const percentage = ((value / total) * 100).toFixed(1);
              const label = context.chart.data.labels[context.dataIndex];
              return `${label}\n${value} (${percentage}%)`;
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
}
