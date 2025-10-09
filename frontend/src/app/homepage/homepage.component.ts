import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';

//aws testi push kommentti 7

@Component({
  selector: 'app-homepage',
  imports: [RouterModule, RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent {
  constructor() {}

  title = 'WaveSpacer';

  login() {
    location.href = 'http://127.0.0.1:8888/login';
  }
}
