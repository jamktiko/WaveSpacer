import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeService } from '../home.service';

//aws testi push kommentti 6

@Component({
  selector: 'app-homepage',
  imports: [RouterModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent {
  constructor(private homeService: HomeService) {}

  title = 'WaveSpacer';

  login() {
    location.href = 'http://127.0.0.1:8888/login';
  }

  toHomeScreen() {
    this.homeService.toHomeScreen();
  }
}
