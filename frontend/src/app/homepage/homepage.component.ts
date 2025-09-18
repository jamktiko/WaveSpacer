import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-homepage',
  imports: [RouterModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent {
  constructor(private router: Router) {}

  title = 'WaveSpacer';

  // navigateToPlaylists() {
  //   this.router.navigate(['playlists']);
  // }

  login() {
    location.href = 'http://127.0.0.1:8888/login';
    // axios
    //   .get('http://127.0.0.1:8888/login')
    //   .then((response) => console.log(response));
  }
}
