import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../environments/environment';

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
    if (!code) {
      this.router.navigate(['']);
    }
    axios
      .get(`${environment.apiUrl}api/callback?code=` + code, {
        withCredentials: true,
      })
      .then(() => this.router.navigate(['dashboard']))
      .catch((err) => {
        console.warn(err);
        this.router.navigate(['']);
      });
  }
}
