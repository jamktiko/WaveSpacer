import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-spotify-cb',
  imports: [],
  templateUrl: './spotify-cb.component.html',
  styleUrl: './spotify-cb.component.css',
})
export class SpotifyCbComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    console.log('code:' + code);
    axios
      .get('http://127.0.0.1:8888/callback?code=' + code, {
        withCredentials: true,
      })
      .then((response) => this.router.navigate(['playlists']));
  }
}
